"use strict"

const DOM = {
    controllersBox: document.querySelector('#controllers'),
    contentBox: document.querySelector('#content'),
}
const FILTER_STATE = {
    allCoins: null,
    recentArrDrawn: null,
    watched: new Set(),
    filteredParams: {
        keyword: null,
        amount: null
    },
    additionalInfos: [],
}

init()







function init() {
    renderControllers()
    renderCoinsFromApi()

}
