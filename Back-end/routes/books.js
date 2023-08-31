import { Router } from "express";
import { getBooks,getBooksByIsbn,createBook,updateByISBN,deleteByISBN } from "../controller/book";

const bookRoute=Router()
bookRoute.get("/",getBooks)
bookRoute.post("/",createBook)
bookRoute.put("/",updateByISBN)
bookRoute.get("/",getBooksByIsbn)
bookRoute.delete("/",deleteByISBN)

export default bookRoute
