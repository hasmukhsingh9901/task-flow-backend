
import express from 'express';
import hbs from 'hbs';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT } from './config/env.js';

import connectDB from './config/db.js';



const app = express();
const port = 3000


connectDB()
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Task Flow Server' });
});

app.listen(PORT, () => {
    console.log(`Server running at :${PORT}`);
});