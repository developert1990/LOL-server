import express, { Request, Response } from 'express';
import { isAdmin } from '../libs/libraries';
import { upload } from '../middlewares/s3Upload';
import { Product, productsInfoType } from '../models/productModel';
import { deleteFile } from '../middlewares/s3Delete';

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

});

productRouter.get('/productList/:name/:category/:priceLessThan/:sortBy/AdminProductList', isAdmin, async (req: Request, res: Response) => {

    console.log("리스트 뽑으러 옴");
    console.log('req.body: ', req.body)
    console.log('req.params.name', req.params.name)
    console.log('req.params.category', req.params.category)
    console.log('req.params.priceLessThan', req.params.priceLessThan)
    console.log('req.params.sortBy', req.params.sortBy)

    const productList = await Product.find();
    res.status(200).send(productList);
});


// Admin계정으로 product delete 하는 API
productRouter.delete('/productDelete/:id/AdminProductDelete', isAdmin, async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    const typedProduct = product as productsInfoType
    if (!product) {
        res.status(404).send({ message: 'Product Not Found' });
    } else {
        deleteFile(typedProduct.imageKey);
        const deletedProduct = await product.remove();
        res.send({ message: 'Product Deleted', product: deletedProduct });
    }
});

// Admin계정으로 product update 하는 API
productRouter.put('/productUpdate/:id/AdminProductUpdate', isAdmin, async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    const typedProduct = product as productsInfoType;
    if (typedProduct) {
        typedProduct.name = req.body.product.name;
        typedProduct.price = req.body.product.price;
        typedProduct.image = req.body.product.image;
        typedProduct.category = req.body.product.category;
        typedProduct.brand = req.body.product.brand;
        typedProduct.countInStock = req.body.product.countInStock;
        typedProduct.description = req.body.product.description;
        try {
            const updatedProduct = await typedProduct.save();
            return res.status(200).send({ message: "Product Updated", product: updatedProduct });
        } catch (error) {
            return res.status(404).send({ message: "Product can not be updated" });
        }
    } else {
        res.status(500).send({ message: "Product Not Found" });
    }
})



export default productRouter;