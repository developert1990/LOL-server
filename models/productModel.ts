import mongoose, { Document } from 'mongoose';


export interface productsInfoType extends Document {
    name: string;
    image: string;
    imageKey: string;
    brand: string;
    category: string;
    description: string;
    price: number;
    countInStock: number;
    rating: number;
    numReviews: number;
    reviews: reviewType[];
}

export interface reviewType {
    name: string;
    comment: string;
    rating: number;
}

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
}, { timestamps: true });

export const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, sparse: true },
    image: { type: String, required: true },
    imageKey: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema]
}, {
    timestamps: true,
});

export const Product = mongoose.model("Product", productSchema);
export const Review = mongoose.model("Review", reviewSchema);