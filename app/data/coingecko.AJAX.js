"use strict"

async function getAllCoins() {
    const url = `https://api.coingecko.com/api/v3/coins/list`

    try {
        const res = await fetch(url)
        const json = await res.json()
        FILTER_STATE.allCoins = json

        return json
    } catch (error) {
        alertError(error)
    }
}

async function getCoin(id) {
    const url = `https://api.coingecko.com/api/v3/coins/${id}`

    try {
        const res = await fetch(url)
        const json = await res.json()

        return json
    } catch (error) {
        alertError(error)
    }
}
