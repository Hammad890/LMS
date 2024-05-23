import { model,Schema } from "mongoose";

const bookSchema= new Schema({
    name: {type: String, required: true},
    isbn: {type: String, required: true, unique: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    borrowedBy: [{type: Schema.Types.ObjectId, ref: "users"}],
})
const Book = model("books",bookSchema)
export default Book