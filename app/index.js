"use strict"

const DOM = {
    controllersBox: document.querySelector('#controllers'),
    contentBox: document.querySelector('#content'),
}
const FILTER_STATE = {
    allCoins: [],
    watched: new Set(),
    filteredParams: {
        keyword: null,
        amount: null
    },
}

init()







function init() {
    renderControllers()
    renderCoinsFromApi()

}
