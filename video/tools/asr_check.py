"""Контроль розбірливості озвучки: розпізнає кожен біт Whisper і порівнює з текстом сценарію.

.venv-tts/Scripts/python tools/asr_check.py [model]   (за замовчуванням small)
"""

import difflib
import io
import json
import wave
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
VO = ROOT / "public" / "voiceover"
FFMPEG = ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc" / "ffmpeg.exe"
timeline = json.loads((ROOT / "src" / "lecture" / "timeline.json").read_text(encoding="utf-8"))

model = WhisperModel(sys.argv[1] if len(sys.argv) > 1 else "small", device="cpu", compute_type="int8")


def load_audio(path: Path) -> np.ndarray:
    # Декодуємо ffmpeg-ом від Remotion: встановлений PyAV несумісний із faster-whisper.
    raw = subprocess.run(
        # у цій збірці немає сирого f32le — беремо 16-бітний WAV
        [str(FFMPEG), "-v", "error", "-i", str(path), "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", "-f", "wav", "-"],
        capture_output=True,
        check=True,
    ).stdout
    with wave.open(io.BytesIO(raw)) as w:
        pcm = w.readframes(w.getnframes())
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0


def words(s: str):
    s = s.lower().replace("ʼ", "'").replace("’", "'")
    return re.findall(r"[a-zа-щьюяґєії0-9']+", s)


total_ref = total_err = 0
report = []
for scene in timeline["scenes"]:
    for b in scene["beats"]:
        name = Path(b["src"]).stem
        meta = json.loads((VO / f"{name}.json").read_text(encoding="utf-8"))
        ref = words(meta["text"])  # те, що мав прочитати диктор
        segs, _ = model.transcribe(load_audio(VO / f"{name}.mp3"), language="uk", beam_size=5, vad_filter=False)
        hyp_text = " ".join(s.text.strip() for s in segs)
        hyp = words(hyp_text)
        sm = difflib.SequenceMatcher(a=ref, b=hyp, autojunk=False)
        errs = sum(max(i2 - i1, j2 - j1) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal")
        diffs = [
            f"{' '.join(ref[i1:i2]) or '∅'} → {' '.join(hyp[j1:j2]) or '∅'}"
            for op, i1, i2, j1, j2 in sm.get_opcodes()
            if op != "equal"
        ]
        total_ref += len(ref)
        total_err += errs
        wer = errs / max(1, len(ref))
        report.append({"beat": name, "wer": round(wer, 3), "diffs": diffs, "asr": hyp_text})
        print(f"{name:16} WER {wer * 100:5.1f}%  {'; '.join(diffs[:6])}", flush=True)

print(f"\nЗагальний WER: {total_err / total_ref * 100:.1f}% ({total_err} / {total_ref} слів)")
(ROOT / "out" / "asr_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
