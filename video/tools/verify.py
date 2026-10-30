"""Перевірка відрендереного відео: тривалість, звук, синхронізація субтитрів, порожні кадри.

.venv-tts/Scripts/python tools/verify.py out/final.mp4 [--offset-frames N]
--offset-frames — для фрагмента: з якого кадру повного таймлайну він починається.
"""

import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageStat

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
BIN = ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc"
FFMPEG, FFPROBE = str(BIN / "ffmpeg.exe"), str(BIN / "ffprobe.exe")

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--offset-frames", type=int, default=0)
args = ap.parse_args()

timeline = json.loads((ROOT / "src" / "lecture" / "timeline.json").read_text(encoding="utf-8"))
fps = timeline["fps"]
offset = args.offset_frames / fps

# 1. Потоки й тривалість
probe = json.loads(
    subprocess.run(
        [FFPROBE, "-v", "error", "-show_streams", "-show_format", "-of", "json", args.video],
        capture_output=True, text=True, check=True,
    ).stdout
)
dur = float(probe["format"]["duration"])
for s in probe["streams"]:
    if s["codec_type"] == "video":
        print(f"Відео: {s['codec_name']} {s['width']}x{s['height']} @ {s['r_frame_rate']}")
    else:
        print(f"Аудіо: {s['codec_name']} {s['sample_rate']} Гц, каналів: {s['channels']}")
print(f"Тривалість: {int(dur // 60)}:{dur % 60:05.2f} ({dur:.2f} с)")
if args.offset_frames == 0:
    expected = timeline["durationInFrames"] / fps
    print(f"Очікувана за таймлайном: {expected:.2f} с — різниця {dur - expected:+.2f} с")

# 2. Гучність
err = subprocess.run(
    [FFMPEG, "-hide_banner", "-i", args.video, "-vn", "-af", "loudnorm=print_format=json", "-f", "null", "-"],
    capture_output=True, text=True,
).stderr
loud = json.loads(err[err.rindex("{") : err.rindex("}") + 1])
print(f"Гучність: {loud['input_i']} LUFS, піки {loud['input_tp']} dBTP")

# 3. Мовлення (за тишею) vs субтитри
err = subprocess.run(
    [FFMPEG, "-hide_banner", "-i", args.video, "-vn", "-af", "silencedetect=noise=-40dB:d=0.3", "-f", "null", "-"],
    capture_output=True, text=True,
).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
silences = list(zip(starts, ends + [dur] * (len(starts) - len(ends))))
speech, t = [], 0.0
for s, e in silences:
    if s > t:
        speech.append((t, s))
    t = e
if t < dur:
    speech.append((t, dur))

caps = [
    (c["startMs"] / 1000 - offset, c["endMs"] / 1000 - offset, c["text"])
    for c in timeline["captions"]
    if c["endMs"] / 1000 > offset and c["startMs"] / 1000 < offset + dur
]


def overlap(a, b):
    return max(0.0, min(a[1], b[1]) - max(a[0], b[0]))


speech_total = sum(e - s for s, e in speech)
covered = sum(overlap(sp, c[:2]) for sp in speech for c in caps)
print(f"Мовлення: {speech_total:.1f} с, з них під субтитрами {covered / speech_total * 100:.1f} %")
uncovered = [sp for sp in speech if sum(overlap(sp, c[:2]) for c in caps) < (sp[1] - sp[0]) * 0.5 and sp[1] - sp[0] > 0.4]
print(f"Фрагменти мовлення без субтитрів (>0.4 с): {len(uncovered)}", [f"{s:.1f}-{e:.1f}" for s, e in uncovered[:10]])
# Субтитр, що показується над тишею: його вікно майже не перетинається з мовленням
silent_caps = [c for c in caps if sum(overlap(c[:2], sp) for sp in speech) < 0.25 * (c[1] - c[0])]
print(f"Субтитри над тишею: {len(silent_caps)}", [c[2][:40] for c in silent_caps[:5]])
# Початок кожної репліки vs найближчий початок мовлення (за тишею > 0.3 с)
lags = []
for s, e, text in caps:
    near = min((abs(sp[0] - s) for sp in speech), default=99)
    if near < 1.0:
        lags.append(near)
if lags:
    print(f"Зсув початку субтитрів від початку фраз: медіана {sorted(lags)[len(lags) // 2] * 1000:.0f} мс, макс {max(lags) * 1000:.0f} мс")

# 4. Порожні кадри: щосекунди кадр, дисперсія яскравості (лише тло → дуже мала)
with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(
        # у збірці ffmpeg від Remotion немає фільтрів fps/scale — беремо кадри через -r
        [FFMPEG, "-v", "error", "-i", args.video, "-r", "1", "-an", str(Path(tmp) / "f%05d.png")],
        check=True,
    )
    frames = sorted(Path(tmp).glob("f*.png"))
    stds = [ImageStat.Stat(Image.open(f).convert("L").resize((480, 270))).stddev[0] for f in frames]
low = [i for i, s in enumerate(stds) if s < 6]
runs, cur = [], []
for i in low:
    if cur and i != cur[-1] + 1:
        runs.append(cur)
        cur = []
    cur.append(i)
if cur:
    runs.append(cur)
long_runs = [r for r in runs if len(r) >= 2]
print(f"Кадрів перевірено: {len(stds)}; майже порожніх: {len(low)}; серій ≥2 с: {len(long_runs)}",
      [f"{r[0]}-{r[-1]} с" for r in long_runs])
