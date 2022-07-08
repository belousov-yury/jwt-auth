require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/errorMiddleware')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection to DB has been established successfully.');
    await sequelize.sync()

    app.listen(PORT, () => console.log(`Server has been started on PORT = ${PORT}`))

  } catch (e) {
    console.log(e)
  }
}


start()