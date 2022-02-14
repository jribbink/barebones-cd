import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.all('*', (req, res, next) => {
    console.log(req)
})

app.listen(process.env.port)