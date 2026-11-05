"""Revisa la carpeta voces/: nombres correctos, qué personajes ya tienen audio y cuáles duran más de 5 s.
Uso (desde la carpeta del juego, donde está servidor.py):   python revisar_voces.py"""
import re, shutil, subprocess, wave
from pathlib import Path
import motor as M

CARPETA = Path(__file__).parent / "voces"
RE = re.compile(r"^([a-z0-9]+)_(critico|ulti)(?:[_-]?\d+)?\.(mp3|ogg|wav|m4a)$")
if not CARPETA.is_dir():
    raise SystemExit("No existe la carpeta voces/ al lado de servidor.py. Créala y mete ahí los audios.")


def duracion(f):
    try:
        if f.suffix.lower() == ".wav":
            with wave.open(str(f)) as w:
                return w.getnframes() / w.getframerate()
        if shutil.which("ffprobe"):
            r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                               capture_output=True, text=True)
            return float(r.stdout.strip())
    except Exception:
        pass
    return None


cuenta = {k: {"critico": 0, "ulti": 0} for k in M.PERSONAJES}
problemas = []
for f in sorted(CARPETA.iterdir()):
    if f.name.startswith(".") or f.is_dir():
        continue
    m = RE.match(f.name)
    if not m:
        problemas.append(f"❌ {f.name}: nombre inválido. Debe ser  personaje_critico_1.mp3  o  personaje_ulti_1.mp3 (minúsculas, sin tildes, sin espacios)")
        continue
    if m.group(1) not in M.PERSONAJES:
        problemas.append(f"❌ {f.name}: '{m.group(1)}' no es un personaje. Usa: {', '.join(M.PERSONAJES)}")
        continue
    cuenta[m.group(1)][m.group(2)] += 1
    d = duracion(f)
    if d is not None and d > 5.0:
        problemas.append(f"⚠️  {f.name}: dura {d:.1f} s (el juego lo cortará a los 5.5 s; mejor recórtalo)")
    elif d is None and f.stat().st_size > 300_000:
        problemas.append(f"⚠️  {f.name}: pesa {f.stat().st_size // 1024} KB; revisa que no dure más de 5 s")

print(f"{'personaje':10} crítico  ÚLTI")
for k, c in cuenta.items():
    print(f"{k:10} {c['critico']:^7} {c['ulti']:^6}" + ("   ← falta algo" if not c["critico"] or not c["ulti"] else ""))
print()
print("\n".join(problemas) if problemas else "✅ Todos los nombres están bien.")
if not shutil.which("ffprobe"):
    print("(Sin ffprobe no puedo medir la duración de los mp3; solo la de los wav.)")
