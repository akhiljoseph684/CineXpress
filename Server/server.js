import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/connectDB.js'
dotenv.config()

connectDB()
const app = express();


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.end("API Running");
})

app.listen(port, () => {
    console.log(`server started on port ${port}`)
})