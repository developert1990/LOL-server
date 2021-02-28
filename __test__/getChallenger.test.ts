import request from 'supertest';
import * as dotenv from 'dotenv';
dotenv.config();
// import { NextFunction, Request, Response } from 'express';
import { server } from '../index';

import challengerRouter from '../routes/getChallenger';
import axios from 'axios';
// import express from 'express';
// import { app } from '../index';
import { createProxyMiddleware } from 'http-proxy-middleware';

describe("All Challengers", () => {
    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    })

    afterAll(() => {
        server.close();
    })

    // https://stackoverflow.com/questions/64051580/how-to-test-express-router-catch-branch-in-this-scenario-using-jest

    // test("Success to get all Challengers", async () => {
    //     const express = require('express');
    //     const mRouter = { get: jest.fn() };
    //     const mReq = {};
    //     const mRes = { status: jest.fn().mockReturnThis(), render: jest.fn() };
    //     const mNext = jest.fn();
    //     const mock = jest.spyOn(express, 'Router').mockImplementationOnce(() => mRouter);
    //     const subApplication = () => {
    //         return "good";
    //     }
    //     mRouter.get.mockImplementation((path, callback) => {
    //         if (path === "") {
    //             callback(mReq, mRes, mNext);
    //         }
    //     })
    //     const result = challengerRouter.get("/CHALLENGER/data?division=I&region=kr&tierPage=1");
    //     expect(mock).toBeCalledWith("/CHALLENGER/data?division=I&region=kr&tierPage=1");
    //     console.log('result??? ', result);

    //     // const result = await request(server).get("/CHALLENGER/data?division=I&region=kr&tierPage=1");
    //     // expect(result.body.length).toBeGreaterThan(1);
    // })

    // test("Fail to get all Challengers when tierPage is not 1", async () => {
    //     const result = await request(server).get("/CHALLENGER/data?division=I&region=kr&tierPage=3");
    //     expect(result.body.length).toBe(0);
    // })

    test("Fail to get all Challengers when division is not 'I'", async () => {
        const result = await request(server).get("/CHALLENGER/data?division=II&region=kr&tierPage=1");
        expect(result.body).toEqual({ "status": { "message": "Bad request - Division is invalid", "status_code": 400 } });
    })

})