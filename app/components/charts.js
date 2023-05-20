"use strict"
// ['btc', 'eth', 'doge']
// { BTC: { USD: 26921.11, EUR: 24849.7, ILS: 98933.09 } DOGE: { USD: 0.07185, EUR: 0.06627, ILS: 0.2642 } ETH: { USD: 1803.97, EUR: 1665.58, ILS: 6583.44 } }

function renderChart() {
    // !! delete!!
    // FILTER_STATE.watched.add("btc")
    // FILTER_STATE.watched.add("eth")
    // FILTER_STATE.watched.add("doge")
    // !! delete!!

    DOM.controllersBox.innerHTML = ""
    DOM.contentBox.innerHTML = ""

    const h3 = document.createElement('h3')
    h3.classList.add('text-center')
    h3.innerText = "Live Prices In USD"
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
            //! some coins are not found in the API:
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
        // console.log("updated");
        if (FILTER_STATE.currentPage !== 2) {
            clearInterval(liveChart)
            // console.log("STOPPED");
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
