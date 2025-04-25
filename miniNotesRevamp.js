//item resets when page refreshes => causes data to disappear


const box = document.getElementById("list")
let popup = false

let preventEvent = false
if(!preventEvent){
    document.body.addEventListener('keydown', (e) => {
        if (e.altKey && 'ws'.indexOf(e.key) !== -1) {
        e.preventDefault();
        }
        if(e.altKey)document.addEventListener("keydown", moveTask)
    });
}

function addTask(){
    if(!popup){
        const taskPopup = document.createElement("div")
        taskPopup.setAttribute("id", "taskPopup")
        taskPopup.innerHTML = `
            <textarea id="createTask" placeholder="Add a task..."></textarea>
            <textarea id="createTaskNote" placeholder="Add a note..."></textarea>
            <textarea id="createTaskSub" placeholder="Add a subtask..."></textarea>
            <div id="taskPopupFooter">
                <i class="fa-solid fa-arrow-left" onclick="cancelTask()"></i>
                <i class="fa-solid fa-square-check" onclick="saveTask()"></i>
            </div>
        `;
        document.body.appendChild(taskPopup)
        popup = true
    }
}

function cancelTask(){
    const taskPopup = document.getElementById("taskPopup")
    if(taskPopup) taskPopup.remove()
        popup = false
}

function cancelEdit(){
    const editPopup = document.getElementById("editPopup")
    if(editPopup) editPopup.remove()
    popup = false
}


function saveTask(){
    
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || []
    let item = existingTasks.length


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
            showExtra: false,
            item: item
        } 
    

        existingTasks.push(task)

        localStorage.setItem('tasks', JSON.stringify(existingTasks))
        document.getElementById("createTask").value = ''
        document.getElementById("createTaskNote").value = ''
        document.getElementById("createTaskSub").value = ''
    }
    
    taskPopup.remove()
    displayTasks()
    popup = false
}


//Buttons don't change appearance without '${task.checked ? 'checked' : ''}'???
function displayTasks(){

    const taskList = document.getElementById('list')
    taskList.innerHTML = ''

    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    if(tasks.length > 0){
        tasks.forEach(task => {
            const listItem = document.createElement("li") 
            listItem.setAttribute("id", "task")
            listItem.setAttribute("item-id", task.item)
            //listItem.setAttribute("draggable", true)
            listItem.innerHTML = `
                <input class="checkbox" type="checkbox" onchange="boxClicked(${task.id})" ${task.checked ? 'checked' : ''}/> 
                <div class="alignVertical">
                    <p id="taskText" class="unchecked" placeholder="Add a task...">${task.text} </p>
                </div>
                <i class="fa-solid fa-caret-down" onclick="showSubTasks(${task.id})"></i>
                `;
            listItem.querySelector("div").addEventListener("click", () => editTask(task.id)) //must do () => so its not called immediately!
            //so it can be removed with bulkDelete()
            //innerHTML causes events to not be added in a list to track all events. => can't remove (imagine as embedded to the element)


            if(task.showExtra){
                const div = listItem.querySelector('div');
                let isChecked = task.checked
                if(task.note !== "") {
                    const note = document.createElement("p")
                    note.innerHTML=`${task.note}`
                    note.setAttribute("id", "taskNote")
                    switch (isChecked){
                        case true: note.setAttribute("class", "checked")
                                    break;
                        default: note.setAttribute("class", "unchecked")
                    }
                    div.insertAdjacentElement("BeforeEnd", note)
                }
                if(task.subText !== "") {
                    const subTask = document.createElement("p")
                    subTask.innerHTML=`${task.subText}`
                    subTask.setAttribute("id", "subTask")
                    switch (isChecked){
                        case true: subTask.setAttribute("class", "checked")
                                    break;
                        default: subTask.setAttribute("class", "unchecked")
                    }
                    div.insertAdjacentElement("BeforeEnd", subTask)
                }
            }

            const text = listItem.querySelector('p')
            if(task.checked) text.setAttribute("class", "checked")
            else text.setAttribute("class", "unchecked")

            taskList.appendChild(listItem)
        })
    }
    popup = false;
}

function showSubTasks(taskId){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    const taskExpended = tasks.find(task => task.id == taskId)

        let updatedChecks = tasks.map(task => {
            if(task.id == taskId){
                return{
                    id: task.id, 
                    text: task.text,
                    note: task.note,
                    subText: task.subText,
                    checked: task.checked, 
                    showExtra: !taskExpended.showExtra,
                    item: task.item
                }
            }
            else return task
        })

    localStorage.setItem('tasks', JSON.stringify(updatedChecks))
    displayTasks()
}

function boxClicked(taskId){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    const taskChecked = tasks.find(task => task.id == taskId)

        let updatedChecks = tasks.map(task => {
            if(task.id == taskId){
                return{
                    id: task.id, 
                    text: task.text,
                    note: task.note,
                    subText: task.subText,
                    checked: !taskChecked.checked, 
                    showExtra: false,
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
    popup = false
}

function copyTask(taskId){
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    let item = tasks.length
    const taskToCopy = tasks.find(task => task.id == taskId)

    const task = {
        id: new Date().getTime(),
        text: taskToCopy.text,
        note: taskToCopy.note,
        subText: taskToCopy.subText,
        checked: taskToCopy.checked,
        showExtra: taskToCopy.showExtra,
        item: item
    } 

    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    document.getElementById("editPopup").remove()
    displayTasks()
    popup = false
}

function editTask(taskId){
    if(!popup){
        const tasks = JSON.parse(localStorage.getItem('tasks'))||[]
        const taskToEdit = tasks.find(task => task.id == taskId)
        const taskText = taskToEdit ? taskToEdit.text : ''
        const taskNote = taskToEdit ? taskToEdit.note : ''
        const taskTextSub = taskToEdit ? taskToEdit.subText : ''

        const editPopup = document.createElement("div")
        editPopup.setAttribute("id", "editPopup")
        editPopup.innerHTML = `
            <textarea id="editTask" placeholder="Add a task">${taskText}</textarea>
            <textarea id="editTaskNote" placeholder="Add note">${taskNote}</textarea>
            <textarea id="editTaskSub" placeholder="Add subtask">${taskTextSub}</textarea>
            <div id="editPopupFooter">
                <i class="fa-solid fa-arrow-left" onclick="cancelEdit()"></i>
                <i class="fa-solid fa-trash-can" onclick="removeTask(${taskId})"></i>
                <i class="fa-solid fa-clone" onclick="copyTask(${taskId})"></i>
                <i class="fa-solid fa-square-check" onclick="updateTask(${taskId})"></i>
            </div>
        `;
        document.body.appendChild(editPopup)
        popup = true
        //document.addEventListener('keydown', typingKeybindsEdit(taskId))
    }
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
                showExtra: task.showExtra,
                item: task.item
            }
        }
        else return task
    })

    localStorage.setItem('tasks', JSON.stringify(updatedTasks))

    editingPopup.remove()
    displayTasks()
}

//both only used for moveTask()
let count = 0
let index = 0

function moveTask(e){
    let tasks = [...document.querySelectorAll("#task")]

    if(e.altKey){
        e.preventDefault()

        if(count === 0){
            //Error can ooccur here => when this occurs, other error usually follows =>
                //solve other means this gets fixed?
            tasks[index].classList.add("hovering")
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
        }

        if(count === 1){
            switch(e.key){
                case "w":
                    if(index > 0){
                        tasks = [...document.querySelectorAll("#task")]
                        let prevSibling = tasks[index - 1]
                        box.insertBefore(tasks[index], prevSibling)
                        index--

                    }
                    break;
                case "s":
                    if(index + 1 < tasks.length){
                        tasks = [...document.querySelectorAll("#task")]
                        let nextSibling = tasks[index + 2]
                        box.insertBefore(tasks[index], nextSibling)
                        index++
                    }
                    break;
                case "ArrowRight":
                    count = 2
                    break;
            }
        }
        if(count === 2) savePosition()   
    }
    else{
        tasks.forEach(task => {
            task.classList.remove("hovering")
            task.classList.remove("dragging")
        })
        count = 0
        displayTasks()
        document.removeEventListener("keydown", moveTask)
    }
}


function savePosition(){

    let index = 0 //local !== global
    let tasksHtml = [...document.querySelectorAll("#task")]
    let tasksJson = JSON.parse(localStorage.getItem('tasks'))||[]
    //instead of filtering and replacing if not the same, couldn't we just replace the entire thing??? then just remove item? NVM, json != html

    //copying causes issues with this TOFIX NOW OVER HERE... winner? DONT FORGET TO FIX COLOURS
    //nvm copying => breaks when move up or down just once sometimes??? 
    //sometimes breaks, don't know why (wrong task gets copied over after moving)

    const updatedTasks = tasksJson.map(taskJson => {
        index++ // must be there (else wont always trigger)
        if(String(taskJson.item) !== tasksHtml[index - 1].getAttribute('item-id')){ 
            let wanted = tasksJson.find(task => String(task.item) === tasksHtml[index - 1].getAttribute('item-id'))

            return {
                id: wanted.id, 
                text: wanted.text, 
                note: wanted.note,
                subText: wanted.subText,
                checked: wanted.checked,
                showExtra: wanted.showExtra,
                item: index - 1 
            }
        }
        else return taskJson
    })
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    count = 0
    displayTasks()  
    popup = false
}

function bulkDelete(){
    popup = true //temp solution, since removing eventListener not working.
    preventEvent = true
    let allPara = document.querySelectorAll("#list > li")

    allPara.forEach(para => {
        let paraDiv = para.querySelector("div")
        paraDiv.removeEventListener("click", editTask)
        para.addEventListener("click", bulkDeleteSelected) //bulkDeleteSelected() => '()' calls it immediately
    })

    document.removeEventListener("keydown", moveTask)

    const footer = document.getElementById("footer")
    footer.innerHTML=`
    <i class="fa-solid fa-xmark" onclick="cancelBulk()"></i>
    <i class="fa-solid fa-check" onclick="submitBulk()"></i>
    `
}

function bulkDeleteSelected(){
    let elementClicked = this
    //ensure no other function occurs until cancelBulk() is called!!!
    //fix when click p (and only p (not div)) editTask popup occurs
    if(elementClicked.classList.contains("bulkSelected")) 
        elementClicked.classList.remove("bulkSelected")
    else elementClicked.classList.add("bulkSelected")
}

function submitBulk(){

    let index = 0 //local !== global
    let tasksHtml = [...document.querySelectorAll("#task")]
    let tasksJson = JSON.parse(localStorage.getItem('tasks'))||[]

    const updatedTasks = tasksJson.map(taskJson => {
        if(!tasksHtml[index++].classList.contains("bulkSelected")){
            return {
                id: taskJson.id, 
                text: taskJson.text, 
                note: taskJson.note,
                subText: taskJson.subText,
                checked: taskJson.checked,
                showExtra: taskJson.showExtra,
                item: index - 1 
            }
        }
    })
    const tasksFiltered = updatedTasks.filter(task => task != null)

    localStorage.setItem('tasks', JSON.stringify(tasksFiltered))

    cancelBulk()
}

function cancelBulk(){
    let allPara = document.querySelectorAll("#list > li")
    allPara.forEach(para => { 
        para.removeEventListener("click", bulkDeleteSelected)

        if(para.classList.contains("bulkSelected")) 
            para.classList.remove("bulkSelected")
    })

    document.body.addEventListener('keydown', (e) => {
        if (e.altKey && 'ws'.indexOf(e.key) !== -1) {
          e.preventDefault();
        }
        if(e.altKey)document.addEventListener("keydown", moveTask)
      });

    const footer = document.getElementById("footer")
    footer.innerHTML=`
    <i class="fa-solid fa-gear" onclick="settings()"></i>
    <i class="fa-solid fa-plus" onclick="addTask()"></i>
    <i class="fa-solid fa-trash-can-arrow-up" onclick="bulkDelete()"></i>
    `
    popup = false //temp solution
    displayTasks() //reinstates the edit event
}
//cancel button and enter button => revert eventlisteners

//make sure to block if any popup is open => same for others
function settings(){
    const deleteAllPopup = document.getElementById("deletePopup")
    const keybindsPopup = document.getElementById("keybindsPopup")
    const themePopup = document.getElementById("themePopup")

    if(deleteAllPopup !== null) deleteAllPopup.remove()
    else if(keybindsPopup !== null) keybindsPopup.remove()
    else if(themePopup !== null) themePopup.remove()

    if(!popup){
        const settingsPopup = document.createElement("ul")
        settingsPopup.setAttribute("id", "settingsPopup")
        settingsPopup.innerHTML = `
            <li id="theme" onclick="changeThemePopup()">Change Theme</li>
            <li id="keybinds" onclick="keybinds()">Keybinds</li>
            <li id="deleteAll" onclick="deletePopup()">Delete All</li>
            <br>
            <li id="closeSettings" onclick="closeSettings()">Close</li>
        `;
        document.body.appendChild(settingsPopup)
        popup = true
    }
}

function changeThemePopup(){
    const themePopup = document.createElement("div")
    themePopup.setAttribute("id", "themePopup")
    themePopup.innerHTML = `
        <div id="themePopupBtns">
            <button id="dayTheme" onclick="changeThemeJSON(this)">Day Theme</button>
            <button id="nightTheme" onclick="changeThemeJSON(this)">Night Theme</button>
        </div>
        <button id="closeTheme" onClick="settings()">Go Back</button>
    `;
    document.body.appendChild(themePopup)
    popup = true
}

function changeThemeJSON(e){
    let pref = JSON.parse(localStorage.getItem('theme'))

    if(e.id === "dayTheme") pref = {"theme":"day"}
    else if(e.id ==="nightTheme") pref = {"theme":"night"}

    localStorage.setItem('theme', JSON.stringify(pref))
    changeTheme()
}

function changeTheme(){
    let pref = JSON.parse(localStorage.getItem('theme'))
    if(pref == null) {
        pref = {"theme": "day"}
        localStorage.setItem('theme', JSON.stringify(pref))
    }
    if(pref.theme == "day") document.body.setAttribute("class","light");
    else if(pref.theme == "night") document.body.setAttribute("class","dark");
}

function keybinds(){
    const keybindsPopup = document.createElement("div")
    keybindsPopup.setAttribute("id", "keybindsPopup")
    keybindsPopup.innerHTML = `
        <ul>
            <li>1. <i>Alt + w</i> and <i>Alt + s</i> to hover over the task you wish to move</li>
            <li>2. <i>Alt + Enter</i> to select the task</li>
            <li>3. <b>After <i>Alt + Enter</i> :</b> <i>Alt + w</i> and <i>Alt + s</i> to move the selected task</li>
            <li>4. <b>After <i>Alt + Enter</i> :</b> <i>Alt + RightArrowKey</i> to insert the task in the new area.</li>
            <li>Note: Letting go of <i>Alt</i> and pressing anything on your keyboard will cancel the process of moving a task.</li>
        </ul>
        <button id="closeKeybinds" onClick="settings()">Go Back</button>
    `;
    document.body.appendChild(keybindsPopup)
    popup = true
}


function deletePopup(){
    const deletePopup = document.createElement("div")
    deletePopup.setAttribute("id", "deletePopup")
    deletePopup.innerHTML = `
            <h1>Are you sure?</h1>
            <div id="deleteBtns">
                <button id="cancelDeleteAll" onclick="settings()">Nevermind</button>
                <button id="deleteAll" onclick="deleteAll()">Yes</button>
            </div>
        `;
    document.body.appendChild(deletePopup)
    popup = true
}

function deleteAll(){
    localStorage.setItem('tasks', null)
    document.getElementById("settingsPopup").remove()
    document.getElementById("deletePopup").remove()
    popup = false
    item = 0;
    displayTasks()
}


function closeSettings(){
    const settingsPopup = document.getElementById("settingsPopup")
    if(settingsPopup !== null) settingsPopup.remove()
    popup = false
}


changeTheme()
displayTasks()






/*
document.addEventListener('keydown', typingKeybindsAdd)
function typingKeybindsEdit (e, taskId){
    console.log("popp edit")
    document.removeEventListener("keydown", moveTask)
    if(e.altKey){
        let keyBind = false
        console.log("hello")
        e.preventDefault()
        switch (e.key){
            case "1":
                cancelEdit()
                keybind = true
                break;
            case "2":
                removeTask(taskId)
                keyBind = true
                break;
            case "3":
                saveTask()
                keyBind = true
                break;      
        }

        if(keyBind){
            document.removeEventListener("keydown",typingKeybindsEdit)
            document.addEventListener("keydown", moveTask)
        }
    }
}

function typingKeybindsAdd (e){
    if(e.altKey){
        e.preventDefault()
        switch (e.key){
            case "1":
                cancelTask()
                document.removeEventListener("keydown",typingKeybindsAdd)
                break;
            case "2":
                saveTask()
                document.removeEventListener("keydown",typingKeybindsAdd)
                break;    
        }
    }
}
*/






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
