const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()

app.use(cors())
app.use(express.static("public"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

const USERS = []
const EXCERCISES = []

app.post("/api/users", function (req, res) {
  const { username } = req.body
  const _id = (USERS.length + 1).toString()

  USERS.push({ username, _id })

  return res.json({ username, _id })
})

app.get("/api/users", function (_, res) {
  return res.json(USERS)
})

app.post("/api/users/:_id/exercises", function (req, res) {
  const { description, duration, date } = req.body
  const { _id } = req.params
  const objectDate = date ? new Date(date) : new Date()
  const user = USERS.find((user) => user._id === _id)

  if (!user) return res.status(404).json({ message: "User not found." })

  const payload = {
    username: user.username,
    description,
    duration: parseInt(duration),
    date: objectDate.toDateString(),
    _id: user._id,
  }

  EXCERCISES.push(payload)

  res.json(payload)
})

app.get("/api/users/:_id/logs", function (req, res) {
  const { _id } = req.params
  const { from, to, limit } = req.query
  const user = USERS.find((item) => item._id === _id)
  if (!user) return res.status(404).json({ message: "User not found." })

  let logs = EXCERCISES.filter((item) => item._id === _id)

  if (from)
    logs = logs.filter(
      (log) => new Date(from).getTime() <= new Date(log.date).getTime()
    )

  if (to)
    logs = logs.filter(
      (log) => new Date(log.date).getTime() < new Date(to).getTime()
    )

  if (limit) logs = logs.slice(0, parseInt(limit))

  return res.json({
    ...user,
    count: logs.length,
    log: logs.map((item) => ({
      description: item.description,
      duration: item.duration,
      date: item.date,
    })),
  })
})

app.get

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
