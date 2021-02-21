import { MasteriesType } from './types.d';
import axios from 'axios';
import { champs } from './lolChamps';
const getMasteries = async () => {
    const champsData = Object.values(champs.data);
    const { data } = await axios(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/PAdcKpoBoLc4Zs4nIwXtn1--hhElJGnC3ZpMgZ8k9c0wtg`, {
        headers: { 'X-Riot-Token': "RGAPI-6fdef885-e224-46ed-8ca7-4b64ccbdfa75" }
    });
    // console.log('data ====>', data);

    const allMasteriesData: MasteriesType[] = data

    allMasteriesData.map((data) => {
        champsData.map((innerData) => {
            if (data.championId === Number(innerData.key)) {
                data.championId = innerData.id;
            }
        })
    })
    console.log('allMasteriesData', allMasteriesData)

}

getMasteries();

// console.log('champs', Object.values(champs))

// const champsData = Object.values(champs.data);

