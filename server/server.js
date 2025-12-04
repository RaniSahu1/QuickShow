
   

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {clerkMiddleware} from "@clerk/express"; 

import { serve } from "inngest/express";
import {inngest, functions} from './inngest/index.js';
import showRouter from './routes/showRoutes.js';
console.log("Registered Inngest functions:", functions.map(fn => fn.config?.id ?? fn.id ?? fn.name));


const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

//Middlewares

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

 //debug log
// app.use("/api/inngest", (req, res, next) => {
//   console.log("Hit /api/inngest from Inngest:", req.method);
//   next();
// });

// API Routes
app.get('/', (req, res) => res.send('Server is live!'));
app.use('/api/inngest', serve({client : inngest,functions}));

app.use('/api/shows', showRouter);


app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));