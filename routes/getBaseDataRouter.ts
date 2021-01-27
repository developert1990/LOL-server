import { URLHEAD, GET_SUMMOER_BY_NAME, GET_SUMMONER_DETAIL_BY_ID, GET_MATCH_ID, GET_MATCH_DETAILS } from './../utils/utils';
import { ProxyOptionType } from './../types.d';
import express, { Request, Response } from 'express';
import Axios from 'axios';


const baseDataRouter = express.Router();

// 검색한 해당 유저 info
baseDataRouter.get('/proxy/:summonerId/:region', async (req: Request, res: Response) => {
    console.log('환경변수 라이엇 ', process.env.RIOT_TOKEN)
    const summonerId = req.params.summonerId;
    const region = req.params.region;
    if (!region) {
        return res.status(404).send({ message: "No region set" });
    }
    const { data } = await Axios.get(`${GET_SUMMOER_BY_NAME(summonerId, region)}`, {
        headers: { 'X-Riot-Token': process.env.RIOT_TOKEN as string }
    })
    res.status(200).send(data);
});

// user의 detail info
baseDataRouter.get('/proxy/:id/:region/summonerDetail', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const region: string = req.params.region;
    if (!id || !region) {
        return res.status(404).send({ message: "No region or id set" });
    }
    const { data } = await Axios.get(`${GET_SUMMONER_DETAIL_BY_ID(id, region)}`, {
        headers: { 'X-Riot-Token': process.env.RIOT_TOKEN as string }
    });
    res.status(200).send(data);
})

// user의 game match 된 ID 들 뽑는곳
baseDataRouter.get('/proxy/:accountId/:region/matchId', async (req: Request, res: Response) => {
    const accountId: string = req.params.accountId;
    const region: string = req.params.region;
    if (!accountId || !region) {
        return res.status(404).send({ message: "No region or accountId set" });
    }

    const { data } = await Axios.get(`${GET_MATCH_ID(accountId, region)}`, {
        headers: { 'X-Riot-Token': process.env.RIOT_TOKEN as string }
    });
    res.status(200).send(data);
});

// user의 game match list 를 id 를 통해 뽑는곳
baseDataRouter.get('/proxy/:matchId/:region/matchList', async (req: Request, res: Response) => {
    const matchId: number = Number(req.params.matchId);
    const region: string = req.params.region;
    console.log('matchId ==> ', matchId)
    console.log('region ==> ', region)
    if (!matchId || !region) {
        return res.status(404).send({ message: "No region or matchId set" });
    }
    const { data } = await Axios.get(`${GET_MATCH_DETAILS(matchId, region)}`, {
        headers: { 'X-Riot-Token': process.env.RIOT_TOKEN as string }
    });
    res.status(200).send(data);
})


export default baseDataRouter;
















// const options: ProxyOptionType = {
//     target: 'https://kr.api.riotgames.com/',
//     headers: {
//         'X-Riot-Token': process.env.RIOT_TOKEN as string,
//     },
//     changeOrigin: true,
//     router: (req: Request) => {
//         const { region } = req.query;
//         return region ? `https://${region}.api.riotgames.com` : `https://kr.api.riotgames.com`;
//     }
// }
// const lolProxy = createProxyMiddleware(options);
// console.log('라이엇 토큰!!!', process.env.RIOT_TOKEN);



// export default lolProxy;