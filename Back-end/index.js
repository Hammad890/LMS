import express, {json} from "express";
import {callDb} from "./helpers/db.js";
import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import cors from "cors"
import session from "express-session";
import mongoose from 'mongoose';
import MongoStore from "connect-mongo";
import dotenv from 'dotenv';
dotenv.config();


const app= express();
app.use(json())

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(
  session({
    secret: 'xyz-116',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URL,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

callDb()

app.use(
    cors({
      origin: "http://localhost:3000",
      method: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

app.use("/users",userRouter)
app.use("/books",bookRouter)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from Vercel' });
});
app.listen(5000, ()=>{
    console.log("App started")
})
