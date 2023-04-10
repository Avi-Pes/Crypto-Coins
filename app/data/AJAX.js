"use strict"

async function getAllCoins() {
    const url = `https://api.coingecko.com/api/v3/coins/list`

    try {
        const res = await fetch(url)
        const json = await res.json()

        // ! for development only:
        const shorter = []
        json.forEach((coin, i) => { if (i >= 400 && i < 500) shorter.push(coin) })
        return shorter
        // !!!!!!!!!!

        return json
    } catch (error) {
        console.error(error)
    }

}
