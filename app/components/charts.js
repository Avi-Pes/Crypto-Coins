"use strict"
// ['btc', 'eth', 'doge']
// { BTC: { USD: 26921.11, EUR: 24849.7, ILS: 98933.09 } DOGE: { USD: 0.07185, EUR: 0.06627, ILS: 0.2642 } ETH: { USD: 1803.97, EUR: 1665.58, ILS: 6583.44 } }

function renderChart() {
    DOM.controllersBox.innerHTML = ""
    DOM.contentBox.innerHTML = ""

    const wrapper = document.createElement('div')
    wrapper.classList.add("chart-box")

    const canvas = document.createElement('canvas')
    canvas.id = 'myChart'

    wrapper.append(canvas)
    DOM.contentBox.append(wrapper)

    // drawDummyChart()
}


function drawDummyChart(params) {
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

function renderLineChart() {
    const ctx = document.getElementById('myChart')

    const labels = Utils.months({ count: 7 });
    const data = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const config = {
        type: 'line',
        data: data,
    };


}
