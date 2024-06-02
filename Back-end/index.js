import express, {json} from "express";
import {callDb} from "./helpers/db.js";
import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import cors from "cors"
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app= express();
const isProduction = process.env.NODE_ENV === 'production';
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
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      secure: isProduction, 
        sameSite: isProduction ? 'none' : 'lax',
    },
      
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
