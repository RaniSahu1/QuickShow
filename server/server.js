 import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {clerkMiddleware} from "@clerk/express"; 
// import { inngest } from './inngest/index.js';
import { serve } from "inngest/express";
import {inngest, functions} from './inngest/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();
//Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// API Routes
app.get('/', (req, res) => res.send('Server is live!'));
app.use('/api/inngest', serve({client:inngest,functions}));

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));