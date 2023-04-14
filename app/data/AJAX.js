"use strict"

async function getAllCoins() {
    const url = `https://api.coingecko.com/api/v3/coins/list`

    try {
        const res = await fetch(url)
        const json = await res.json()
        FILTER_STATE.allCoins = json

        // ! for development only:
        const shorter = []
        json.forEach((coin, i) => { if (i >= 500 && i < 600) shorter.push(coin) })
        return shorter
        // !!!!!!!!!!

        return json
    } catch (error) {
        console.error(error)
    }

}

async function getCoin(id) {
    const url = `https://api.coingecko.com/api/v3/coins/${id}`

    try {
        const res = await fetch(url)
        const json = await res.json()

        return json
    } catch (error) {
        console.error(error)
    }
}
