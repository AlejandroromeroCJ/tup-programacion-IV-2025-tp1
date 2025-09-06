import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

let alumnos = [], nextId = 1;


app.post("/alumnos", (req, res) => {
  const { nombre, notas } = req.body;
  if (!nombre || !Array.isArray(notas) || notas.length !== 3)
    return res.status(400).json({ error: "Nombre y 3 notas requeridos" });
  if (notas.some(n => n < 0 || n > 10))
    return res.status(400).json({ error: "Notas entre 0 y 10" });
  if (alumnos.some(a => a.nombre === nombre))
    return res.status(400).json({ error: "Nombre ya existe" });

  alumnos.push({ id: nextId++, nombre, notas });
  res.json({ mensaje: "Alumno agregado" });
});


app.get("/alumnos", (_req, res) => {
  const data = alumnos.map(a => {
    const promedio = a.notas.reduce((s, n) => s + n, 0) / 3;
    const estado = promedio < 6 ? "Reprobado" : promedio < 8 ? "Aprobado" : "Promocionado";
    return { ...a, promedio, estado };
  });
  res.json(data);
});


app.put("/alumnos/:id", (req, res) => {
  const id = +req.params.id;
  const { NuevoNombre, notas } = req.body;
  const alumno = alumnos.find(a => a.id === id);
  if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });
  if (alumnos.some(a => a.nombre === NuevoNombre && a.id !== id))
    return res.status(400).json({ error: "Nombre ya usado" });
  if (!Array.isArray(notas) || notas.length !== 3)
    return res.status(400).json({ error: "Notas inválidas" });

  alumno.nombre = NuevoNombre;
  alumno.notas = notas;
  res.json({ mensaje: "Alumno actualizado", alumno });
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});
