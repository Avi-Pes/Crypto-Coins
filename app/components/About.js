"use strict"

function renderAbout() {
    DOM.controllersBox.innerHTML = ""
    DOM.contentBox.innerHTML = ""

    const h2 = document.createElement('h2')
    h2.classList.add('text-center', 'text-decoration-underline')
    h2.innerText = "About:"

    const wrapper = document.createElement('div')
    wrapper.classList.add('container')

    const about = getAboutComponent()
    wrapper.append(about)

    DOM.controllersBox.append(h2)
    DOM.contentBox.append(wrapper)

}

function getAboutComponent() {
    const AboutMe = `Hi! I am Avi Pesach
    I am a starting Fullstack developer, currently studying at John Bryce School.
    I live in Israel, I like traveling abroad, watching movies and learn new things EVERY DAY!`
    const AboutProject = `This project is my first Single Page Application!
    i used some libraries like Bootstrap5 and APIs like CoinGecko and CryptoCompare.
    rendering several pages in a single all with Vanilla JavaScript is challenging and complex for a beginner,
    but it was fun and very educating! 
    Next step is TS and REACT :) `


    const container = document.createElement('div');
    container.classList.add('text-center', 'text-bg-dark', 'px-2', 'py-5', 'rounded-4')

    const row1 = document.createElement('div')
    row1.classList.add('d-flex', 'align-items-center')

    const col1 = document.createElement('div')
    col1.classList.add('col')
    const img = document.createElement('img');
    img.src = 'https://media.licdn.com/dms/image/C4E03AQEV4ZneNcD4Ag/profile-displayphoto-shrink_800_800/0/1612371337590?e=1690416000&v=beta&t=pMP8OHpRNq0zKLy90HbfwVfyZM5LupCemvocC6QXK8U';
    img.alt = "That's me";
    img.style.width = '25vw';
    img.style.borderRadius = '50%';
    img.style.border = '2px solid white'
    col1.append(img)
    const col2 = document.createElement('div')
    col2.classList.add('col')
    const info = document.createElement('p');
    info.innerText = AboutMe
    col2.append(info)
    row1.append(col1, col2)

    const projectTitle = document.createElement('h3');
    projectTitle.classList.add('text-decoration-underline', 'mt-5')
    projectTitle.innerText = 'CryptoPeak';
    const projectInfo = document.createElement('p');
    projectInfo.innerText = AboutProject
    container.append(row1, projectTitle, projectInfo)
    return container
}
