import express from "express"


const app = express()
const port = 3000


app.use(express.json())

let pendientes = []

app.get("/", (_, res) => res.send("Hola Mundo!"))

app.get("/tareas", (req, res) => {
  if (!pendientes.length) return res.status(404).json({ ok: false, msg: "No hay tareas" })
  const { completada } = req.query
  const data = completada === undefined
    ? pendientes
    : pendientes.filter(t => t.completada === (completada === "true"))
  res.json({ ok: true, data })
})

app.post("/tareas", (req, res) => {
  const { descripcion, completada } = req.body
  if (!descripcion || completada === undefined) return res.status(400).json({ ok: false, msg: "Faltan datos" })
  if (pendientes.some(t => t.descripcion === descripcion)) return res.status(400).json({ ok: false, msg: "Tarea repetida" })
  const id = pendientes.length ? Math.max(...pendientes.map(t => t.id)) + 1 : 1
  const nueva = { id, descripcion, completada }
  pendientes.push(nueva)
  res.json({ ok: true, data: nueva })
})

app.get("/tareas/:id", (req, res) => {
  const tarea = pendientes.find(t => t.id === Number(req.params.id))
  if (!tarea) return res.status(404).json({ ok: false, msg: "No encontrada" })
  res.json({ ok: true, data: tarea })
})

app.delete("/tareas/:id", (req, res) => {
  const i = pendientes.findIndex(t => t.id === Number(req.params.id))
  if (i === -1) return res.status(404).json({ ok: false, msg: "No encontrada" })
  res.json({ ok: true, data: pendientes.splice(i, 1)[0] })
})

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en ${port}`);
});

