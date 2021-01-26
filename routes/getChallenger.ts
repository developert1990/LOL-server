import { ProxyOptionType } from './../types.d';
import express, { Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const challengerRouter = express.Router();

const app = express();
app.use(express.json());
console.log('챌린저 정보')
const {
    RIOT_TOKEN
} = process.env;




const options: ProxyOptionType = {

    target: `https://kr.api.riotgames.com`,
    changeOrigin: true,
    headers: {
        'X-Riot-Token': process.env.RIOT_TOKEN as string,
    },
    router: (req: Request) => {
        const { division, region, tierPage } = req.query;
        console.log(tierPage, region, division)
        console.log(region);
        // http://localhost:7779/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?region=kr
        console.log(`https://${region}.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/${division}?page=${tierPage}&${RIOT_TOKEN}`)
        return region ? `https://${region}.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/${division}?page=${tierPage}&${RIOT_TOKEN}` : `https://kr.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/${division}?page=${tierPage}&${RIOT_TOKEN}`;
        // return region ? `https://${region}.api.riotgames.com` : `https://kr.api.riotgames.com`;
    }

}
const lolProxy = createProxyMiddleware(options);


challengerRouter.use('/data', lolProxy);


challengerRouter.use('/test', (req, res) => {
    console.log('test');
    res.send('테스트 성공')
})


// router.get('/', async (req, res) => {
//     console.log(req.params.page);
//     console.log('들어옴')
//     // const response = await axios.get('https://kr.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/I?page=1')
//     // const data = await response.json();
//     // console.log(data);

//     console.log('challenger server');
//     // res.send('getChallenger server');
// })

export default challengerRouter;