
import { CustomRequestExtendsUser, decodeExistingUserType, decodeTypeForRenewToken } from '../types';
import { cartItemsType, User, UserSchemaType } from './../models/userModel';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userFromDB } from '../types';
import { checkTokenEXP, generateToken, getCookieDomain, isAdmin, isAuth, verifyToken } from '../libs/libraries';
import { COOKIENAME, COOKIE_EXP, MESSAGES, TIME } from '../constants/userConstants';
import cookie from 'cookie';


const userRouter = express.Router();

userRouter.get('/createAdminAcc', async (req: Request, res: Response) => {
    const user = new User({
        name: 'Hong',
        email: 'admin@example.com',
        password: bcrypt.hashSync('password', 8),
        isAdmin: true,
    })
    const createdUsers = user.save();
    res.send({ createdUsers });
})


userRouter.post('/register', async (req: Request, res: Response) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    const a = getCookieDomain() as string;
    console.log('쿠키 도메인 설정할거 ===>> ', a)
    try {

        const createdUser = await user.save();
        const typedUser = createdUser as userFromDB;

        const token = await generateToken(typedUser);
        const refreshToken = await generateToken(typedUser, COOKIE_EXP.REFRESH_TOKEN_EXP);
        // 만료시간 계산.
        const tokenExp = await checkTokenEXP(token);
        const refreshTokenExp = await checkTokenEXP(refreshToken);

        if (!token) {
            return res.status(404).send({ massage: "Invalid token.." })
        }

        // 짧은 만료기간을 가진 일반 토큰 쿠키에 저장
        res.cookie(COOKIENAME.LOL_COOKIE, token, {
            maxAge: 1000 * 60 * TIME.REGULAR_TOKEN_TIME,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            domain: getCookieDomain(),
        });

        // 조금 긴 만료기간을 가진 refresh 토큰 쿠키에 저장
        res.cookie(COOKIENAME.LOL_COOKIE_REFRESH, refreshToken, {
            maxAge: 1000 * 60 * TIME.REFRESH_TOKEN_TIME,
            httpOnly: true, // 10 분
            secure: process.env.NODE_ENV === "production",
            domain: getCookieDomain(),

        })
        res.send({
            name: typedUser.name,
            email: typedUser.email,
            cart: typedUser.cart,
            tokenExp: tokenExp,
            refreshTokenExp: refreshTokenExp,
        })
    } catch (error) {
        console.log("에러발생했다.")
        res.redirect(307, './signin'); // 307: redirect to post method.
    }


})


userRouter.post('/signin', async (req: Request, res: Response) => {
    console.log("사인인 들어옴")
    const user = await User.findOne({ email: req.body.email });
    const typedUser = user as userFromDB;

    if (!user) {
        return res.status(404).send({ message: MESSAGES.INVALID_EMAIL })
    }

    const checkPassword = await bcrypt.compare(req.body.password, typedUser.password);
    if (!checkPassword) {
        return res.status(404).send({ message: MESSAGES.INVALID_PASSWORD });
    }

    // 토큰 생성.
    const token = await generateToken(typedUser);
    const refreshToken = await generateToken(typedUser, COOKIE_EXP.REFRESH_TOKEN_EXP);

    // 만료시간 계산.
    const tokenExp = await checkTokenEXP(token);
    const refreshTokenExp = await checkTokenEXP(refreshToken);

    if (token && refreshToken) {
        // 짧은 만료기간을 가진 일반 토큰 쿠키에 저장
        res.cookie(COOKIENAME.LOL_COOKIE, token, {
            maxAge: 1000 * 60 * TIME.REGULAR_TOKEN_TIME,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            domain: getCookieDomain(),
        });

        // 조금 긴 만료기간을 가진 refresh 토큰 쿠키에 저장
        res.cookie(COOKIENAME.LOL_COOKIE_REFRESH, refreshToken, {
            maxAge: 1000 * 60 * TIME.REFRESH_TOKEN_TIME,
            httpOnly: true, // 10 분
            secure: process.env.NODE_ENV === "production",
            domain: getCookieDomain(),
        })

        res.send({
            name: typedUser.name,
            email: typedUser.email,
            cart: typedUser.cart,
            tokenExp: tokenExp,
            refreshTokenExp: refreshTokenExp,
        });
    } else {
        res.status(404).send(MESSAGES.INVALID_TOKEN);
    }
})

// // user signout 그리고 로그아웃할때 db에  local storage에 있는 제품 전부 저장한다.
userRouter.put('/signout', isAuth, async (req: CustomRequestExtendsUser, res: Response) => {
    console.log("signout 들어옴")
    const userId = req.user;
    const cartItems = req.body;
    console.log('cartItems ==> ', cartItems)
    const typedCartItems = cartItems as cartItemsType[];
    console.log('userId ==> ', userId)
    const user = await User.findById(userId);
    const typedUser = user as UserSchemaType;

    console.log('typedCartItems', typedCartItems)
    if (typedCartItems.length !== 0) {
        typedUser.cart = [];
        typedCartItems.map((item) => {
            typedUser.cart.push(item);
        })
        await typedUser.save();
    } else {
        typedUser.cart = [];
        await typedUser.save();
    }



    res.clearCookie(COOKIENAME.LOL_COOKIE)
    res.clearCookie(COOKIENAME.LOL_COOKIE_REFRESH)
    res.status(200).send({ message: "Successfully logged out" })
});






// check isAdmin
userRouter.get('/checkAdmin', isAdmin, async (req: Request, res: Response) => {
    res.status(200).send({ isAdmin: true })

});



// renew regular 'Access Token' with using 'Refresh Token'
userRouter.get('/refreshSession', async (req: Request, res: Response) => {
    if (!req.headers.cookie) {
        console.log("쿠키 없어서 튕김")
        return res.status(400).send({ message: "need Re-login " });
    }
    const cookies = cookie.parse(req.headers.cookie as string);
    const refreshToken = cookies.leagueOfLegend_refresh_token
    const tokenVerified = await verifyToken(refreshToken);
    console.log('tokenVerified ==> ', tokenVerified);
    const typedTokenVerified = tokenVerified as decodeTypeForRenewToken;
    if (!typedTokenVerified.verified) {
        return res.status(400).send({ message: "Error.. Refresh token is not verified." })
    }

    const newToken = await generateToken(typedTokenVerified.user as decodeExistingUserType)
    console.log('newToken', newToken);
    const newTokenExp = await checkTokenEXP(newToken);
    if (newToken && typedTokenVerified.user) {

        const user = await User.findOne({ email: typedTokenVerified.user.email });
        const typedUser = user as userFromDB;

        // 짧은 만료기간을 가진 일반 토큰 쿠키에 저장
        res.cookie(COOKIENAME.LOL_COOKIE, newToken, {
            maxAge: 1000 * 60 * 1,
            // httpOnly: true,
            domain: getCookieDomain(),
        });
        return res.send({
            name: typedTokenVerified.user.name,
            email: typedTokenVerified.user.email,
            cart: typedUser.cart,
            tokenExp: newTokenExp,
        });
    } else {
        return res.status(404).send(MESSAGES.INVALID_TOKEN);
    }

})







export default userRouter;


