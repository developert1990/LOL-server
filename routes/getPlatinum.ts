import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/getPlatinum', (req, res) => {
    res.send('getPlatinum server');
})

module.exports = router;