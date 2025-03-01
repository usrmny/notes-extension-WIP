const main = document.querySelector('main')
function addTask(){
    const task = document.createElement("div")
    const checkbox = document.createElement("INPUT")
    const title = document.createElement("INPUT")
    checkbox.setAttribute("type", "checkbox")
    title.setAttribute("type", "text")

    document.body.insertAdjacentElement('afterbegin', task)
    task.appendChild(checkbox)
    task.appendChild(title)
    console.log("received")
}

function openMenu(){}