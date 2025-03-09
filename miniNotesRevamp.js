const box = document.getElementById("list")

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
            subText: taskSubText
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
    taskList.innerHTML = ''

    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.forEach(task => {
        task = document.createElement("li")
        task.innerHTML = `
        <li id="task">
            <input class="checkbox" type="checkbox" onclick="checkedTask()"/> 
            <p id="taskText" placeholder="Add a task..." onclick="editTask(${task.id})">${task.id}</p>
        </li>
    `;
    taskList.appendChild(task)//undefined cuz no id given???
    })
}

function boxClicked(){}

function removeTask(taskId){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    tasks.filter(task => task.id !== taskId)
    localStorage.setItem('tasks', JSON.stringify(tasks))

    displayTasks()
}

function editTask(taskId){
    const editPopup = document.createElement("div")
    editPopup.innerHTML = `
        <div id="editPopup">
            <textarea id="createTask" placeholder="Add a task">${taskId.text}</textarea>
            <textarea id="createTaskNote" placeholder="Add note">${taskId.note}</textarea>
            <textarea id="createTaskSub" placeholder="Add subtask">${taskId.subText}</textarea>
            <div id="taskFooter">
                <i class="fa-solid fa-arrow-left" onclick="cancelTask()"></i>
                <i class="fa-regular fa-square-check" onclick="updateTask(${task.id})">Done</i>
            </div>
        </div>
    `;

    document.body.appendChild(editPopup)

}

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

    /*
    task.innerHTML = `
        <div id="task">
            <p id="taskText" placeholder="Add a task..."></p>
            <p id="taskNote" placeholder="Add note"></p>
            <p id="taskSubText" placeholder="Add subtask"></p>
            <div id="taskFooter">
                <i class="fa-solid fa-trash-can" onclick="removeTask(${task.id})">Delete</i>
                <i class="fa-solid fa-pen-to-square" id="editBtn" onclick="editTask(${task.id})">Edit</i>
                <i class="fa-regular fa-square-check" onclick="saveTask(${task.id})">Done</i>
            </div>
        </div>
    `;
    */
