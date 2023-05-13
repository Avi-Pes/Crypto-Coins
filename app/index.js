"use strict"

const DOM = {
    homeBtn: document.querySelector('#homeBtn'),
    chartsBtn: document.querySelector('#chartsBtn'),
    aboutBtn: document.querySelector('#aboutBtn'),

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
    DOM.homeBtn.addEventListener('click', renderPageDashboard)
    DOM.chartsBtn.addEventListener('click', renderPageCharts)
    DOM.aboutBtn.addEventListener('click', renderPageAbout)

    renderPageDashboard()

}


function renderPageDashboard() {

    renderControllers()
    FILTER_STATE.allCoins ? renderCardsFromArr(FILTER_STATE.allCoins) : renderCoinsFromApi()
}
function renderPageCharts() {
    renderChart()
}
function renderPageAbout() {
    DOM.controllersBox.innerHTML = ""
    DOM.contentBox.innerHTML = "<h2>About</h2>"
}
