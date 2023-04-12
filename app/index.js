"use strict"

const DOM = {
    controllersBox: document.querySelector('#controllers'),
    contentBox: document.querySelector('#content'),
}
const FILTER_STATE = {
    watched: new Set()
}

init()







function init() {
    renderWatchedCoins()
    renderCards()

}
