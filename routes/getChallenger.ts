import { ProxyOptionType } from './../types.d';
import express, { Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const challengerRouter = express.Router();

console.log('챌린저 정보')
const {
    RIOT_TOKEN
} = process.env;


console.log('챌린저에서 토큰!!!', RIOT_TOKEN)

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

export default challengerRouter;