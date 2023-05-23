"use strict"

function toggleLoader(destination, remove = false) {

    if (remove) {
        destination?.querySelector('.loader')?.remove()
    } else {
        const loader = getBsLoader()
        destination?.append(loader)
    }

}

function getBsLoader() {

    const wrapper = document.createElement('div')
    wrapper.classList.add('d-flex', 'justify-content-center')
    const loader = document.createElement('div')
    loader.classList.add('loader', 'spinner-border', 'text-info')
    loader.role = 'status'
    const span = document.createElement('span')
    span.classList.add('visually-hidden')
    span.innerText = "Loading..."

    loader.append(span)
    wrapper.append(loader)

    return wrapper


}
