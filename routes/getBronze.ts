import express from 'express';

const bronzeRouter = express.Router();

bronzeRouter.get('/getBronze', (req, res) => {
    res.send('getBronze server');
})

export default bronzeRouter;