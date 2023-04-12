"use strict"

async function renderCards() {
    const destination = DOM.contentBox
    toggleLoader(destination)

    try {
        const arrOfCoins = await getAllCoins()
        const cards = getCardsBox(arrOfCoins)
        destination.innerHTML = ""
        destination.append(cards)
        toggleLoader(destination, true)

    } catch (error) {
        const msg = `OOPS there is an Error!
        ${error}`
        alert(msg)
        renderEmpty()
        toggleLoader(destination, true)
    }


    function renderEmpty(text = "No Coins To Show...") {
        destination.innerHTML = ""
        const h4 = document.createElement('h4')
        h4.classList.add("lead", "text-center")
        h4.innerText =
            destination.append()

    }

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

    const cardBody = document.createElement('div')
    cardBody.classList.add("card-body")
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add("card-title")
    cardTitle.innerText = coin.name || coin.id
    const cardText = document.createElement('p')
    cardText.classList.add("card-text")
    cardText.innerText = `Symbol: ${coin.symbol}`
    const btn = document.createElement('button')
    // btn.dataset.coinId = coin.id //improved:
    card.dataset.coinId = coin.id
    btn.classList.add("btn", "btn-primary")
    btn.innerText = btnText

    btn.addEventListener('click', () => {
        alert("id: " + card.dataset.coinId)
    })
    card.addEventListener('click', cardClickHandler)

    cardBody.append(cardTitle, cardText, btn)
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
    renderWatchedCoins()
}


function renderWatchedCoins() {
    const box = DOM.controllersBox
    const watched = FILTER_STATE.watched
    const msgForEmptyList = "Click on a card to add a coin to graph"
    const labelText = "Watched Coins: "

    if (FILTER_STATE.watched.size === 0) {
        const h5 = document.createElement('h5')
        h5.innerText = msgForEmptyList
        box.innerHTML = ""
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

    const label = document.createElement('div')
    label.classList.add("h5")
    label.innerText = labelText

    const badges = []
    watched.forEach((id) => {
        const badge = document.createElement('span')
        badge.classList.add("badge", "bg-secondary", "p-1", "rounded-3")
        badge.innerText = id
        badge.style.cursor = "no-drop"
        badge.addEventListener('click', () => {
            watched.delete(id)
            document.querySelector(`.coin-card[data-coin-id=${id}]`).classList.remove("watched-coin")
            renderWatchedCoins()
        })
        badges.push(badge)
    })
    console.log('=====>', 'badges:', badges);

    wrapper.append(label, ...badges)

    box.innerHTML = ""
    box.append(wrapper)

}
