
import express from 'express';
import hbs from 'hbs';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT } from './config/env.js';

import connectDB from './config/db.js';

import authRouter from "./routes/user.routes.js"
import taskRouter from "./routes/task.routes.js"

const app = express();
const port = 3000


connectDB()
app.use(cors());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"))

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Task Flow Server' });
});

app.use("/auth/v1", authRouter)
app.use("/api/v1", taskRouter)

app.listen(PORT, () => {
    console.log(`Server running at :${PORT}`);
});