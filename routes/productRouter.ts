import express, { Request, Response } from 'express';
import { isAdmin } from '../libs/libraries';
import { upload } from '../middlewares/s3Upload';
import { Product } from '../models/productModel';


const productRouter = express();

productRouter.post('/upload', isAdmin, upload, async (req: Request, res: Response) => {
    const { createProduct } = req.body;
    const { name, price, category, brand, countInStock, description } = JSON.parse(createProduct);

    const product = new Product({
        name,
        // @ts-ignore 이부분 오픈소스 들어가서 한번 고쳐 주자 시간있으면...
        image: req.file.location,
        // @ts-ignore
        imageKey: req.file.key,
        price,
        category,
        brand,
        countInStock,
        rating: 0,
        numReviews: 0,
        description,
    });
    console.log('product: ', product)
    try {
        const createProduct = await product.save();
        res.send({ message: "Product created.", product: createProduct })
    } catch (error) {
        res.status(500).send(`There's an error to create product in database => Error: ${error} `);
    }

})


export default productRouter;