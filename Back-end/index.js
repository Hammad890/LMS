import express, {json} from "express";
import {callDb} from "./helpers/db.js";
import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import cors from "cors"
import session from "express-session";
import mongoose from 'mongoose';
import MongoStore from "connect-mongo";
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
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24
        httpOnly: true,
      secure:'production',
    },
      
  })
);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

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
export default app;
