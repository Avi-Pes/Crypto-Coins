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
    console.log("in")
    const destination = DOM.contentBox
    destination.innerHTML = ""
    const h4 = document.createElement('h4')
    h4.classList.add("lead", "text-center", "p-5")
    h4.innerText = text
    destination.append(h4)
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
    const card = document.createElement('article')
    card.classList.add("coin-card", "card", "h-100")
    card.dataset.coinId = coin.id

    const cardBody = document.createElement('div')
    cardBody.classList.add("card-body")
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add("card-title")
    cardTitle.innerText = coin.name || coin.id
    cardTitle.style.whiteSpace = "nowrap"
    cardTitle.style.textOverflow = "ellipsis"
    cardTitle.style.overflow = "hidden"
    const cardText = document.createElement('p')
    cardText.classList.add("card-text")
    cardText.innerText = `Symbol: ${coin.symbol}`
    const btnBox = document.createElement('div')
    btnBox.classList.add("d-flex", "gap-3")
    const infoBtn = document.createElement('button')
    infoBtn.classList.add("btn", "btn-primary")
    infoBtn.innerText = btnText
    btnBox.append(infoBtn)

    const infoBox = document.createElement('div')
    infoBox.classList.add("p-2", "mt-2", "border", "border-1", "border-dark", "d-none")
    infoBox.id = "infoBox"
    infoBox.dataset.isOpened = "false"

    infoBtn.addEventListener('click', (e) => {
        moreInfoHandler(card, btnBox, infoBox)

        e.stopPropagation()
    })
    card.addEventListener('click', cardClickHandler)
    if (FILTER_STATE.watched.has(card.dataset.coinId)) card.classList.add("watched-coin")



    cardBody.append(cardTitle, cardText, btnBox, infoBox)
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
    if (!Array.isArray(arr) || arr.length === 0 || !arr) {
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
        allCoins.length ? renderCardsFromArr(allCoins) : renderCoinsFromApi()

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

async function moreInfoHandler(card, loaderDest, infoDest) {
    const allowedDataAge = 120000 //milliseconds
    const id = card.dataset.coinId
    const infoBox = infoDest


    // if presented => close dataBox
    if (infoBox.dataset.isOpened === "true") {
        closeInfoBox()
    } else {
        toggleLoader(loaderDest)
        const coin = await getUpdatedCoinData(allowedDataAge)
        toggleLoader(loaderDest, true)
        renderInfoBox(coin, infoBox)
        openInfoBox()
    }


    async function getUpdatedCoinData(allowedDataAge) {
        const coinLS = JSON.parse(window.sessionStorage.getItem(id))
        const dataAge = Date.now() - coinLS?.time// in milliseconds
        if (coinLS && dataAge < allowedDataAge) {
            return coinLS
        } else {
            const coinData = await getCoin(id)
            coinData.time = Date.now()
            sessionStorage.setItem(id, JSON.stringify(coinData))
            return coinData
        }
    }
    function closeInfoBox() {
        infoBox.dataset.isOpened = "false"
        infoBox.classList.add("d-none")
        infoBox.classList.remove("d-block")
    }
    function openInfoBox() {
        infoBox.dataset.isOpened = "true"
        infoBox.classList.add("d-block")
        infoBox.classList.remove("d-none")
    }
}

function renderInfoBox(dataObj, infoBox) {
    console.log('=====>', 'dataObj:', dataObj);

    const imageUrl = dataObj?.image?.large
    const USD = dataObj.market_data?.current_price?.usd
    const EUR = dataObj.market_data?.current_price?.eur
    const ILS = dataObj.market_data?.current_price?.ils

    const wrapper = document.createElement('div')
    wrapper.classList.add('d-flex', "align-items-center", "justify-content-around")

    const left = document.createElement('div')
    const right = document.createElement('div')

    const img = document.createElement('img')
    // img.classList.add("img-fluid")
    img.style.maxHeight = "150px"
    img.src = imageUrl
    img.alt = "Image Missing"
    left.append(img)

    const ul = getPriceUL(USD, EUR, ILS)
    right.append(ul)

    wrapper.append(left, right)

    infoBox.innerHTML = ""
    infoBox.append(wrapper)




    function getPriceUL(usd, eur, ils) {
        const symUsd = "$"
        const symEur = "€"
        const symIls = "₪"

        const STRarr = []
        const usdSTR = `US Dollars: ${symUsd}${usd}`
        const eurSTR = `Euro: ${symEur}${eur}`
        const ilsSTR = `Israeli Shekels: ${ils}${symIls}`
        STRarr.push(usdSTR, eurSTR, ilsSTR)

        const ul = document.createElement('ul')
        ul.classList.add("list-group")


        const LIs = STRarr.map(str => {
            const li = document.createElement('li')
            li.classList.add("list-group-item", "list-group-item-info")
            li.innerText = str
            return li
        })

        ul.append(...LIs)
        return ul
    }

}

// TODO
function popModal() {



}

function getModalElement(titleText) {

    // <!-- modal experiment -->

    // <section class="container p-3">
    //     <div class="modal-overlay"></div>

    //     <div class="my-modal card p-3">
    //         <h5 class="ps-2">title</h5>
    //         <div id="card-body" class="p-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur, facilis!</div>
    //         <div id="modalButtonBox" class="d-flex justify-content-end gap-2">
    //             <button class="btn btn-lg btn-success">save</button>
    //             <button class="btn btn-lg btn-secondary">close</button>
    //         </div>
    //     </div>
    // </section>

    // <!-- modal experiment -->


    // overlay
    const overlay = document.createElement('section')
    overlay.classList.add("modal-overlay", "visually-hidden")

    // modal
    const card = document.createElement('div')
    card.classList.add("my-modal", "card", "p-3", "visually-hidden")

    const title = document.createElement('h5')
    title.classList.add("ps-2")
    title.innerText = titleText

    const cardBody = document.createElement('div')
    cardBody.id = "modal-body"
    cardBody.classList.add("p-2")
    // TODO add the watchList mechanism

    const btnBox = document.createElement('div')
    btnBox.id = "modalButtonBox"
    btnBox.classList.add("d-flex", "justify-content-end", "gap-2")
    const saveBtn = document.createElement('button')
    saveBtn.classList.add("btn", "btn-lg", "btn-success")
    saveBtn.innerText = "Save"
    const cancelBtn = document.createElement('button')
    cancelBtn.classList.add("btn", "btn-lg", "btn-success")
    cancelBtn.innerText = "Cancel"
    saveBtn.addEventListener('click', saveHandler)
    cancelBtn.addEventListener('click', cancelHandler)
    btnBox.append(saveBtn, cancelBtn)

    // TODO write handlers for buttons

}





