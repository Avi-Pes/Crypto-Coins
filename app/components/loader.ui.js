"use strict"

function toggleLoader(destination, remove = false) {

    if (remove) {
        destination?.querySelector('.loader')?.remove()
    } else {
        const loader = getLoader()
        destination?.append(loader)
    }

}

function getLoader() {
    const loader = document.createElement('h3')
    loader.classList.add("loader", "text-success")
    loader.innerText = "Loading..."
    return loader
}
