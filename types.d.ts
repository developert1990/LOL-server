import * as http from "http";

export interface ProxyOptionType {
    target: string;
    changeOrigin: boolean;
    headers: { [header: string]: string };
    router: any;
}





export interface MasteriesType {
    championId: number | string;
    championLevel: number;
    championPoints: number;
    lastPlayTime: number;
    championPointsSinceLastLevel: number;
    championPointsUntilNextLevel: number;
    chestGranted: boolean;
    tokensEarned: number;
    summonerId: string;
}