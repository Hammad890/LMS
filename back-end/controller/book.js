import Book from "../models/book.js"

export const getBooks= async(req,res,next)=>{
    try{
 const books= await Book.find({})
 return res.status(200).json({books: books.map((book)=>({...book.toJSON(), availableQuantity: book.quantity -  (book.borrowedBy ? book.borrowedBy.length : 0)})),
})
} catch (err){
    next (err)
}
}

export const getBooksByIsbn= async(req,res,next)=>{
    const id = req.params.id
    try{
        const book = await Book.findById(id)
        if (book == null){
            console.log("Book not found");
            return res.status(404).json({err: "Book not found"})
        }
        return res.status(200).json({
            book: {
                ...book.toJSON(),
                availableQuantity: book.quantity - (book.borrowedBy ? book.borrowedBy.length : 0)
            }
        })
    }catch(err){
        console.error("Database error:", err);
        next(err)
    }
}
export const createBook= async(req,res,next)=>{
    const body=req.body
    try{
    const book = new Book (body)
    await book.save()
    return res.status(201).send({message: "Book added successfully"})
    }catch (err){
        next (err)
    }
}

  
export const updateByISBN=async(req,res,next)=>{
    const id = req.params.id
    try{
    const updatedBookData=req.body
  const updateBook = await Book.findById(id)
  if (!updateBook) {
    return res.status(404).json({ err: "Book not found" })
}
updateBook.set(updatedBookData);
await updateBook.save();
res.json(updateBook); 
}catch (err) {
    console.error("Error updating book:", err);
    return res.status(500).json({ err: "Internal Server Error" });
}
};

export const deleteByISBN=async(req,res,next)=>{
    try{
        console.log('Book ID:', req.params.id);
    const book=await Book.findByIdAndDelete(req.params.id)
    if (!book) {
        return res.status(404).json({ err: "Book not found" })
    }
    return res.status(200).json({ message: "Book deleted successfully"  })
  } catch (err) {
    console.error("Error deleting book:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

