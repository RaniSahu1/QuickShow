
   

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {clerkMiddleware} from "@clerk/express"; 

import { serve } from "inngest/express";
import {inngest, functions} from './inngest/index.js';
console.log("Registered Inngest functions:", functions.map(fn => fn.id));


const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

//Middlewares

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// API Routes
app.get('/', (req, res) => res.send('Server is live!'));
app.use('/api/inngest', serve({client : inngest,functions}));

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));