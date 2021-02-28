import mongoose, { Document } from 'mongoose';

export interface cartItemsType {
    name: string,
    image: string,
    price: number,
    countInStock: number,
    product: string,
    qty: number,
}

export interface UserSchemaType extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    cart: cartItemsType[];
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    cart: [{ type: Object }]
}, { timestamps: true });

export const User = mongoose.model("lolUser", userSchema);