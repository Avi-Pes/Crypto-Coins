"use strict"

async function renderCoinsFromApi() {

    const destination = DOM.contentBox
    toggleLoader(destination)

    try {
        const arrOfCoins = await getAllCoins()
        renderCardsFromArr(arrOfCoins)
        toggleLoader(destination, true)

    } catch (error) {
        const msg = `OOPS there is an Error!
        ${error}`
        alert(msg)
        renderEmptyContent()
        toggleLoader(destination, true)
    }
}

function renderEmptyContent(text = "No Coins To Show...") {
    const destination = DOM.contentBox
    destination.innerHTML = ""
    const h4 = document.createElement('h4')
    h4.classList.add("lead", "text-center")
    h4.innerText = text
    destination.append()
}

function getCardsBox(arrOfCoins) {
    if (!arrOfCoins || !Array.isArray(arrOfCoins)) throw new Error("array of coins expected")

    const row = document.createElement('div')
    const rowClasses = [
        "row",
        "row-cols-1",
        "row-cols-md-2",
        "row-cols-xl-3",
        "g-2",
        "p-2"
    ]
    row.classList.add(...rowClasses)

    const cols = arrOfCoins.map(coin => {
        const col = document.createElement('div')
        col.classList.add("col")
        const card = getCoinCard(coin)
        col.append(card)
        return col
    })
    row.append(...cols)

    return row
}

function getCoinCard(coin) {
    if (!coin || typeof coin !== 'object') throw new Error("coin object expected")

    const btnText = "More Info"
    // {id: '01coin', symbol: 'zoc', name: '01coin'}
    const card = document.createElement('div')
    card.classList.add("coin-card", "card")
    card.dataset.coinId = coin.id

    const cardBody = document.createElement('div')
    cardBody.classList.add("card-body")
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add("card-title")
    cardTitle.innerText = coin.name || coin.id
    const cardText = document.createElement('p')
    cardText.classList.add("card-text")
    cardText.innerText = `Symbol: ${coin.symbol}`
    const btnBox = document.createElement('div')
    btnBox.classList.add("d-flex", "gap-3")
    const infoBtn = document.createElement('button')
    infoBtn.classList.add("btn", "btn-primary")
    infoBtn.innerText = btnText
    btnBox.append(infoBtn)

    infoBtn.addEventListener('click', (e) => {
        renderCoinDataFromApi(card.dataset.coinId, btnBox)
        e.stopPropagation()
    })
    card.addEventListener('click', cardClickHandler)
    if (FILTER_STATE.watched.has(card.dataset.coinId)) card.classList.add("watched-coin")



    cardBody.append(cardTitle, cardText, btnBox)
    card.append(cardBody)

    return card
}

function cardClickHandler() {
    const id = this.dataset.coinId

    if (!FILTER_STATE.watched.has(id)) {
        if (FILTER_STATE.watched.size < 5) {
            FILTER_STATE.watched.add(id)
            this.classList.add("watched-coin")
        } else alert("only 5 coins can be watched")
    } else {
        FILTER_STATE.watched.delete(id)
        this.classList.remove("watched-coin")
    }
    renderControllers()
}
function renderCardsFromArr(arr) {
    if (!Array.isArray(arr) || !arr) {
        renderEmptyContent()
        console.error("array of coins expected")
        return
    }

    const destination = DOM.contentBox
    const cardsBox = getCardsBox(arr)
    destination.innerHTML = ""
    destination.append(cardsBox)
}

function renderWatchedList() {
    const box = DOM.controllersBox
    const watched = FILTER_STATE.watched
    const msgForEmptyList = "Click on a card to add a coin to graph"
    const labelText = "Watched Coins: "

    if (FILTER_STATE.watched.size === 0) {
        const h5 = document.createElement('h5')
        h5.innerText = msgForEmptyList
        box.append(h5)
        return
    }

    const wrapper = document.createElement('div')
    const wrapperClasses = [
        "d-flex",
        "gap-2",
        "justify-content-center",
        "align-items-center",
        "p-2",
        "border",
        "border-1",
        "rounded-1",
        "bg-white-subtle"
    ]
    wrapper.classList.add(...wrapperClasses)

    const label = document.createElement('span')
    label.classList.add("h5", "d-flex", "align-items-center")
    label.innerText = labelText

    const badges = []
    watched.forEach((id) => {
        const badge = document.createElement('span')
        badge.classList.add("badge", "bg-secondary", "p-2", "rounded-3")
        badge.innerText = id
        badge.style.cursor = "no-drop"
        badge.addEventListener('click', () => {
            watched.delete(id)
            document.querySelector(`.coin-card[data-coin-id=${id}]`).classList.remove("watched-coin")
            // renderWatchedList()
            renderControllers()
        })
        badges.push(badge)
    })

    wrapper.append(label, ...badges)
    box.append(wrapper)
}

function renderSearchBox() {
    const box = DOM.controllersBox
    const allCoins = FILTER_STATE.allCoins || []
    const labelText = "Search: "
    const placeholder = "e.g. Bitcoin / BTC "

    const wrapper = document.createElement('div')
    const wrapperClasses = [
        "d-flex",
        "gap-2",
        "justify-content-center",
        "align-items-center",
        "p-2",
        "border",
        "border-1",
        "rounded-1",
        "bg-white-subtle"
    ]
    wrapper.classList.add(...wrapperClasses)

    const label = document.createElement('span')
    label.classList.add("h5", "d-flex", "align-items-center")
    label.innerText = labelText

    const input = document.createElement('input')
    input.classList.add("w-50", "form-control")
    input.placeholder = placeholder
    if (FILTER_STATE.filteredParams.keyword) input.value = FILTER_STATE.filteredParams.keyword

    const searchBtn = document.createElement('btn')
    searchBtn.classList.add("btn", "btn-lg", "btn-primary", "shadow-sm")
    searchBtn.innerText = "Search"
    searchBtn.addEventListener('click', () => {
        const keyword = input.value
        if (keyword) executeSearch(keyword)
    })

    const showAllBtn = document.createElement('btn')
    showAllBtn.classList.add("btn", "btn-lg", "btn-outline-info", "shadow-sm")
    showAllBtn.innerText = "Show All"
    showAllBtn.addEventListener('click', () => {
        input.value = ""
        FILTER_STATE.filteredParams.amount = null
        FILTER_STATE.filteredParams.keyword = null
        renderCardsFromArr(allCoins)
    })

    const amount = document.createElement('div')
    amount.classList.add("text-center", "h6")
    amount.id = "searchAmount"
    const length = FILTER_STATE.filteredParams.amount
    if (length) amount.innerText = `Showing ${length} results`


    wrapper.append(label, input, searchBtn, showAllBtn)
    box.append(wrapper, amount)
}

function renderControllers() {
    DOM.controllersBox.innerHTML = ""
    renderSearchBox()
    renderWatchedList()
}

function executeSearch(keyword) {
    if (!keyword || typeof keyword !== 'string') return

    const filtered = FILTER_STATE.allCoins.filter(coin => {
        const objValues = Object.values(coin)
        return objValues.some(v => v.toLowerCase().includes(keyword.toLowerCase()))
    })
    FILTER_STATE.filteredParams.keyword = keyword
    FILTER_STATE.filteredParams.amount = filtered.length

    renderCardsFromArr(filtered)
    renderControllers()

}

async function renderCoinDataFromApi(id, loaderDestination) {
    toggleLoader(loaderDestination)

    try {
        const data = await getCoin(id)
        console.log('=====>', 'data:', data);
        toggleLoader(loaderDestination, true)

    } catch (error) {
        const msg = `OOPS there is an Error!
        ${error}`
        alert(msg)
        toggleLoader(loaderDestination, true)
    }
}
