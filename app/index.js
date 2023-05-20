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
    currentPage: null,
}

init()







function init() {
    DOM.homeBtn.addEventListener('click', renderPageDashboard)
    DOM.chartsBtn.addEventListener('click', renderPageCharts)
    DOM.aboutBtn.addEventListener('click', renderPageAbout)

    renderPageDashboard()

}


function renderPageDashboard() {
    FILTER_STATE.currentPage = 1

    renderControllers()
    FILTER_STATE.allCoins ? renderCardsFromArr(FILTER_STATE.allCoins) : renderCoinsFromApi()
}
function renderPageCharts() {
    FILTER_STATE.currentPage = 2
    renderChart()
}
function renderPageAbout() {
    FILTER_STATE.currentPage = 3
    DOM.controllersBox.innerHTML = ""
    DOM.contentBox.innerHTML = "<h2>About</h2>"
}
