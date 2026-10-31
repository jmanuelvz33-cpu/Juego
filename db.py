"""Datos de los jugadores. Con DATABASE_URL usa Postgres (Supabase); sin ella usa un archivo SQLite local (para probar).
Cada jugador es un documento con la MISMA forma que usa el bot de Discord (monedas, mascotas, equipado...),
así el bot podrá leer la misma tabla más adelante. La clave es el ID de Discord."""
import json, os, sqlite3, threading, copy

CANDADO = threading.Lock()      # una sola instancia del servidor: evita compras dobles por clics rápidos
NUEVO = {"monedas": 0, "titulos": [], "frases": [], "colores": [], "mascotas": [], "imagenes": [],
         "equipado": {"titulo": None, "frase": None, "color": None, "mascota": None, "imagen": None}}


def _completar(d):
    base = copy.deepcopy(NUEVO)
    base.update(d or {})
    for k, v in NUEVO["equipado"].items():
        base["equipado"].setdefault(k, v)
    for k in ("titulos", "frases", "colores", "mascotas", "imagenes"):
        base.setdefault(k, [])
    return base


class Almacen:
    def __init__(self, url=None, archivo="datos_web.sqlite3"):
        self.pg = bool(url)
        self.url = url
        self.archivo = archivo
        if self.pg:
            import psycopg
            self._psycopg = psycopg
            with self._con() as con:
                con.execute("""create table if not exists usuarios (
                    uid text primary key, data jsonb not null, actualizado timestamptz not null default now())""")
        else:
            with self._con() as con:
                con.execute("create table if not exists usuarios (uid text primary key, data text not null)")

    def _con(self):
        if self.pg:
            return self._psycopg.connect(self.url, autocommit=True, connect_timeout=10)
        con = sqlite3.connect(self.archivo)
        return _Sqlite(con)

    def _leer(self, uid):
        with self._con() as con:
            ph = "%s" if self.pg else "?"
            fila = con.execute(f"select data from usuarios where uid = {ph}", (uid,)).fetchone()
        if fila is None:
            return None
        dato = fila[0]
        return json.loads(dato) if isinstance(dato, str) else dato

    def obtener(self, uid):
        uid = str(uid)
        with CANDADO:
            dato = self._leer(uid)
            d = _completar(dato)
            if dato is None:
                self._guardar(uid, d)
            return d

    def _guardar(self, uid, d):
        with self._con() as con:
            if self.pg:
                from psycopg.types.json import Jsonb
                con.execute("insert into usuarios (uid, data) values (%s, %s) "
                            "on conflict (uid) do update set data = excluded.data, actualizado = now()",
                            (uid, Jsonb(d)))
            else:
                con.execute("insert into usuarios (uid, data) values (?, ?) "
                            "on conflict(uid) do update set data = excluded.data", (uid, json.dumps(d)))

    def guardar(self, uid, d):
        with CANDADO:
            self._guardar(str(uid), d)

    def transaccion(self, uid, f):
        """Lee, cambia con f(datos) y guarda todo bajo el candado. Devuelve lo que devuelva f."""
        uid = str(uid)
        with CANDADO:
            d = _completar(self._leer(uid))
            res = f(d)
            self._guardar(uid, d)
            return res


class _Sqlite:
    """Para que SQLite se use igual que psycopg ('with' cierra la conexión y guarda)."""
    def __init__(self, con):
        self.con = con

    def __enter__(self):
        return self.con

    def __exit__(self, *a):
        self.con.commit()
        self.con.close()
