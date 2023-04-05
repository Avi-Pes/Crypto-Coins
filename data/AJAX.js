"use strict"

async function getAllCoins() {
    const url = `https://api.coingecko.com/api/v3/coins/list`

    try {
        const res = await fetch(url)
        const json = await res.json()
        // console.log('=====>', 'json:', json);
        return json
    } catch (error) {
        console.error(error);
    }



}
