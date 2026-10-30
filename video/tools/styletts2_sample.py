import json
import re
import wave
from pathlib import Path

import numpy as np
import onnxruntime as ort
from ipa_uk import ipa
from ukrainian_word_stress import Stressifier

root = Path(__file__).resolve().parent.parent
model_dir = root / "models/styletts2-uk/uk"
script = json.loads((root / "lecture/script.json").read_text(encoding="utf-8"))
text = script["scenes"][0]["beats"][0]
stress = Stressifier()
phonemes = ipa(stress(text))
vocab = json.loads((model_dir / "vocab.json").read_text(encoding="utf-8"))
ids = np.array([vocab.index(ch) for ch in phonemes if ch in vocab], dtype=np.int64)
names = json.loads((model_dir / "voices.json").read_text(encoding="utf-8"))
voice = "Поліна Еккерт"
styles = np.fromfile(model_dir / "voices.bin", dtype="<f4").reshape(-1, 256)
session = ort.InferenceSession(str(model_dir / "model.onnx"))
wav, durations = session.run(None, {"tokens": ids, "speed": np.array(1.0, dtype=np.float32), "s_prev": styles[names.index(voice):names.index(voice)+1]})
pcm = (np.clip(wav, -1, 1) * 32767).astype("<i2")
output = root / "out/styletts2-sample.wav"
with wave.open(str(output), "wb") as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(24000)
    f.writeframes(pcm.tobytes())
print(voice, len(ids), len(wav) / 24000, len(durations), output)
