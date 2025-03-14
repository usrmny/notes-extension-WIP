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

let item = 0
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
            checked: false,
            item: item++
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
        listItem.setAttribute("id", "task")
        listItem.setAttribute("item-id", task.item)
        //listItem.setAttribute("draggable", true)
        listItem.innerHTML = `
            <input class="checkbox" type="checkbox" onchange="boxClicked(${task.id})" ${task.checked ? 'checked' : ''}/> 
            <p id="taskText" class="unchecked" onclick="editTask(${task.id})" placeholder="Add a task...">${task.text} </p>
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
            if(task.id == taskId){
                return{
                    id: task.id, 
                    text: task.text,
                    note: task.note,
                    subText: task.subText,
                    checked: !taskChecked.checked, 
                    item: task.item
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
                checked: task.checked,
                item: task.item
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
            count = 1
            tasks[index].classList.remove("hovering")
            tasks[index].classList.add("dragging")
            console.log("count = 1")
        }

        if(count === 1){
            switch(e.key){
                case "w":
                    if(index > 0){
                        let prevSibling = tasks[index - 1]
                        tasks = [...document.querySelectorAll("#task")]
                        box.insertBefore(tasks[index], prevSibling)
                        //prevSibling.insertAdjacentElement('beforebegin', tasks[index]) //THIS WORKS!!!!
                        console.log(tasks[index].getAttribute('item-id') + " " + prevSibling.getAttribute('item-id')) 
                        index--

                    }
                    break;
                    //CAN'T GO DOWN???
                case "s":
                    if(index < tasks.length){
                        let nextSibling = tasks[index + 1]
                        tasks = [...document.querySelectorAll("#task")]
                        //nextSibling.insertAdjacentElement('beforebegin', tasks[index])
                        box.insertBefore(tasks[index], nextSibling)
                        console.log(tasks[index].getAttribute('item-id') + " " + nextSibling.getAttribute('item-id'))
                        index++
                    }
                    break;
                case "ArrowRight":
                    count = 2
                    console.log("count = 2")
                    break;
            }
        }

        if(count === 2) savePosition()
            
    }
    else{
        //remove dragging/hovering should happen without user needed to press again...display tasks remove there?
        tasks.forEach(task => {
            task.classList.remove("hovering")
            task.classList.remove("dragging")
        })
    }
    
    //document.addEventListener("keydown")
}

//NOT WORKING
function savePosition(){
    //let i = 0
    let index = 0
    let tasksHtml = [...document.querySelectorAll("#task")]
    let tasksJson = JSON.parse(localStorage.getItem('tasks'))||[]
   // console.log(tasksHtml)
   // console.log(tasksJson)

    const updatedTasks = tasksJson.map(taskJson => {
       // console.log("taskJson.item" + taskJson.item)
       // console.log("taskHtml[index]" + index + ": " + tasksHtml[index].getAttribute('item-id'))

        //tasksJson.forEach(task => {
          //  let taskElement = document.querySelector(`#task[item-id='${task.item}']`);
           // console.log(taskElement)


            //task[i].getAttribute('item-id')
            //if(String(task.item) === tasksHtml[i].getAttribute('item-id')){
             //   console.log(String(task.item) + " : " + tasksHtml[i].getAttribute('item-id') + "   they can be compared")
        // }
       // })findTaskHtml(taskJson.item)



        //loses value in this if statement
        if(String(taskJson.item) !== tasksHtml[index++].getAttribute('item-id')){ 
            let wanted = tasksJson.find(task => String(task.item) === tasksHtml[index - 1].getAttribute('item-id'))
            console.log(wanted)
            taskJson = tasksJson.filter(task => String(task.item) === String(wanted.item)) 

            return {
                id: taskJson[0].id, 
                text: taskJson[0].text, 
                note: taskJson[0].note,
                subText: taskJson[0].subText,
                checked: taskJson[0].checked,
                item: index
            }
        }
        else return taskJson //this works
    })
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    count = 0
    displayTasks()  
}

/*
function findTaskHtml(itemId){
    let tasksHtml = [...document.querySelectorAll("#task")]
    let temp = tasksHtml.filter(task => task.getAttribute('item-id') === String(itemId))

    //console.log("found: " + temp.getAttribute('item-id'))
    return temp[0].getAttribute('item-id') 
}
*/

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
