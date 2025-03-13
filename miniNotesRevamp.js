const box = document.getElementById("list")
/*
document.body.addEventListener('keydown', (e) => {
    if (e.altKey && 'ws'.indexOf(e.key) !== -1) {
      e.preventDefault();
    }
  });
  */
document.addEventListener("keydown", keybinds)

function addTask(){
    const taskPopup = document.createElement("div")
    taskPopup.innerHTML = `
        <div id="taskPopup">
            <textarea id="createTask" placeholder="Add a task..."></textarea>
            <textarea id="createTaskNote" placeholder="Add a note..."></textarea>
            <textarea id="createTaskSub" placeholder="Add a subtask..."></textarea>
            <div id="taskPopupFooter">
                <i class="fa-solid fa-arrow-left" onclick="cancelTask()"></i>
                <i class="fa-solid fa-square-check" onclick="saveTask()"></i>
            </div>
        </div>
    `;
    document.body.appendChild(taskPopup)
}

function cancelTask(){
    const taskPopup = document.getElementById("taskPopup")

    if(taskPopup){
        taskPopup.remove()
    }
}

function cancelEdit(){
    const editPopup = document.getElementById("editPopup")

    if(editPopup){
        editPopup.remove()
    }
}

function saveTask(){
    const taskPopup = document.getElementById("taskPopup")
    const taskText = document.getElementById("createTask").value.trim()
    const taskNote = document.getElementById("createTaskNote").value.trim()
    const taskSubText = document.getElementById("createTaskSub").value.trim()

    if(taskText.trim() !== ''){
        const task = {
            id: new Date().getTime(),
            text: taskText,
            note: taskNote,
            subText: taskSubText,
            checked: false
        } 
    

        const existingTasks = JSON.parse(localStorage.getItem('tasks')) || []
        existingTasks.push(task)

        localStorage.setItem('tasks', JSON.stringify(existingTasks))
        document.getElementById("createTask").value = ''
        document.getElementById("createTaskNote").value = ''
        document.getElementById("createTaskSub").value = ''
    }
    
    taskPopup.remove()
    displayTasks()
}


//Buttons don't change appearance without '${task.checked ? 'checked' : ''}'???
function displayTasks(){

    const taskList = document.getElementById('list')
    taskList.innerHTML = ''

    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.forEach(task => {
        const listItem = document.createElement("li") 
        listItem.innerHTML = `
            <li id="task">
                <input class="checkbox" type="checkbox" onchange="boxClicked(${task.id})" ${task.checked ? 'checked' : ''}/> 
                <p id="taskText" class="unchecked" onclick="editTask(${task.id})" placeholder="Add a task...">${task.text} </p>
            </li>
            `;
        const text = listItem.querySelector('p')
        if(task.checked){
            text.setAttribute("class", "checked")
        }
        else{
            text.setAttribute("class", "unchecked")
        }

        taskList.appendChild(listItem)
    })
}

function boxClicked(taskId){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    const taskChecked = tasks.find(task => task.id == taskId)

        //was var...
        let updatedChecks = tasks.map(task => {
            if(task.id == taskId && taskChecked.checked == false){
                return{
                    id: task.id, 
                    text: task.text,
                    note: task.note,
                    subText: task.subText,
                    checked: true
                }
            }
            else if (task.id == taskId && taskChecked.checked == true){
                return{
                    id: task.id, 
                    text: task.text,
                    note: task.note,
                    subText: task.subText,
                    checked: false
                }
            }
            else return task
        })

    localStorage.setItem('tasks', JSON.stringify(updatedChecks))
    displayTasks()

}

function removeTask(taskId){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks = tasks.filter(task => task.id !== taskId)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    document.getElementById("editPopup").remove()
    displayTasks()
}

function editTask(taskId){
    const tasks = JSON.parse(localStorage.getItem('tasks'))||[]
    const taskToEdit = tasks.find(task => task.id == taskId)
    const taskText = taskToEdit ? taskToEdit.text : ''
    const taskNote = taskToEdit ? taskToEdit.note : ''
    const taskTextSub = taskToEdit ? taskToEdit.subText : ''

    const editPopup = document.createElement("div")
    editPopup.innerHTML = `
        <div id="editPopup">
            <textarea id="editTask" placeholder="Add a task">${taskText}</textarea>
            <textarea id="editTaskNote" placeholder="Add note">${taskNote}</textarea>
            <textarea id="editTaskSub" placeholder="Add subtask">${taskTextSub}</textarea>
            <div id="editPopupFooter">
                <i class="fa-solid fa-arrow-left" onclick="cancelEdit()"></i>
                <i class="fa-solid fa-trash-can" onclick="removeTask(${taskId})"></i>
                <i class="fa-solid fa-square-check" onclick="updateTask(${taskId})"></i>
            </div>
        </div>
    `;

    document.body.appendChild(editPopup)
}

function updateTask(taskId){
    const editingPopup = document.getElementById("editPopup")
    let tasks = JSON.parse(localStorage.getItem('tasks'))||[]
    
    const updatedTasks = tasks.map(task => {
        if(task.id == taskId){
            return{
                id: task.id, 
                text: document.getElementById("editTask").value,
                note: document.getElementById("editTaskNote").value,
                subText: document.getElementById("editTaskSub").value,
                checked: task.checked
            }
        }
        else return task
    })

    localStorage.setItem('tasks', JSON.stringify(updatedTasks))

    editingPopup.remove()
    displayTasks()
}

let count = 0
let index = 0

function keybinds(e){

    let tasks = [...document.querySelectorAll("#task")]
    console.log(box.children)
    console.log(box.childElementCount)

    if(e.altKey){
        e.preventDefault()
        tasks[index].classList.add("hovering")

        if(count === 0){
            switch(e.key){
                case "w":
                    if(!(tasks[0].classList.contains("hovering"))){
                        tasks[index].classList.remove("hovering")
                        tasks[--index].classList.add("hovering")
                    }
                    break;
                case "s":
                    if(!(tasks[tasks.length-1].classList.contains("hovering"))){
                        tasks[index].classList.remove("hovering")
                        tasks[++index].classList.add("hovering")
                    }
                    break;
            }
        }

        if(e.key === "Enter" && (tasks[index].classList.contains("hovering"))){
            count++
            tasks[index].classList.remove("hovering")
            tasks[index].classList.add("dragging")
        }

        if(count === 1){
            switch(e.key){
                case "w":
                    if(index > 0){
                        const prevSibling = tasks[index - 1]
                        tasks = [...document.querySelectorAll("#task")]
                        if (box.contains(prevSibling)) {
                            console.log("")
                            console.log(box)
                            console.log(prevSibling)
                            console.log(tasks[index])
                            console.log("...haha") //???? THIS APPEARS YET ERROR OCCURS ????
                            //box.insertBefore(tasks[index], prevSibling)
                            prevSibling.insertAdjacentElement('beforebegin', tasks[index]) //THIS WORKS!!!! 

                        } 
                        //tasks[index].insertAdjacentHTML("beforebegin", prevSibling) //even worse
                        index--
                        //tasks = [...document.querySelectorAll("#task")]
                    }
                    break
                case "s":
                    if(index < tasks.length){
                        var nextSibling = tasks[index + 1]
                        tasks = [...document.querySelectorAll("#task")]
                        box.insertBefore(tasks[index], tasks[index])
                        index++
                       // tasks = [...document.querySelectorAll("#task")]
                    }
                    break;
            }
        }
            
    }
    else{
        tasks.forEach(task => {
            task.classList.remove("hovering")
            task.classList.remove("dragging")
        })
        count = 0
        index = 0 // can remove
    }
    
    //document.addEventListener("keydown")
}

function openMenu(){}

displayTasks()





//insertBefore keeps throwing an error saying nextSibling is not a child node of box...
//may come back to this some day... will replace with arrow keybinds for now.
/*
function draggingTask(e){
    e.classList.add("dragging")
    

    e.addEventListener("dragend", () => {
        e.classList.remove("dragging")
    })

    const initBox = (e) => {
        e.preventDefault()
        const draggingItem = box.querySelector(".dragging")
        const siblings = [...document.querySelectorAll("#task:not(.dragging)")]

        let nextSibling = siblings.find(sibling => {
            return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2
        })

        let newOrder = [...document.querySelectorAll("#task")]
        let tasks = JSON.parse(localStorage.getItem('tasks'))||[]
        const updatedTasks = tasks.map(task => {
             return{
                    id: newOrder.indexOf(task.id),
                    text: task.text,
                    note: task.note,
                    subText: task.subText,
                    checked: task.checked
            }
        })
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        box.insertBefore(draggingItem, nextSibling);

    }

    box.addEventListener("dragover", initBox)
    box.addEventListener("dragenter", e => e.preventDefault())
}
*/
