import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/getSilver', (req, res) => {
    res.send('getSilver server');
})

module.exports = router;