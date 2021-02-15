export const URLHEAD = (region: string) => {
    return `https://${region}.api.riotgames.com`;
}

export const GET_SUMMOER_BY_NAME = (summonerId: string, region: string) => {
    return `${URLHEAD(region)}/lol/summoner/v4/summoners/by-name/${summonerId}?region=${region}`;
}

export const GET_SUMMONER_DETAIL_BY_ID = (id: string, region: string) => {
    return `${URLHEAD(region)}/lol/league/v4/entries/by-summoner/${id}?region=${region}`;
}

export const GET_MATCH_ID = (accountId: string, region: string) => {
    return `${URLHEAD(region)}/lol/match/v4/matchlists/by-account/${accountId}?region=${region}`;
}

export const GET_MATCH_DETAILS = (gameId: number, region: string) => {
    return `${URLHEAD(region)}/lol/match/v4/matches/${gameId}?region=${region}`;
}