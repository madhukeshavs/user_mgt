import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true, unique: true},
    password: {type:String, required: true}
}, {timestamps: true})

const userStore = mongoose.model("user", userSchema);

export default userStore;