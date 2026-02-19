import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import problemRouter from './routes/problem.routes.js';
import executionRoute from './routes/executecodes.routes.js';
import submissionRoute from './routes/submission.routes.js';
import playlistRoute from './routes/playlist.routes.js';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/',(req,res)=>{
    res.send("Hello World");
    console.log("Cookies: ", req.cookies);
})
dotenv.config();
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/problems",problemRouter)
app.use("/api/v1/execute-code",executionRoute)
app.use("/api/v1/submissions",submissionRoute)
app.use("/api/v1/playlists",playlistRoute)
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 8080");
})