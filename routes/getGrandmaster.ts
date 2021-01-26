import { ProxyOptionType } from './../types.d';
import express, { Request } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const grandMasterRouter = express.Router();
import { createProxyMiddleware } from 'http-proxy-middleware';
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
        console.log('grandmaster router')
        return region ? `https://${region}.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/GRANDMASTER/${division}?page=${tierPage}&${RIOT_TOKEN}` : `https://kr.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/${division}?page=${tierPage}&${RIOT_TOKEN}`;
    }

}
const lolProxy = createProxyMiddleware(options);


grandMasterRouter.use('/data', lolProxy);

grandMasterRouter.use('/test', () => {
    console.log('GRANDMASTER ROUTER test');
})



// router.get('/getGrandmaster', (req, res) => {
//     res.send('getGrandmaster server');
// })

export default grandMasterRouter;