import express, {json} from "express";
import {callDb} from "./helpers/db.js";
import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import cors from "cors"
import session from "express-session";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app= express();
app.use(
    cors({
      origin: "https://lms-fe-six.vercel.app",
      credentials: true,
    })
  );
app.use(json())
app.use(morgan('dev')); 
app.use(cookieParser());

app.use(
  session({
    secret: 'xyz-116',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24}, 
  })
);


callDb()


app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

app.use("/users",userRouter)
app.use("/books",bookRouter)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from Vercel' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
