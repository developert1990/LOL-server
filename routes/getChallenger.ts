import { ProxyOptionType } from './../types.d';
import express, { Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const challengerRouter = express();

console.log('process.env ==> ', process.env.RIOT_TOKEN)

console.log('챌린저 정보')
const {
    RIOT_TOKEN
} = process.env;


console.log('챌린저에서 토큰!!!', RIOT_TOKEN)

challengerRouter.get('/test', (req, res, next) => {
    try {
        res.status(200).send("중간 테스트..?");
    } catch (error) {
        next(error);
    }
})

challengerRouter.get('/data', createProxyMiddleware({
    target: `https://kr.api.riotgames.com`,
    changeOrigin: true,
    headers: {
        'X-Riot-Token': process.env.RIOT_TOKEN as string,
    },
    // override target 'https://kr.api.riotgames.com' to 'overridedURL'
    router: (req) => {
        console.log("디비전 다 잇음")
        const { division, region, tierPage } = req.query;
        const overridedURL = `https://${region}.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/CHALLENGER/${division}?page=${tierPage}&${RIOT_TOKEN}`
        return overridedURL;
    },

}))


export default challengerRouter;