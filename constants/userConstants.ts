export const COOKIENAME = {
    LOL_COOKIE: 'leagueOfLegend_my_token',
    LOL_COOKIE_REFRESH: 'leagueOfLegend_refresh_token',
}

export const DOMAIN = {
    // PROD: 'ec2-3-80-79-7.compute-1.amazonaws.com',
    // DEV: "localhost",
    PROD: process.env.COOKIE_DOMAIN_PROD,  // 여기서 도메인은 EC2의 Public IPv4 DNS 값이다.(ex => ec2-3-80-79-7.compute-1.amazonaws.com) 지금은 leagueoflegend.ml/
    DEV: "localhost",
}

export const TIME = {
    REGULAR_TOKEN_TIME: 60, // 10분
    REFRESH_TOKEN_TIME: 180, // 3시간
}

export const COOKIE_EXP = {
    REGULAR_TOKEN_EXP: `${TIME.REGULAR_TOKEN_TIME}m`,
    // REFRESH_TOKEN_EXP: 1000 * 60 * 60 * 2, // 2시간
    REFRESH_TOKEN_EXP: `${TIME.REFRESH_TOKEN_TIME}m`,
}

export const MESSAGES = {
    INVALID_EMAIL: 'Invalid email',
    INVALID_PASSWORD: 'Invalid password',
    INVALID_TOKEN: 'Invalid token..',
}
