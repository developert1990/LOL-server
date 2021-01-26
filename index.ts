import express from 'express';
import cors from 'cors';

import challengerRouter from './routes/getChallenger';
import grandMasterRouter from './routes/getGrandmaster';
import masterRouter from './routes/getMaster';
import diamondRouter from './routes/getDiamond';
import lolProxy from './routes/getBaseDataRouter';

// import platinum from './routes/getPlatinum';
// import gold from './routes/getGold';
// import silver from './routes/getSilver';
// import bronzeRouter from './routes/getBronze';
// import iron from './routes/getIron';



const app = express();
const PORT = 7080;


const corsOption = {
    origin: true,
    credentials: true,
    preFlightContinue: true,
}

app.use(cors<cors.CorsRequest>(corsOption));
app.use(express.json());
app.use(express.static("public"));



app.listen(PORT, () => {
    console.log("LOL Server is running..");
})



app.use('/CHALLENGER', challengerRouter);
app.use('/GRANDMASTER', grandMasterRouter);
app.use('/MASTER', masterRouter);
app.use('/DIAMOND', diamondRouter);


app.use('/lol', lolProxy, (req, res) => {
    res.send('server is up and running');
});

