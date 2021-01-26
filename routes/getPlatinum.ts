import express from 'express';
const router = express.Router();

router.get('/getPlatinum', (req, res) => {
    res.send('getPlatinum server');
})

module.exports = router;