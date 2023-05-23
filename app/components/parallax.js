"use strict"

function applyParallax() {
    window.addEventListener('scroll', (e) => {
        let scrollPositionY = window.scrollY

        console.log('=====>', 'scroll:', scrollPositionY);
        console.log(
            document.body.style.backgroundPositionY = `${0.5 * scrollPositionY}px`
        );

    })

}
