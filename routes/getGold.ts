import express from 'express';
const router = express.Router();

router.get('/getGold', (req, res) => {
    res.send('getGold server');
})

module.exports = router;