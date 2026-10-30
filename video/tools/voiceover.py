"""Генерує озвучку, таймлайн і субтитри для відеолекції.

Джерело тексту: lecture/script.json (сцени → бити-абзаци).
Розмітка [показати|прочитати] — на екрані й у субтитрах «показати»,
диктор читає «прочитати» (наприклад, [MSCEIT|ем-ес-сі-ай-ті]).

Результат:
  public/voiceover/<scene>-<n>.mp3   — аудіо кожного біту (кешується за хешем тексту)
  public/voiceover/<scene>-<n>.json  — межі слів від TTS
  src/lecture/timeline.json          — кадри сцен, бітів і слів + субтитри для Remotion
  out/final.srt                      — субтитри
  lecture/plan.md                    — поминутний план із фактичними таймінгами

Запуск (з папки video):  .venv-tts/Scripts/python tools/voiceover.py
"""

import asyncio
import difflib
import hashlib
import json
import math
import re
import subprocess
import sys
import warnings
import wave
from pathlib import Path

import edge_tts

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "lecture" / "script.json"
VO_DIR = ROOT / "public" / "voiceover"
STYLE_VO_DIR = ROOT / "public" / "voiceover-styletts2"
STYLE_MODEL_DIR = ROOT / "models" / "styletts2-uk" / "uk"
OMNI_VO_DIR = ROOT / "public" / "voiceover-omnivoice"
TIMELINE = ROOT / "src" / "lecture" / "timeline.json"
SRT = ROOT / "out" / "final.srt"
PLAN = ROOT / "lecture" / "plan.md"
FFPROBE = ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc" / "ffprobe.exe"

FPS = 30
HEAD = 0.5  # тиша на початку сцени, поки з'являється заголовок
GAP = 0.4  # пауза між бітами
TAIL = 0.75  # тиша наприкінці сцени
LAST_TAIL = 2.5  # довший фінал останньої сцени

MARKUP = re.compile(r"\[([^|\]]+)\|([^\]]+)\]")


def tokenize(beat: str):
    """Розбиває біт на токени {display, spoken}; розмітка — один токен."""
    tokens = []
    pos = 0
    for m in MARKUP.finditer(beat):
        for w in beat[pos : m.start()].split():
            tokens.append({"display": w, "spoken": w})
        # розділові знаки одразу після розмітки чіпляємо до неї
        tail = re.match(r"[^\s\[]*", beat[m.end() :]).group(0)
        tokens.append({"display": m.group(1) + tail, "spoken": m.group(2) + tail})
        pos = m.end() + len(tail)
    for w in beat[pos:].split():
        tokens.append({"display": w, "spoken": w})
    return tokens


def probe_duration(path: Path) -> float:
    out = subprocess.run(
        [str(FFPROBE), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(out.stdout.strip())


async def synthesize(text: str, voice: str, rate: str, mp3: Path, meta: Path):
    key = hashlib.sha1(f"{voice}|{rate}|{text}".encode()).hexdigest()
    if mp3.exists() and meta.exists():
        cached = json.loads(meta.read_text(encoding="utf-8"))
        if cached.get("hash") == key:
            return cached
    for attempt in range(4):
        try:
            audio = bytearray()
            words = []
            comm = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    audio += chunk["data"]
                elif chunk["type"] == "WordBoundary":
                    words.append(
                        {
                            "text": chunk["text"],
                            "start": chunk["offset"] / 1e7,
                            "end": (chunk["offset"] + chunk["duration"]) / 1e7,
                        }
                    )
            mp3.write_bytes(audio)
            data = {"hash": key, "text": text, "words": words, "duration": probe_duration(mp3)}
            meta.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"  синтезовано {mp3.name} ({data['duration']:.1f} с)")
            return data
        except Exception as e:  # мережеві збої — повторюємо
            print(f"  повтор {mp3.name}: {e}")
            await asyncio.sleep(2 + attempt * 3)
    raise RuntimeError(f"Не вдалося синтезувати {mp3.name}")


def normalized_word(text: str) -> str:
    return "".join(re.findall(r"[a-zа-щьюяґєії0-9]+", text.lower().replace("ʼ", "'")))


def asr_word_times(reference: list[str], recognized, duration: float):
    """Зіставляє слова сценарію з часовими мітками Whisper; пропуски інтерполює."""
    source = [(w.word.strip(), float(w.start), float(w.end)) for segment in recognized for w in (segment.words or [])]
    ref_norm = [normalized_word(w) for w in reference]
    src_norm = [normalized_word(w[0]) for w in source]
    result = [None] * len(reference)
    matcher = difflib.SequenceMatcher(a=ref_norm, b=src_norm, autojunk=False)
    for operation, i1, i2, j1, j2 in matcher.get_opcodes():
        if operation == "equal":
            for i, j in zip(range(i1, i2), range(j1, j2)):
                result[i] = (source[j][1], source[j][2])
        elif i1 < i2:
            start = source[j1][1] if j1 < len(source) else duration
            end = source[j2 - 1][2] if j2 > j1 else start
            if j1 == j2:
                start = result[i1 - 1][1] if i1 and result[i1 - 1] else 0.0
                end = source[j1][1] if j1 < len(source) else duration
            weights = [max(1, len(normalized_word(w))) for w in reference[i1:i2]]
            total = sum(weights)
            cursor = start
            for i, weight in zip(range(i1, i2), weights):
                next_time = cursor + (end - start) * weight / total
                result[i] = (cursor, next_time)
                cursor = next_time
    return [
        {"text": word, "start": round(max(0.0, timing[0]), 4), "end": round(min(duration, timing[1]), 4)}
        for word, timing in zip(reference, result)
    ]


class StyleTTS2Voice:
    """Локальна українська StyleTTS2 + часові мітки слів з Whisper."""

    def __init__(self, voice: str, speed: float):
        import numpy as np
        import onnxruntime as ort
        from faster_whisper import WhisperModel
        from ipa_uk import ipa
        from ukrainian_word_stress import Stressifier

        self.np = np
        self.ipa = ipa
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", UserWarning)
            self.stress = Stressifier()
        names = json.loads((STYLE_MODEL_DIR / "voices.json").read_text(encoding="utf-8"))
        self.voice = voice
        self.speed = speed
        self.style = np.fromfile(STYLE_MODEL_DIR / "voices.bin", dtype="<f4").reshape(-1, 256)[names.index(voice):names.index(voice) + 1]
        self.vocab = {char: i for i, char in enumerate(json.loads((STYLE_MODEL_DIR / "vocab.json").read_text(encoding="utf-8")))}
        self.session = ort.InferenceSession(str(STYLE_MODEL_DIR / "model.onnx"))
        self.whisper = WhisperModel("small", device="cpu", compute_type="int8")

    def synthesize(self, text: str, wav_path: Path, meta_path: Path):
        key = hashlib.sha1(f"styletts2-uk|{self.voice}|{self.speed}|{text}".encode()).hexdigest()
        if wav_path.exists() and meta_path.exists():
            cached = json.loads(meta_path.read_text(encoding="utf-8"))
            if cached.get("hash") == key:
                return cached

        np = self.np
        phonemes = self.ipa(self.stress(text))
        ids = np.asarray([self.vocab[c] for c in phonemes if c in self.vocab], dtype=np.int64)
        samples, _ = self.session.run(None, {
            "tokens": ids,
            "speed": np.asarray(self.speed, dtype=np.float32),
            "s_prev": self.style,
        })
        samples = np.asarray(samples).reshape(-1)
        duration = len(samples) / 24000
        # Whisper очікує 16 кГц, а модель видає 24 кГц.
        positions = np.arange(round(len(samples) * 2 / 3), dtype=np.float64) * 1.5
        asr_audio = np.interp(positions, np.arange(len(samples)), samples).astype(np.float32)
        segments, _ = self.whisper.transcribe(asr_audio, language="uk", beam_size=5, word_timestamps=True, vad_filter=False)
        words = asr_word_times(text.split(), list(segments), duration)
        pcm = (np.clip(samples, -1, 1) * 32767).astype("<i2")
        wav_path.parent.mkdir(parents=True, exist_ok=True)
        with wave.open(str(wav_path), "wb") as out:
            out.setnchannels(1)
            out.setsampwidth(2)
            out.setframerate(24000)
            out.writeframes(pcm.tobytes())
        data = {"hash": key, "text": text, "words": words, "duration": duration, "voice": self.voice}
        meta_path.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"  синтезовано {wav_path.name} ({duration:.1f} с)", flush=True)
        return data


class OmniVoiceClone:
    """Клон голосу за коротким зразком (OmniVoice, локально на GPU) + часові мітки слів з Whisper.

    Модель OmniVoice — CC-BY-NC: лише для некомерційного використання.
    """

    def __init__(self, ref_audio: str, ref_text: str, speed: float):
        import numpy as np
        import torch
        from faster_whisper import WhisperModel
        from omnivoice import OmniVoice

        self.np = np
        self.torch = torch
        self.ref_audio = str(ROOT / ref_audio)
        self.ref_text = ref_text
        self.speed = speed
        self.model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cuda:0", dtype=torch.float16)
        self.whisper = WhisperModel("small", device="cpu", compute_type="int8")

    def _trim(self, samples):
        # обрізаємо тишу по краях, лишаючи 60 мс, щоб паузи між бітами були рівними
        np = self.np
        env = np.convolve(np.abs(samples), np.ones(240) / 240, mode="same")
        loud = np.where(env > 0.01)[0]
        if len(loud) == 0:
            return samples
        pad = int(0.06 * 24000)
        return samples[max(0, loud[0] - pad) : min(len(samples), loud[-1] + pad)]

    def synthesize(self, text: str, wav_path: Path, meta_path: Path, display: str | None = None):
        key = hashlib.sha1(f"omnivoice|{self.ref_audio}|{self.ref_text}|{self.speed}|{text}".encode()).hexdigest()
        if wav_path.exists() and meta_path.exists():
            cached = json.loads(meta_path.read_text(encoding="utf-8"))
            if cached.get("hash") == key:
                return cached

        np = self.np
        reference = text.split()
        spoken_norm = [normalized_word(w) for w in reference]
        # Whisper пише роки цифрами, тож порівнюємо ще й з екранним текстом (там «1990», а не словами).
        display_norm = [normalized_word(w) for w in (display or text).split()]
        best = None
        # Генерація стохастична: якщо Whisper розпізнає текст погано, пробуємо інше зерно.
        for seed in range(5):
            self.torch.manual_seed(1000 + seed)
            samples = self.model.generate(text=text, ref_audio=self.ref_audio, ref_text=self.ref_text, speed=self.speed)[0]
            samples = self._trim(np.asarray(samples, dtype=np.float32))
            positions = np.arange(round(len(samples) * 2 / 3), dtype=np.float64) * 1.5
            asr_audio = np.interp(positions, np.arange(len(samples)), samples).astype(np.float32)
            segments = list(self.whisper.transcribe(asr_audio, language="uk", beam_size=5, word_timestamps=True, vad_filter=False)[0])
            heard = [normalized_word(w.word) for s in segments for w in (s.words or [])]
            score = max(
                difflib.SequenceMatcher(a=spoken_norm, b=heard, autojunk=False).ratio(),
                difflib.SequenceMatcher(a=display_norm, b=heard, autojunk=False).ratio(),
            )
            if best is None or score > best[0]:
                best = (score, samples, segments)
            if score >= 0.92:
                break
        score, samples, segments = best
        duration = len(samples) / 24000
        words = asr_word_times(reference, segments, duration)
        pcm = (np.clip(samples, -1, 1) * 32767).astype("<i2")
        wav_path.parent.mkdir(parents=True, exist_ok=True)
        with wave.open(str(wav_path), "wb") as out:
            out.setnchannels(1)
            out.setsampwidth(2)
            out.setframerate(24000)
            out.writeframes(pcm.tobytes())
        data = {"hash": key, "text": text, "words": words, "duration": duration, "asrScore": round(score, 3)}
        meta_path.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        flag = "" if score >= 0.9 else "  ⚠ перевірте на слух"
        print(f"  синтезовано {wav_path.name} ({duration:.1f} с, збіг {score * 100:.0f}%){flag}", flush=True)
        return data


def loudnorm_beat(wav_path: Path, meta_path: Path, data: dict) -> dict:
    """Вирівнює гучність біту (≈ −16 LUFS, піки ≤ −1.5 dBTP); один раз, позначка в meta."""
    if data.get("loudnorm"):
        return data
    ffmpeg = FFPROBE.with_name("ffmpeg.exe")
    tmp = wav_path.with_suffix(".tmp.wav")
    subprocess.run(
        [str(ffmpeg), "-v", "error", "-y", "-i", str(wav_path), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", str(tmp)],
        check=True,
    )
    tmp.replace(wav_path)
    data = {**data, "loudnorm": True, "duration": probe_duration(wav_path)}
    meta_path.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    return data


def measure_gain(paths: list[Path], target_lufs: float = -19.0) -> float:
    """Підсилення (множник) для всієї озвучки.

    Біти моно, а відео — стерео: дублювання каналу додає ≈ 3 LU, тож ціль −19 LUFS для моно ≈ −16 LUFS у відео.
    """
    import tempfile

    ffmpeg = FFPROBE.with_name("ffmpeg.exe")
    with tempfile.TemporaryDirectory() as tmp:
        listing = Path(tmp) / "list.txt"
        listing.write_text("".join(f"file '{p.as_posix()}'\n" for p in paths), encoding="utf-8")
        err = subprocess.run(
            [str(ffmpeg), "-hide_banner", "-f", "concat", "-safe", "0", "-i", str(listing), "-af", "loudnorm=print_format=json", "-f", "null", "-"],
            capture_output=True,
            text=True,
        ).stderr
    stats = json.loads(err[err.rindex("{") : err.rindex("}") + 1])
    gain_db = min(target_lufs - float(stats["input_i"]), -1.0 - float(stats["input_tp"]))
    print(f"Гучність озвучки: {stats['input_i']} LUFS, піки {stats['input_tp']} dBTP → підсилення {gain_db:+.1f} дБ")
    return round(10 ** (gain_db / 20), 3)


def align(tokens, spoken_text: str, words):
    """Ставить кожному токену час початку й кінця за межами слів TTS."""
    spans = []
    cursor = 0
    for t in tokens:
        start = spoken_text.index(t["spoken"], cursor)
        spans.append((start, start + len(t["spoken"])))
        cursor = start + len(t["spoken"])
    wcursor = 0
    timed = []
    for w in words:
        idx = spoken_text.find(w["text"], wcursor)
        if idx < 0:
            print(f"  ! слово TTS не знайдено в тексті: {w['text']!r}")
            continue
        timed.append((idx, w))
        wcursor = idx + len(w["text"])
    prev_end = 0.0
    for t, (s, e) in zip(tokens, spans):
        hits = [w for idx, w in timed if s <= idx < e]
        if hits:
            t["start"] = hits[0]["start"]
            t["end"] = hits[-1]["end"]
        else:  # тире тощо — без власної межі
            t["start"] = t["end"] = prev_end
        prev_end = t["end"]


def build_cues(tokens, offset: float):
    """Групує токени в субтитри: до ~2 рядків, розрив на розділових знаках."""
    cues = []
    cur = []

    def flush():
        if cur:
            cues.append(
                {
                    "text": " ".join(t["display"] for t in cur),
                    "start": offset + cur[0]["start"],
                    "end": offset + cur[-1]["end"],
                    # для підсвічування слова, яке зараз звучить
                    "words": [{"text": t["display"], "ms": round((offset + t["start"]) * 1000)} for t in cur],
                }
            )
            cur.clear()

    def rest_of_sentence(i):
        rest = []
        for x in tokens[i:]:
            rest.append(x["display"])
            if re.search(r"[.!?…]»?$", x["display"]):
                break
        return " ".join(rest)

    for i, t in enumerate(tokens):
        candidate = " ".join(x["display"] for x in cur + [t])
        # короткий хвіст речення не відриваємо в окремий субтитр
        short_tail = len(rest_of_sentence(i)) <= 16 and len(candidate) <= 92
        if cur and len(candidate) > 78 and not short_tail:
            flush()
        cur.append(t)
        text = " ".join(x["display"] for x in cur)
        last = t["display"]
        nxt = tokens[i + 1]["display"] if i + 1 < len(tokens) else ""
        sentence_end = re.search(r"[.!?…]»?$", last) is not None
        soft_end = re.search(r"[,:;]$", last) is not None or nxt == "—"
        if sentence_end and len(text) >= 18:
            flush()
        elif soft_end and len(text) >= 45:
            flush()
    flush()
    return cues


def fmt_srt(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def fmt_mmss(t: float) -> str:
    return f"{int(t // 60)}:{int(t % 60):02}"


async def main():
    script = json.loads(SCRIPT.read_text(encoding="utf-8"))
    voice, rate = script["voice"], script["rate"]
    engine = script.get("engine", "edge")
    # Локальні рушії (StyleTTS2, OmniVoice) мають однаковий інтерфейс synthesize(text, wav, meta).
    if engine == "styletts2":
        style = StyleTTS2Voice(voice, float(rate))
        audio_dir = STYLE_VO_DIR
    elif engine == "omnivoice":
        style = OmniVoiceClone(voice, script["refText"], float(rate))
        audio_dir = OMNI_VO_DIR
    else:
        style = None
        audio_dir = VO_DIR
    extension = ".wav" if style else ".mp3"
    audio_dir.mkdir(parents=True, exist_ok=True)

    # Синтез з невеликим паралелізмом
    sem = asyncio.Semaphore(1 if style else 4)
    jobs = []
    for scene in script["scenes"]:
        for i, beat in enumerate(scene["beats"]):
            tokens = tokenize(beat)
            spoken = " ".join(t["spoken"] for t in tokens)
            name = f"{scene['id']}-{i}"

            display = " ".join(t["display"] for t in tokens)

            async def run(spoken=spoken, name=name, display=display):
                async with sem:
                    if isinstance(style, OmniVoiceClone):
                        wav, meta = audio_dir / f"{name}{extension}", audio_dir / f"{name}.json"
                        return loudnorm_beat(wav, meta, style.synthesize(spoken, wav, meta, display=display))
                    if style:
                        return style.synthesize(spoken, audio_dir / f"{name}{extension}", audio_dir / f"{name}.json")
                    return await synthesize(spoken, voice, rate, audio_dir / f"{name}{extension}", audio_dir / f"{name}.json")

            jobs.append((scene["id"], i, tokens, spoken, name, run()))
    results = await asyncio.gather(*(j[5] for j in jobs))

    by_scene = {}
    for (sid, i, tokens, spoken, name, _), data in zip(jobs, results):
        align(tokens, spoken, data["words"])
        by_scene.setdefault(sid, []).append((name, tokens, data))

    volume = measure_gain([audio_dir / f"{j[4]}{extension}" for j in jobs])
    timeline = {"fps": FPS, "volume": volume, "scenes": [], "captions": []}
    t_global = 0.0
    n_scenes = len(script["scenes"])
    for si, scene in enumerate(script["scenes"]):
        beats_out = []
        t_local = HEAD
        for bi, (name, tokens, data) in enumerate(by_scene[scene["id"]]):
            if bi > 0:
                t_local += GAP
            beat_from = round(t_local * FPS)
            beat_start = beat_from / FPS  # вирівнюємо на кадр, щоб аудіо й слова збігалися
            beats_out.append(
                {
                    "src": f"{audio_dir.name}/{name}{extension}",
                    "from": beat_from,
                    "durationInFrames": math.ceil(data["duration"] * FPS),
                    "words": [{"text": t["display"], "from": round((beat_start + t["start"]) * FPS)} for t in tokens],
                }
            )
            timeline["captions"] += build_cues(tokens, t_global + beat_start)
            t_local = beat_start + data["duration"]
        t_local += LAST_TAIL if si == n_scenes - 1 else TAIL
        duration = math.ceil(t_local * FPS)
        timeline["scenes"].append(
            {
                "id": scene["id"],
                "title": scene["title"],
                "from": round(t_global * FPS),
                "durationInFrames": duration,
                "beats": beats_out,
            }
        )
        t_global += duration / FPS

    # Субтитр тримається до наступного (якщо пауза коротка), але не довше 0.7 с після слова
    caps = timeline["captions"]
    for i, c in enumerate(caps):
        nxt = caps[i + 1]["start"] if i + 1 < len(caps) else c["end"] + 0.7
        c["end"] = min(max(c["end"] + 0.3, c["start"] + 1.0), c["end"] + 0.7, nxt - 0.04)
        c["startMs"] = round(c.pop("start") * 1000)
        c["endMs"] = round(c.pop("end") * 1000)

    timeline["durationInFrames"] = sum(s["durationInFrames"] for s in timeline["scenes"])
    TIMELINE.parent.mkdir(parents=True, exist_ok=True)
    TIMELINE.write_text(json.dumps(timeline, ensure_ascii=False, indent=1), encoding="utf-8")

    SRT.parent.mkdir(parents=True, exist_ok=True)
    SRT.write_text(
        "\n".join(
            f"{i + 1}\n{fmt_srt(c['startMs'] / 1000)} --> {fmt_srt(c['endMs'] / 1000)}\n{c['text']}\n"
            for i, c in enumerate(caps)
        ),
        encoding="utf-8",
    )

    # Поминутний план із повним текстом
    lines = [
        "# Відеолекція 1 — поминутний план і текст диктора",
        "",
        f"Голос: {voice}, темп {rate}. Загальна тривалість: **{fmt_mmss(timeline['durationInFrames'] / FPS)}**"
        f" ({timeline['durationInFrames']} кадрів, {FPS} fps).",
        "",
        "| Час | Сцена | Тривалість |",
        "| --- | --- | --- |",
    ]
    for s in timeline["scenes"]:
        lines.append(f"| {fmt_mmss(s['from'] / FPS)} | {s['title']} | {s['durationInFrames'] / FPS:.0f} с |")
    lines.append("")
    for scene, s in zip(script["scenes"], timeline["scenes"]):
        lines.append(f"## {fmt_mmss(s['from'] / FPS)} — {scene['title']}")
        lines.append("")
        for beat in scene["beats"]:
            lines.append(MARKUP.sub(r"\1", beat))
            lines.append("")
    PLAN.write_text("\n".join(lines), encoding="utf-8")

    total = timeline["durationInFrames"] / FPS
    print(f"Сцен: {len(timeline['scenes'])}, субтитрів: {len(caps)}, тривалість: {fmt_mmss(total)} ({total:.1f} с)")
    for s in timeline["scenes"]:
        print(f"  {fmt_mmss(s['from'] / FPS):>5}  {s['durationInFrames'] / FPS:5.1f} с  {s['title']}")


asyncio.run(main())
