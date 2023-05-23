"use strict"

function renderChart() {
    const controllerMsg = "Live Prices In USD"


    DOM.controllersBox.innerHTML = ""
    DOM.contentBox.innerHTML = ""

    if (FILTER_STATE.watched.size === 0) {
        renderEmptyChartsPage()
        return
    }

    const h3 = document.createElement('h3')
    h3.classList.add('text-center')
    h3.innerText = controllerMsg
    DOM.controllersBox.append(h3)


    const wrapper = document.createElement('div')
    wrapper.classList.add("chart-box")

    const canvas = document.createElement('canvas')
    canvas.id = 'myChart'

    wrapper.append(canvas)
    DOM.contentBox.append(wrapper)

    renderLiveUpdatedChart()
}

async function renderLiveUpdatedChart() {
    const intervalsTime = 2000
    const coins = Array.from(FILTER_STATE.watched)
    const allData = getObjectInChartFormat(coins)
    const timeLabels = []

    await updateData()
    const chart = drawLineChart(timeLabels, Object.values(allData))

    const liveChart = setInterval(intervalFn, intervalsTime)


    function getObjectInChartFormat(arrOfCoinsNames) {
        const obj = {}
        arrOfCoinsNames.forEach(coin => {
            obj[coin] = {
                label: coin.toUpperCase(),
                data: [],
                borderColor: `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, 1)`,
                tension: 0.1,
                fill: false,
            }
        })
        return obj
    }

    async function updateData() {
        const newData = await getPricesForWatched()
        coins.forEach(coin => {
            // some coins doesn't exist in the API:
            if (!newData[coin.toUpperCase()]) return

            allData[coin].data.push(newData[coin.toUpperCase()].USD)
        })
        const date = new Date()
        const timeStamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        timeLabels.push(timeStamp)
    }

    function updateChart(chartInstance, newLabels, newDatasets) {
        chartInstance.data.labels = newLabels;
        chartInstance.data.datasets = newDatasets;
        chartInstance.update();
    }

    async function intervalFn() {
        await updateData()
        updateChart(chart, timeLabels, Object.values(allData))
        if (FILTER_STATE.currentPage !== 2) {
            clearInterval(liveChart)
        }
    }
}

function drawLineChart(X_LABELS, dataObjs) {

    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: X_LABELS,
            datasets: dataObjs
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            transitions: {
                show: {
                    animations: {
                        x: {
                            from: 0
                        },
                        y: {
                            from: 0
                        }
                    }
                },
                hide: {
                    animations: {
                        x: {
                            to: 0
                        },
                        y: {
                            to: 0
                        }
                    }
                }
            },
            responsive: true,
        }
    });

    return chart
}

function renderEmptyChartsPage() {
    const msg = "To watch live changes in coin prices: \n first head to 'Home' and select some coins"

    DOM.controllersBox.innerHTML = ""
    DOM.contentBox.innerHTML = ""

    const h5 = document.createElement('h5')
    h5.classList.add('text-center')
    h5.innerText = msg
    DOM.controllersBox.append(h5)
}
