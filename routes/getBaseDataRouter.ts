import { URLHEAD, GET_SUMMOER_BY_NAME, GET_SUMMONER_DETAIL_BY_ID, GET_MATCH_ID, GET_MATCH_DETAILS } from './../utils/utils';
import { ProxyOptionType } from './../types.d';
import express, { Request, Response } from 'express';
import Axios from 'axios';


// express.Router() 이렇게 하면 테스트 할때 오류가 난다.... express()로 바꿔주니까 에러 사라짐
const baseDataRouter = express();

// 검색한 해당 유저 info
baseDataRouter.get('/proxy/:summonerId/:region', async (req: Request, res: Response) => {
    const summonerId = req.params.summonerId;
    const region = req.params.region;
    try {
        const { data } = await Axios.get(`${GET_SUMMOER_BY_NAME(summonerId, region)}`, {
            headers: { 'X-Riot-Token': process.env.RIOT_TOKEN as string }
        })
        return res.status(200).send(data);
    } catch (error) {
        return res.status(404).send({ message: "This summoner is not registered at H.GG." });
    }
});

// user의 detail info
baseDataRouter.get('/proxy/:id/:region/summonerDetail', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const region: string = req.params.region;
    try {
        const { data } = await Axios.get(`${GET_SUMMONER_DETAIL_BY_ID(id, region)}`, {
            headers: { 'X-Riot-Token': process.env.RIOT_TOKEN as string }
        });
        // console.log('data ==>> ', data)
        if (data.length !== 0) {
            return res.status(200).send(data);
        } else {

            return res.status(405).send({ message: "No rank information for current filters." })
        }
    } catch (error) {
        return res.status(400).send({ message: "Id is incorrect" })
    }




})

// user의 game match 된 ID 들 뽑는곳
baseDataRouter.get('/proxy/:accountId/:region/matchId', async (req: Request, res: Response) => {
    const accountId: string = req.params.accountId;
    const region: string = req.params.region;
    try {
        const { data } = await Axios.get(`${GET_MATCH_ID(accountId, region)}`, {
            headers: { 'X-Riot-Token': process.env.RIOT_TOKEN as string }


        });
        return res.status(200).send(data);

    } catch (error) {
        return res.status(404).send({ message: "No match history." })
    }
});

// user의 game match list 를 id 를 통해 뽑는곳
baseDataRouter.get('/proxy/:matchId/:region/matchList', async (req: Request, res: Response) => {
    const matchId: number = Number(req.params.matchId);
    const region: string = req.params.region;
    // if (!matchId || !region) {
    //     return res.status(404).send({ message: "No region or matchId set" });
    // }
    try {
        const { data } = await Axios.get(`${GET_MATCH_DETAILS(matchId, region)}`, {
            headers: { 'X-Riot-Token': process.env.RIOT_TOKEN as string }
        });
        res.status(200).send(data);

    } catch (error) {
        res.status(405).send({ message: "No games for current filters. Try changing the filters or playing some more matches." })
    }
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