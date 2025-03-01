const main = document.querySelector('main')
function addTask(){
    const task = document.createElement("div")
    const checkbox = document.createElement("INPUT")
    const title = document.createElement("textarea")
    const trash = document.createElement("i")
    checkbox.setAttribute("type", "checkbox")
    trash.className = "fa-solid fa-trash-can"

    document.body.insertAdjacentElement('afterbegin', task)
    task.appendChild(checkbox)
    task.appendChild(title)
    task.appendChild(trash)

    title.setAttribute("class", "titlecss")
    checkbox.setAttribute("class", "checkboxcss")
    trash.setAttribute("class", "trashcss") //dissapeared!!!
    console.log(trash)

}

function openMenu(){}
