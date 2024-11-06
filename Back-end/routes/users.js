import { Router } from "express";
import {getUser,bookToBorrow,bookReturn,login,showUser,logout,createUser,deleteUser,getById,getBorrowedBook} from "../controller/user.js"

const route = Router()

route.get("/",getUser)
route.post("/borrow",bookToBorrow)
route.post("/return",bookReturn)
route.post("/",login)
route.get("/user",showUser)
route.get("/logout",logout)
route.get("/borrowedbooks",getBorrowedBook)
route.post("/register",createUser)
route.delete("/:id",deleteUser)
route.get("/:id",getById)

export default route;
