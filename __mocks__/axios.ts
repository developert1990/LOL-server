const enum QUERYENUM {
    UNEXISTINGID = "28745dfgeg235ertert",
    EXISTINGID_01 = "hide%20on%20bush",
    EXISTINGID_02 = "dwg%20viper",
    NORANKINFO_ID = "rlbFqFa8wbKH-P6Mpyj_gYDN5ceypgCbCGbgYOpSA-aZl-k",
    KR = "kr",
    NA1 = "na1",
}

export default {
    get: jest.fn(() => { }),
    post: jest.fn((url) => {
        if (url === '/something') {
            return Promise.resolve({
                data: 'data'
            });
        }
        if (url === '/something2') {
            return Promise.resolve({
                data: 'data2'
            });
        }
    }),
    create: jest.fn(function () {
        return;
    })
};