"""Regenera motor.py y contenido.py a partir de tu Juego.py del bot.
Uso:  python3 extraer_web.py RUTA/Juego.py"""
import sys
src = open(sys.argv[1], encoding="utf-8").read()
a = src.index("# ====================================================================================\n#  SECUELA — MOTOR DE COMBATE")
b = src.index("# ====================================================================================\n#  SECUELA — INTERFAZ DE COMBATE")
open("motor.py", "w", encoding="utf-8").write("import random\n\n" + src[a:b])
m1 = src.index('COSMETICOS["mascotas"] = {')
m2 = src.index("# Imágenes de victoria")
c1 = src.index("NIKO_IMG =")
c2 = src.index("def _precio_txt")
open("contenido.py", "w", encoding="utf-8").write(
    '"""Contenido del Bazar (generado por extraer_web.py desde el Juego.py del bot)."""\n'
    "COSMETICOS = {}\n" + src[m1:m2] + "\n" + src[c1:c2])
print("motor.py y contenido.py listos")
