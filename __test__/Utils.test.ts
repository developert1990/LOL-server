import { GET_MATCH_DETAILS, GET_MATCH_ID, GET_SUMMOER_BY_NAME, GET_SUMMONER_DETAIL_BY_ID, URLHEAD } from '../utils/utils';

describe("test all endpoint for RIOT API", () => {
    test("URLHEAD test", () => {
        expect(URLHEAD("kr")).toBe(`https://kr.api.riotgames.com`);
    });
    test("GET_SUMMOER_BY_NAME test", () => {
        expect(GET_SUMMOER_BY_NAME("hide%20on%20bush", "kr")).toBe("https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/hide%20on%20bush?region=kr");
    });
    test("GET_SUMMONER_DETAIL_BY_ID test", () => {
        expect(GET_SUMMONER_DETAIL_BY_ID("PAdcKpoBoLc4Zs4nIwXtn1--hhElJGnC3ZpMgZ8k9c0wtg", "kr")).toBe("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/PAdcKpoBoLc4Zs4nIwXtn1--hhElJGnC3ZpMgZ8k9c0wtg?region=kr");
    });

    test("GET_MATCH_ID test", () => {
        expect(GET_MATCH_ID("PICVAE-59XRJKW0F9RpFxXlWZeZ9S9JFlQLoicwCrxbL", "kr")).toBe("https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/PICVAE-59XRJKW0F9RpFxXlWZeZ9S9JFlQLoicwCrxbL?region=kr");
    });

    test("GET_MATCH_DETAILS test", () => {
        expect(GET_MATCH_DETAILS(4998557652, "kr")).toBe("https://kr.api.riotgames.com/lol/match/v4/matches/4998557652?region=kr");
    });

})