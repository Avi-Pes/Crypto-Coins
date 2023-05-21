"use strict"

function renderAbout() {
    DOM.controllersBox.innerHTML = "<h2>About Page</h2>"
    DOM.contentBox.innerHTML = ""
    // TODO
    // personal details
    // project description
    // my picture ?

    const wrapper = document.createElement('div')
    wrapper.classList.add('container')

    const about = getAboutContainer()
    wrapper.append(about)

    DOM.contentBox.append(wrapper)



}

function getAboutContainer() {
    // Create container div
    let container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.fontFamily = 'Arial, sans-serif';

    // Create title
    let title = document.createElement('h1');
    title.style.fontSize = '2em';
    title.style.marginBottom = '1em';
    title.textContent = 'About Me';

    // Create image
    let img = document.createElement('img');
    img.src = 'https://media.licdn.com/dms/image/C4E03AQEV4ZneNcD4Ag/profile-displayphoto-shrink_800_800/0/1612371337590?e=1690416000&v=beta&t=pMP8OHpRNq0zKLy90HbfwVfyZM5LupCemvocC6QXK8U';
    img.alt = "That's me";
    img.style.width = '30vw';
    img.style.height = 'auto';
    img.style.borderRadius = '50%';
    img.style.marginBottom = '1em';

    // Create info paragraph
    let info = document.createElement('p');
    info.style.maxWidth = '800px';
    info.style.textAlign = 'center';
    info.style.marginBottom = '2em';
    info.textContent = "Hi, I'm Avi Pesach, \n" + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et ex porta, porttitor leo in, lacinia sem. Etiam laoreet in.";

    // Create project title
    let projectTitle = document.createElement('h2');
    projectTitle.style.fontSize = '1.5em';
    projectTitle.style.marginBottom = '1em';
    projectTitle.textContent = 'My Project';

    // Create project paragraph
    let projectInfo = document.createElement('p');
    projectInfo.style.maxWidth = '800px';
    projectInfo.style.textAlign = 'center';
    projectInfo.textContent = "Integer eu elementum ipsum. Donec varius tellus ac purus luctus condimentum. Phasellus id condimentum nisi, ut mollis tellus. Nullam non eleifend ex. Sed consequat in lorem sit amet congue. Sed.";
    container.append(title, img, info, projectTitle, projectInfo)
    return container
}
