const box = document.getElementById("list")

function addTask(){
    const taskPopup = document.createElement("div")
    taskPopup.innerHTML = `
        <div id="taskPopup">
            <textarea id="createTask" placeholder="Add a task"></textarea>
            <textarea id="createTaskNote" placeholder="Add note"></textarea>
            <textarea id="createTaskSub" placeholder="Add subtask"></textarea>
            <div id="taskFooter">
                <i class="fa-solid fa-arrow-left" onclick="cancelTask()"></i>
                <i class="fa-regular fa-square-check" onclick="saveTask(${task.id})">Done</i>
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

function saveTask(){
    const taskPopup = document.getElementById("taskPopup")
    const taskText = document.getElementById("createTask").value.trim()
    const taskNoteText = document.getElementById("createTaskNote").value.trim()
    const taskSubText = document.getElementById("createTaskSub").value.trim()

    if(taskText.trim() !== ''){
        const task = {
            id: Date().getTime(),
            text: taskText,
            note: taskNoteText,
            subText: taskNoteText
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

function displayTasks(){

    const taskList = document.getElementById('list')
    taskList = ''

    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.forEach(task => {
        task.innerHTML = `
        <div id="taskPopup">
            <p id="task" placeholder="Add a task..."></p>
            <textarea id="taskNote" placeholder="Add note"></textarea>
            <textarea id="taskSub" placeholder="Add subtask"></textarea>
            <div id="taskFooter">
                <i class="fa-solid fa-trash-can" onclick="removeTask(${task.id})">Delete</i>
                <i class="fa-solid fa-pen-to-square" id="editBtn" onclick="editTask(${task.id})">Edit</i>
                <i class="fa-regular fa-square-check" onclick="saveTask(${task.id})">Done</i>
            </div>
        </div>
    `;
    taskList.appendChild(task)
    })
}

function boxClicked(){}

function removeTask(taskId){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.filter(task => task.id !== taskId)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    displayTasks()
}

function editTask(){}

function saveTask(){}

function openMenu(){}

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