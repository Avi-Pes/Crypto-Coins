"use strict"

function applyParallax() {
    window.addEventListener('scroll', (e) => {
        let scrollPositionY = window.scrollY

        document.body.style.backgroundPositionY = `${0.5 * scrollPositionY}px`

    })

}
