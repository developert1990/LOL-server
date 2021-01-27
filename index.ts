import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import challengerRouter from './routes/getChallenger';
import grandMasterRouter from './routes/getGrandmaster';
import masterRouter from './routes/getMaster';
import diamondRouter from './routes/getDiamond';
// import lolProxy from './routes/getBaseDataRouter';
import baseDataRouter from './routes/getBaseDataRouter';

// import platinum from './routes/getPlatinum';
// import gold from './routes/getGold';
// import silver from './routes/getSilver';
// import bronzeRouter from './routes/getBronze';
// import iron from './routes/getIron';

// json 파일 import 하기 위해서 tsconfig.json에     "resolveJsonModule": true, 이거 추가 해줘야한다. https://gracefullight.dev/2019/11/26/import-json-with-typescript-ts5071/
import champsData from './data/lolChamps.json';
import spellsData from './data/spells.json';
import runesData from './data/runes.json';


const app = express();
const PORT = 7080;

console.log('환경변수: ', process.env.RIOT_TOKEN)

const corsOption = {
    origin: true,
    credentials: true,
    preFlightContinue: true,
}

app.use(cors<cors.CorsRequest>(corsOption));
app.use(express.json());
app.use(express.static("public"));





app.use('/CHALLENGER', challengerRouter);
app.use('/GRANDMASTER', grandMasterRouter);
app.use('/MASTER', masterRouter);
app.use('/DIAMOND', diamondRouter);

app.use('/summonorById', baseDataRouter)


// app.use('/lol', lolProxy, (req, res) => {
//     res.send('server is up and running');
// });



// 이부분이 호출이 되면 요청을 여기서 받고 응답을 해주고 '땡' 한다. 즉 끝. 그 다음건 읽지 않음.
// 챔피언 정보 json 파일에서 받아온다.
app.get('/champs', (req, res) => {
    const champs = champsData.data;
    console.log('champs 정보 받으러 들어옴');
    res.json(champs);
})

// 스펠 정보 json 파일에서 받아온다.
app.get('/spells', (req, res) => {
    const spells = spellsData.data;
    console.log('spells 정보 받으러 들어옴');
    res.json(spells);
})

// 룬 정보 json 파일에서 받아온다.
app.get('/runes', (req, res) => {
    console.log('rune 정보 받으러 들어옴');
    const runes = runesData;
    // console.log(runes);
    res.json(runes);
})





app.listen(PORT, () => {
    console.log(`LOL Server is running.. at ${PORT}`);
})
