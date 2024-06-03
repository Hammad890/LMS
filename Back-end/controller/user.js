import User from "../models/user.js";
import Book from "../models/book.js";
import bcrypt from "bcrypt";


const ignorePassword=(user) => {
    const {password,...rest} = user
    return rest
}

export const getUser= async (req,res,next)=>{
   try{
    const users= await User.find({}).populate('borrowedBooks')
    return res.status(200).json({users: users.map((user)=>ignorePassword(user.toJSON()))})
}catch (err){
    next(err)
}
} 

export const bookToBorrow= async(req,res,next)=>{
    try{
        const book= await Book.findOne({isbn: req.body.isbn})
        if (book === null){
        return res.status(404).json({err: "Book not found"})
    }
    if (book.borrowedBy.length === book.quantity){
        return req.status(400).json({err: "Book is not available"})
    }
    const user= await User.findById(req.body.userId)
    if(user === null){
        return res.status(404).json({err: `User not found:${req.body.userId}`})
    }
    if (book.borrowedBy.includes(user.id)){
        return res.status(400).json({err: "You've already borrowed this book"})
    }
    book.borrowedBy.push(user.id);
    user.borrowedBooks.push(book.id);
    await book.save();
    await user.save();
    const updatedBook = await Book.findById(book.id)
    return res.status(200).json({
        book:{
            ...updatedBook.toJSON(),
            availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length,
        },
    })
    }catch (err){
        next(err)
    }
}

export const bookReturn = async(req,res,next)=>{
    try{
        const book = await Book.findOne({isbn: req.body.isbn})
        if(book === null){
            return res.status(404).json({err: "Book not found"})
        }
        const user = await User.findById(req.body.userId)
        if(user === null){
            return res.status(404).json({err: "User not found"})
        }
        if(!book.borrowedBy.includes(user.id)){
            return res.status(400).json({err: "You need to borrow this book first!"})
        }        
            book.borrowedBy= book.borrowedBy.filter(borrowedBy=>!borrowedBy.equals(user.id)),
            await book.save()
            user.borrowedBooks= user.borrowedBooks.filter(borrowedBooks=>!borrowedBooks.equals(book._id))
            await user.save()
        const updatedBook = await Book.findById(book.id)
        return res.status(200).json({
            book: {
                ...updatedBook.toJSON(),
                availableQuantity: updatedBook.quantity - updatedBook.borrowedBy.length
            },
        })
    }catch(err){
        next (err)
    }
}

export const borrowedBook= async(req,res,next)=>{
    try{
        console.log('Session:', req.session);
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: "User is not authenticated" });
        }
        const user = await User.findById(req.session.userId).populate('borrowedBooks');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({books: user.borrowedBooks})
    }catch(err){
        next(err)
    }
}

export const getBorrowedBook = async (req,res,next)=>{
    try{
        const borrowed = await User.aggregate([
            {
                $match:{borrowedBooks:{$exists:true, $ne:[]}}
            },
            {
                $project:{
                    borrowedBooks:1
                }
            }
        ]);
      

        const allBorrowedBooks =borrowed.flatMap(user=>user.borrowedBooks)
        return res.status(200).json({borrowed:allBorrowedBooks});
    }catch(err){
        next(err)
}
}

export const createUser= async(req,res)=>{
    const hashedPassword= await bcrypt.hash(req.body.password,10);
    try{
        const user= new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            number: req.body.number,
            role: req.body.role
        })
        await user.save() 
        return res.status(200).send({message: "User Added Successfully"})
    }catch(err){
        return res.status(500).send({err: "Bad Request"})
    }
}

export const getById= async (req,res,next)=>{
    const id= req.params.id
    try{
    const user= await User.findById(id)
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send({user}) 
} catch(err){
    next(err)
}
}

export const showUser= async (req,res,next)=>{
    try{
        const user = await User.findById(req.session.userId).populate('borrowedBooks')
        if (user === null){
            return res.status(404).json({error: "User not found"})
        }
        req.session.userId= user._id;
        return res.status(200).json({user: ignorePassword(user.toJSON())})
    }catch(err){
        next (err)
    }
}

export const deleteUser= async (req,res,next) => {
    try{
    const user = await User.findByIdAndDelete({_id: req.params.id })
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const users = await User.find();
    res.status(200).send({ users })
    } catch (err){
        console.error("Error deleting user:", err);
        return res.status(500).send({err: "Internal Server Error"})
    }
}

export const login= async (req,res,next)=>{
    try{
        const user = await User.findOne({username: req.body.username})
        if (!user){
            return res.status(404).json({error: "User not found"})
        }
        const passwordCheck = await bcrypt.compare (req.body.password,user.password);
        if (!passwordCheck){
            return res.status(401).json({error: "Invalid Password"})
        }
        if (user.role === "Admin" && user.username !== "admin") {
            return res.status(401).json({ error: "Admin does not exist" });
        }
        req.session.userId= user._id;
         req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
        console.log('Session created:', req.session);
        return res.status(200).json({user: ignorePassword(user.toJSON())})
             });
    }catch(err){
        next (err)
    }
}

export const logout= (req,res)=>{
    if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            res.status(500).json({ success: false, error: 'Session destruction failed' });
            console.error('Error destroying session:', err);
          }else{
            res.status(200).json({success: true})
          }
    });
}
}
