import express from 'express';
import { config } from 'dotenv';
import Hero from '@route/Hero'

config();
const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Bem Vindo ao Projeto API (Super-heróis)')
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

Hero(app);

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`🚀 Listening on http://localhost:${port}`);
})