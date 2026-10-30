"""Пробна озвучка одного абзацу клонованим голосом за кожним зразком із voice-sample/.

D:/ai-voice-env/venv/Scripts/python tools/clone_test.py
Результат: voice-sample/test-<зразок>.wav + розбірливість (WER за Whisper).
"""

import difflib
import json
import re
import sys
import time
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from faster_whisper import WhisperModel
from omnivoice import OmniVoice

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
SAMPLES = ROOT / "voice-sample"
TEXT = (
    "Приклад. Колега каже: «Усе нормально», але говорить тихо, уникає погляду й відповідає коротко. "
    "Уважна людина помітить розбіжність між словами та невербальними сигналами — "
    "і, можливо, обережно запитає, як справи насправді."
)


def words(s: str):
    return re.findall(r"[a-zа-щьюяґєії0-9']+", s.lower().replace("ʼ", "'").replace("’", "'"))


refs = json.loads((SAMPLES / "refs.json").read_text(encoding="utf-8"))
model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cuda:0", dtype=torch.float16)
asr = WhisperModel("small", device="cpu", compute_type="int8")

for key, ref_text in refs.items():
    t0 = time.time()
    audio = model.generate(text=TEXT, ref_audio=str(SAMPLES / f"ref-{key}.wav"), ref_text=ref_text)[0]
    took = time.time() - t0
    out = SAMPLES / f"test-{key}.wav"
    sf.write(out, audio, 24000)
    a16 = np.interp(np.arange(0, len(audio), 1.5), np.arange(len(audio)), audio).astype(np.float32)
    segs, _ = asr.transcribe(a16, language="uk", beam_size=5)
    hyp = " ".join(s.text.strip() for s in segs)
    ref_w, hyp_w = words(TEXT), words(hyp)
    sm = difflib.SequenceMatcher(a=ref_w, b=hyp_w, autojunk=False)
    errs = sum(max(i2 - i1, j2 - j1) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal")
    print(f"[{key}] {len(audio) / 24000:.1f} с аудіо за {took:.1f} с · WER {errs / len(ref_w) * 100:.0f}% · {hyp}", flush=True)
