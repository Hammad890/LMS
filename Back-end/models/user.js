import { model,Schema } from "mongoose";

const userSchema = new Schema ({
    username: { type: String, require: true, unique: true},
    password: { type: String, require: true},
    email: {type: String, require: true, unique: true},
    role: { type: String, require: true},
    borrowedBooks: [{ type: Schema.Types.ObjectId, ref: 'books' }]
})

const User = model("users",userSchema)
export default User