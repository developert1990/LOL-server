import request from 'supertest';
import * as dotenv from 'dotenv';
dotenv.config();
import baseDataRouter from '../routes/getBaseDataRouter';
import axios from 'axios';
import mockedAxios from '../__mocks__/axios';
import { QUERYENUM, EXISTINGID_01_InfoResult, EXISTINGID_02_InfoResult, matchIdEX, matchedGameDetail, userDetailResult } from './SuccessData';



const headers = { "headers": { "X-Riot-Token": "RGAPI-6fdef885-e224-46ed-8ca7-4b64ccbdfa75" } };



describe("User Info test", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("A user Info test with no summonerId", async (done) => {
        // spyOn 사용해서.... aixos 를 mocking 한거라서 resolve나 reject의 값을 뽑을 때 반드시 {data: value} 형태로 뽑아야 한다. fetch일 경우에는 json()까지 해줘야한다.
        const mock = jest.spyOn(axios, 'get');
        mock.mockImplementation(() => Promise.reject({
            data: "This summoner is not registered at H.GG."
        }))
        const result = await request(baseDataRouter).get(`/proxy/${QUERYENUM.UNEXISTINGID}/${QUERYENUM.KR}`).set({ 'X-Riot-Token': process.env.RIOT_TOKEN }).send()
        expect(result.status).toBe(404);
        expect(result.body.message).toBe("This summoner is not registered at H.GG.");
        done();
    });
    test("A user Info test Success", async () => {

        // axios 라는 mock을 통합해서 만들어서 사용.
        mockedAxios.get.mockImplementation(() => Promise.resolve({
            data: {
                "id": "PAdcKpoBoLc4Zs4nIwXtn1--hhElJGnC3ZpMgZ8k9c0wtg",
                "accountId": "PICVAE-59XRJKW0F9RpFxXlWZeZ9S9JFlQLoicwCrxbL",
                "puuid": "1PebRDVwxeuKe89HIVUIQyJ5jLd1jrDWsSU-kBhJ5fr0c-gdvjswh89k5j4mm24IQyoZJnUU2qnW0g",
                "name": "Hide on bush",
                "profileIconId": 6,
                "revisionDate": 1612774178000,
                "summonerLevel": 414
            }
        }))

        const result = await request(baseDataRouter).get(`/proxy/${QUERYENUM.EXISTINGID_01}/${QUERYENUM.KR}`).set({ 'X-Riot-Token': process.env.RIOT_TOKEN }).send();
        expect(result.status).toBe(200);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/hide on bush?region=kr`, headers);
        expect(result.body).toEqual(EXISTINGID_01_InfoResult) // 객체를 비교할 때 toMatchObject shallow equality, toEqual 은 deep equality이다.
    })

})




describe("User Detail test", () => {
    afterEach(() => {
        mockedAxios.get.mockReset();
    });

    test("No region and Id set", async () => {
        mockedAxios.get.mockImplementation(() => Promise.reject({
            data: { message: "Id is incorrect" }
        }));

        const result = await request(baseDataRouter).get(`/proxy/RandomName/${QUERYENUM.KR}/summonerDetail`).set({ 'X-Riot-Token': process.env.RIOT_TOKEN }).send(); // send()는 POST 요청할때 사용 
        expect(result.status).toBe(400);
        expect(mockedAxios.get).toHaveBeenCalled();
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/RandomName?region=kr", headers);
        expect(result.body.message).toBe("Id is incorrect");
        jest.resetAllMocks();
    })

    test("User Detail test Success", async () => {
        mockedAxios.get.mockImplementation(() => Promise.resolve({
            data: [{
                "freshBlood": false, "hotStreak": false, "inactive": false, "leagueId": "a37af09b-ecb8-3664-9453-cf2b0138dd6e",
                "leaguePoints": 353, "losses": 141, "queueType": "RANKED_SOLO_5x5", "rank": "I", "summonerId": "PAdcKpoBoLc4Zs4nIwXtn1--hhElJGnC3ZpMgZ8k9c0wtg",
                "summonerName": "Hide on bush", "tier": "GRANDMASTER", "veteran": false, "wins": 161
            }]
        }))
        const result = await request(baseDataRouter).get(`/proxy/${EXISTINGID_01_InfoResult.id}/${QUERYENUM.KR}/summonerDetail`).set({ 'X-Riot-Token': process.env.RIOT_TOKEN }).send();
        expect(result.status).toBe(200);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/PAdcKpoBoLc4Zs4nIwXtn1--hhElJGnC3ZpMgZ8k9c0wtg?region=kr", headers)
        expect(result.body).toEqual(userDetailResult);
    })

    // 이부분 여쭤보기
    test("User Detail with no rank information test Success", async () => {
        mockedAxios.get.mockImplementation(() => Promise.resolve({
            data: { message: "No rank information for current filters." }
        }))
        const result = await request(baseDataRouter).get(`/proxy/${QUERYENUM.NORANKINFO_ID}/${QUERYENUM.KR}/summonerDetail`).set({ 'X-Riot-Token': process.env.RIOT_TOKEN }).send();

        expect(result.status).toBe(200);
        expect(mockedAxios.get).toHaveBeenCalled();
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/rlbFqFa8wbKH-P6Mpyj_gYDN5ceypgCbCGbgYOpSA-aZl-k?region=kr", headers)
        expect(result.body.message).toEqual("No rank information for current filters.");
    })
});





describe("Get Game matched test", () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    test("matched game data test success", async () => {
        const mock = jest.spyOn(axios, 'get');
        mock.mockImplementation(() => Promise.resolve({
            data: {
                matches: new Array(100),
            }
        }))
        const result = await request(baseDataRouter).get(`/proxy/${EXISTINGID_01_InfoResult.accountId}/kr/matchId`);
        expect(result.status).toBe(200);
        expect(mock).toHaveBeenCalled();
        expect(mock).toHaveBeenCalledWith(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${EXISTINGID_01_InfoResult.accountId}?region=kr`, headers);
        expect(result.body.matches).toHaveLength(100); // 100개의 게임 데이터를 matches에 가지고 있음.
    });


    test("No matched history", async () => {
        const mock = jest.spyOn(axios, 'get');
        mock.mockImplementation(() => Promise.reject({
            data: { message: "No match history." }
        }))
        const result = await request(baseDataRouter).get(`/proxy/${EXISTINGID_02_InfoResult.accountId}/kr/matchId`);
        expect(result.status).toBe(404);
        expect(mock).toHaveBeenCalled();
        expect(mock).toHaveBeenCalledWith(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${EXISTINGID_02_InfoResult.accountId}?region=kr`, headers)
        expect(result.body.message).toBe("No match history.");
    })
})


describe("Matched game detail", () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    test("Matched game detail success", async () => {
        const mock = jest.spyOn(axios, 'get');
        mock.mockImplementation(() => Promise.resolve({
            data: matchedGameDetail,
        }));

        const result = await request(baseDataRouter).get(`/proxy/${matchIdEX.withHistory}/${QUERYENUM.KR}/matchList`);
        expect(result.status).toBe(200);
        expect(mock).toHaveBeenCalled();
        expect(mock).toHaveBeenCalledWith(`https://kr.api.riotgames.com/lol/match/v4/matches/${matchIdEX.withHistory}?region=${QUERYENUM.KR}`, headers);
        expect(result.body).toEqual(matchedGameDetail);

    });

    test("No matched game detail", async () => {
        const mock = jest.spyOn(axios, 'get');
        mock.mockImplementation(() => Promise.reject({
            data: { message: "No games for current filters. Try changing the filters or playing some more matches." }
        }));

        const result = await request(baseDataRouter).get(`/proxy/${matchIdEX.withoutHistory}/${QUERYENUM.KR}/matchList`);
        expect(result.status).toBe(405);
        expect(mock).toHaveBeenCalled();
        expect(result.body.message).toEqual("No games for current filters. Try changing the filters or playing some more matches.")
    })
})