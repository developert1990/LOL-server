import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/getIron', (req, res) => {
    res.send('getIron server');
})

module.exports = router;