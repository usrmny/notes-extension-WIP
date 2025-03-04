const box = document.getElementById("list")
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

    box.appendChild(task)
    task.appendChild(checkbox)
    task.appendChild(title)
    task.appendChild(trash)

    task.setAttribute("draggable", true)
    task.setAttribute("class", "task")
    title.setAttribute("class", "titlecss unchecked")
    checkbox.setAttribute("class", "checkboxcss")
    trash.className = "fa-solid fa-trash-can"

    title.addEventListener('input', autoScroll)

    checkbox.addEventListener('click', checked => {
        if(title.classList.contains("unchecked")) {           
            title.setAttribute("class", "titlecss checked")
            box.insertAdjacentElement('beforeend', task)
        }
        else {
            title.setAttribute("class", "titlecss unchecked")
            box.insertAdjacentElement('afterbegin', task)
        }
    })
    
    trash.addEventListener('click', removeTask => {
        task.remove()
    })

    const allTasks = document.querySelectorAll(".task")
    allTasks.forEach(task => {
        task.addEventListener("dragstart", () => {
            setTimeout(() => task.classList.add("dragging"), 0)
        })
        task.addEventListener("dragend", () => {
            task.classList.remove("dragging")
        })
    })

    const initBox = (e) => {
        e.preventDefault()
        const draggingItem = box.querySelector(".dragging")
        const siblings = [...document.querySelectorAll(".task:not(.dragging)")]

        let nextSibling = siblings.find(sibling => {
            return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2
        })

        box.insertBefore(draggingItem, nextSibling)
    }

    box.addEventListener("dragover", initBox)
    box.addEventListener("dragenter", e => e.preventDefault())
}



function autoScroll(task){
   // const text = document.getElementsByClassName("titlecss")
    //if(t//lost
}





function openMenu(){}




//menu => more pages

//save info
//mini window for subtasks / notes about task / making the extension
//autoscroll


//checked task => not a priority
//keybind to add notes / move to next/previous note
