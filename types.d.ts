import * as http from "http";

export interface ProxyOptionType {
    target: string;
    changeOrigin: boolean;
    headers: { [header: string]: string };
    router: any;
}