import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const bronzeRouter = express.Router();

bronzeRouter.get('/getBronze', (req, res) => {
    res.send('getBronze server');
})

export default bronzeRouter;