import { ProxyOptionType } from './../types.d';
import express, { Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';


const options: ProxyOptionType = {
    target: 'https://kr.api.riotgames.com/',
    headers: {
        'X-Riot-Token': process.env.RIOT_TOKEN as string,
    },
    changeOrigin: true,
    router: (req: Request) => {
        const { region } = req.query;
        return region ? `https://${region}.api.riotgames.com` : `https://kr.api.riotgames.com`;
    }
}
const lolProxy = createProxyMiddleware(options);

export default lolProxy;