import { CustomRequestExtendsUser, decodeExistingUserType, decodeType, decodeTypeForRenewToken } from '../types';
import { COOKIENAME, COOKIE_EXP, DOMAIN } from '../constants/userConstants';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { userFromDB } from '../types';
import { NextFunction, Response } from 'express';

export const generateToken = async (user: userFromDB | decodeExistingUserType, expiresIn = COOKIE_EXP.REGULAR_TOKEN_EXP) => {
    console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)
    return jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET as string, {
        expiresIn
    })
}

export const verifyToken = async (token: string) => {
    console.log('넘어온 token', token)
    if (!token) {
        return { verified: false, user: null }
    }
    const tokenVerifying = jwt.verify(token as string, process.env.JWT_SECRET as string, (err, decode) => {
        if (err) {
            return { verified: false, user: null };
        } else {
            const { _id, name, exp, email, isAdmin } = decode as decodeType;
            console.log('decode: ', decode);
            return { verified: true, user: { _id, name, email, isAdmin } };
        };
    });
    return tokenVerifying;
}


export const checkTokenEXP = async (token: string) => {
    console.log('넘어온 token', token)
    let tokenExp;
    if (!token) {
        return "can not check token exp"
    }
    jwt.verify(token as string, process.env.JWT_SECRET as string, (err, decode) => {
        if (err) {
            return `got an err : ${err}`
        } else {
            const now = Math.floor(new Date().getTime() / 1000.0)
            console.log('decode: ', decode)
            console.log('현재시간', now)
            const { _id, name, exp } = decode as decodeType;
            console.log('exp: ', exp)
            console.log('타임체크: ', (exp - now)) // 초로 계산된다. 10분 남았으면 600초, 20분 남았으면 1200초
            // const remainCookieExpiration = exp - now
            tokenExp = exp - now
        };
    })
    return tokenExp;
}


export const IS_PROD: boolean = process.env.NODE_ENV === "production";
export const getCookieDomain = () => IS_PROD ? DOMAIN.PROD : DOMAIN.DEV;




// 계정으로 접속 햇을 때 API를 사용하기 위해 verify 하는 middleware.
export const isAuth = (req: CustomRequestExtendsUser, res: Response, next: NextFunction) => {

    const cookies = cookie.parse(req.headers.cookie as string);
    const token = cookies[COOKIENAME.LOL_COOKIE];
    const refreshToken = cookies[COOKIENAME.LOL_COOKIE_REFRESH]
    console.log('refreshToken ==> ', refreshToken)
    if (token || refreshToken) {
        jwt.verify(token || refreshToken, process.env.JWT_SECRET as string, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {
                const { _id, name } = decode as decodeType;
                req.user = _id;
                req.name = name;
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'No Token' });
    }

}




// amin계정으로 접속했을 경우에 admin관리를 할 수 있는 페이지에서 동작하는 API를 verify 해주기 위한 middleware
export const isAdmin = (req: CustomRequestExtendsUser, res: Response, next: NextFunction) => {
    const cookies = cookie.parse(req.headers.cookie as string);
    // console.log('cookies: ', cookies)
    const token = cookies.leagueOfLegend_my_token;

    if (cookies) {
        jwt.verify(token as string, process.env.JWT_SECRET as string, async (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            } else {

                const typedDecod = decode as decodeType
                if (typedDecod.isAdmin) {
                    console.log("어드민 true")
                    next();
                } else {
                    console.log("어드민 false")
                    res.status(200).send({ isAdmin: false })
                }

            }
        });
    } else {
        res.status(401).send({ message: 'No Token' });
    }
}

