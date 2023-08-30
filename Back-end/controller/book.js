import User from "../models/user"
import Book from "../models/book"

export const getBooks= async(req,res,next)=>{
    try{
 const books= await Book.find({})
 return res.status(200).json({books: books.map((book)=>({...book.toJSON(), availableQuantity: book.quantity - book.borrowedBy.length,})),
})
} catch (err){
    next (err)
}
}

export const getBooksByIsbn= async(req,res,next)=>{
    try{
        const book = await Book.findOne({isbn: req.params.bookIsbn})
        if (book == null){
            return res.status(404).json({err: "Book not found"})
        }
        return res.status(200).json({
            book: {
                ...book.toJSON(),
                availableQuantity: book.quantity - book.borrowedBy.length
            }
        })
    }catch(err){
        next(err)
    }
}
export const createBook=(req,res,next)=>{
    const newBooks=req.body
    const newId=Book.length+1
    newBooks.id=newId
    Book.push(newBooks)
    res.status(201).json(newBooks)
}

  
export const updateByISBN=async(req,res,next)=>{
    const updatedBookData=req.body
  const updateBook = await Book.findOne({ isbn: req.params.bookIsbn })
  if (updateBook == null) {
    return res.status(404).json({ err: "Book not found" })
}
  Book[updateBook] = { ...Book[updateBook], ...updatedBookData };
  
res.json(Book[updateBook]);    
}

export const deleteByISBN=async(req,res,next)=>{
    const isbnTodelete=await Book.findOne({isbn:req.params.isbn})
    const initialBooksLength = Book.length;
    Book = Book.filter(Book => Book.isbn !== isbnTodelete);
    if (isbnTodelete == null) {
        return res.status(404).json({ err: "Book not found" })
    }
    res.json({ message: 'Book deleted successfully' });
}
