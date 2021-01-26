import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/getGold', (req, res) => {
    res.send('getGold server');
})

module.exports = router;