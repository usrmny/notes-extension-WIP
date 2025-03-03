const container = document.getElementById('sorted')
console.log(container.id)
const textarea = document.querySelectorAll('textarea') //like this?
textarea.forEach((e) => {
    e.addEventListener('input', autoScroll)
})


function addTask(){
    const task = document.createElement("div")
    const checkbox = document.createElement("INPUT")
    const title = document.createElement("textarea")
    const trash = document.createElement("i")
    checkbox.setAttribute("type", "checkbox")

    container.insertAdjacentElement('afterbegin', task)
    task.appendChild(checkbox)
    task.appendChild(title)
    task.appendChild(trash)

    task.setAttribute("draggable", true)
    title.setAttribute("class", "titlecss")
    title.setAttribute("id", "unchecked")
    checkbox.setAttribute("class", "checkboxcss")
    trash.className = "fa-solid fa-trash-can"

    title.addEventListener('input', autoScroll)

    checkbox.addEventListener('click', checked => {
        if(title.id == "unchecked") {           
            title.removeAttribute("unchecked")
            title.setAttribute("id", "checked")
        }
        else if(title.id == "checked") {
            title.removeAttribute("checked")
            title.setAttribute("id", "unchecked")
        }
        //insertBefore
    })
    
    trash.addEventListener('click', removeTask => {
        task.remove()
    })

    const allTasks = document.querySelectorAll(".titlecss")
    allTasks.forEach(task => {
        task.addEventListener("dragstart", () => {
            setTimeout(() => task.classList.add("dragging"), 0)
        })
        task.addEventListener("dragend", () => {
            task.classList.remove("dragging")
        })
    })
}



function autoScroll(task){
   // const text = document.getElementsByClassName("titlecss")
    //if(t//lost
}





function openMenu(){}




//move
//menu => more pages
//checked task moved down
//save info
//mini window for subtasks / notes about task / making the extension
//autoscroll
