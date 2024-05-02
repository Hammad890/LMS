import { Router } from "express";
import { getBooks,getBooksByIsbn,createBook,updateByISBN,deleteByISBN } from "../controller/book.js";

const bookRoute=Router()
bookRoute.get("/",getBooks)
bookRoute.post("/",createBook)
bookRoute.put("/:id",updateByISBN)
bookRoute.get("/:id",getBooksByIsbn)
bookRoute.delete("/:id",deleteByISBN)

export default bookRoute
