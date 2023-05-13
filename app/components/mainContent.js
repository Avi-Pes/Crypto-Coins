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
    card.dataset.coinSymbol = coin.symbol

    const cardBody = document.createElement('div')
    cardBody.classList.add("card-body")
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add("card-title")
    cardTitle.innerText = coin?.name || coin.id
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
    if (FILTER_STATE.watched.has(card.dataset.coinSymbol)) card.classList.add("watched-coin")



    cardBody.append(cardTitle, cardText, btnBox, infoBox)
    card.append(cardBody)

    return card
}

function cardClickHandler() {
    const sym = this.dataset.coinSymbol

    if (!FILTER_STATE.watched.has(sym)) {
        if (FILTER_STATE.watched.size < 5) {
            FILTER_STATE.watched.add(sym)
            this.classList.add("watched-coin")
        } else {
            // alert("only 5 coins can be watched")
            popModal("only 5 coins can be watched", sym)
        }
    } else {
        FILTER_STATE.watched.delete(sym)
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

    //!! FOR PRODUCTION 
    if (arr === FILTER_STATE.allCoins && arr.length > 1000) arr = arr.slice(900, 1000)
    //!! FOR PRODUCTION 

    const destination = DOM.contentBox
    destination.innerHTML = ""
    updateStateArr(arr)
    const cardsBox = getCardsBox(arr)
    destination.append(cardsBox)


    function updateStateArr(array) {
        FILTER_STATE.recentArrDrawn = array
    }
}

function renderWatchedList() {
    const box = DOM.controllersBox
    const watched = FILTER_STATE.watched
    const msgForEmptyList = "Click on a card to add a coin to graph"
    const labelText = "Watched Coins: "

    if (FILTER_STATE.watched.size === 0) {
        const h5 = document.createElement('h5')
        h5.innerText = msgForEmptyList
        h5.classList.add("text-center")
        box.append(h5)
        return
    }

    const wrapper = document.createElement('div')
    const wrapperClasses = [
        "d-flex",
        "flex-wrap",
        "gap-2",
        // "justify-content-center",
        "align-items-center",
        "p-2",
        "border",
        "border-1",
        "rounded-1",

    ]
    wrapper.classList.add(...wrapperClasses)

    const label = document.createElement('span')
    label.classList.add("h5")
    label.innerText = labelText

    const badges = []
    watched.forEach((sym) => {
        const badge = document.createElement('span')
        badge.classList.add("badge", "bg-secondary", "p-2", "rounded-3")
        badge.innerText = sym
        badge.style.cursor = "no-drop"
        badge.addEventListener('click', () => {
            watched.delete(sym)
            document.querySelector(`.coin-card[data-coin-symbol=${sym}]`)?.classList.remove("watched-coin")
            // renderWatchedList()
            renderControllers()
        })
        badges.push(badge)
    })

    const filterBtn = document.createElement('button')
    filterBtn.classList.add("btn", "btn-primary")
    filterBtn.innerText = "Filter"
    filterBtn.addEventListener('click', () => {
        if (watched.size === 0) return
        const arr = []
        const watchedArr = [...watched]
        watchedArr.forEach(sym => {
            const coin = FILTER_STATE.allCoins.find(c => c.symbol === sym)
            arr.push(coin)
        })
        renderCardsFromArr(arr)

    })

    wrapper.append(label, filterBtn, ...badges)
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

function popModal(titleText, coinSym) {
    const modal = getModalElement(titleText, coinSym)
    document.body.append(modal)

}

function getModalElement(titleText = "title", coinSym) {

    // overlay
    const overlay = document.createElement('section')
    overlay.classList.add("modal-overlay")

    // modal
    const modal = document.createElement('div')
    modal.classList.add("my-modal", "card", "p-3")

    const title = document.createElement('h5')
    title.classList.add("ps-2")
    title.innerText = titleText

    const cardBody = document.createElement('div')
    cardBody.id = "modal-body"
    cardBody.classList.add("p-2")
    // TODO add the watchList mechanism
    const watched = watchedCheckboxes()
    cardBody.append(watched)

    const btnBox = document.createElement('div')
    btnBox.id = "modalButtonBox"
    btnBox.classList.add("d-flex", "justify-content-end", "gap-2")
    const saveBtn = document.createElement('button')
    saveBtn.classList.add("btn", "btn-lg", "btn-success")
    saveBtn.innerText = "Save"
    const cancelBtn = document.createElement('button')
    cancelBtn.classList.add("btn", "btn-lg", "btn-secondary")
    cancelBtn.innerText = "Cancel"
    saveBtn.addEventListener('click', saveHandler)
    cancelBtn.addEventListener('click', cancelHandler)
    btnBox.append(saveBtn, cancelBtn)

    modal.append(title, cardBody, btnBox)
    overlay.append(modal)
    return overlay

    // TODO write handlers for buttons

    function cancelHandler() {
        modal.classList.add("visually-hidden")
        overlay.classList.add("visually-hidden")
        deleteModal()
    }
    function saveHandler() {
        const togglersNodeList = cardBody.querySelectorAll('.modal-toggler')
        const checked = []
        togglersNodeList.forEach(t => {
            if (t.checked) checked.push(t.dataset.coinSymbol)
        })
        if (checked.length > 5) return

        FILTER_STATE.watched.clear()
        checked.forEach(sym => {
            FILTER_STATE.watched.add(sym)
        })

        renderControllers()
        renderCardsFromArr(FILTER_STATE.recentArrDrawn)
        deleteModal()
    }



    function watchedCheckboxes() {
        const watchedSet = FILTER_STATE.watched
        const arr = [...watchedSet, coinSym]

        const togglersBox = document.createElement('div')

        const togglers = []
        arr.forEach((w, i) => {
            const toggler = (i !== 5) ? getBStoggler(w, true) : getBStoggler(w)
            togglers.push(toggler)
        })

        togglersBox.append(...togglers)

        return togglersBox
    }

    function getBStoggler(coinSym, isChecked = false) {
        const togglerId = `toggle_${coinSym}`
        const labelText = coinSym

        const div = document.createElement('div')
        div.classList.add("form-check", "form-switch")

        const toggle = document.createElement('input')
        toggle.classList.add("form-check-input", "modal-toggler")
        toggle.type = "checkbox"
        toggle.role = "switch"
        toggle.checked = isChecked ? true : false
        toggle.id = togglerId
        toggle.dataset.coinSymbol = coinSym

        const label = document.createElement('label')
        label.classList.add("form-check-label")
        label.for = togglerId
        label.innerText = labelText

        div.append(toggle, label)
        return div
    }

    function deleteModal() {
        const modalWrapper = document.querySelector('.modal-overlay')
        modalWrapper.remove()
    }
}





