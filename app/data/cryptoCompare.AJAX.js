"use strict"


async function getPrices(arrOfSymbols, isRelaxed = true) {
    if (!arrOfSymbols || !Array.isArray(arrOfSymbols)) throw new Error("Coin symbols expected for fetching prices")

    const myKey = `d1875d231bacee4dddbf3b851d2b0e3800762527ad98ad1bc73bf7e2e7d8905f`
    const keySTR = `&api_key=${myKey}`
    const fromSymbols = arrOfSymbols.join()
    const toSymbols = "USD,EUR,ILS"
    const apiURL = `https://min-api.cryptocompare.com/data/pricemulti?relaxedValidation=${isRelaxed ? 'true' : 'false'}&fsyms=${fromSymbols}&tsyms=${toSymbols}${keySTR}`

    try {
        const res = await fetch(apiURL)
        const json = await res.json()
        if (json.Response) throw new Error(json.Message)
        return json
    } catch (error) {
        alertError(error)
    }
}

async function getPricesForWatched() {

    if (FILTER_STATE.watched.size === 0) return
    const isIgnoreMissing = true
    const arr = Array.from(FILTER_STATE.watched)
    const data = await getPrices(arr, isIgnoreMissing)
    return data
}


