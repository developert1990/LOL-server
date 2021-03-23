import * as http from "http";
import { productsInfoType } from './models/productModel';
import { Document } from 'mongoose';
import { Request } from 'express';

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


export interface userFromDB extends Document {
    _id: string;
    password: string;
    name: string;
    email: string;
    isAdmin: boolean;
    cart: productsInfoType[],
    token: () => string;
}

export interface decodeType {
    _id: string;
    name: string;
    email: string,
    isAdmin: boolean,
    iat: number,
    exp: number
}


export interface decodeTypeForRenewToken {
    verified: boolean;
    user: null | decodeExistingUserType;
}

export interface decodeExistingUserType {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}


export interface CustomRequestExtendsUser extends Request {
    user?: string;
    name?: string;
}