const container = document.getElementById("container")

function newTab(){ //creates a popup to insert info
    const popupContainer = document.createElement("div")
    popupContainer.innerHTML = `
        <div id="popupContainer">
            <h1>New Notes</h1>
            <textarea id="noteTitle" placeholder="Enter a title..."></textarea>
            <div id="btn-container">
                <button id="submitBtn" onclick="createNote()">Create Note</button>
                <button id="closeBtn" onclick="closePopup()">Close</button>
            </div>
        </div>
        `;
        document.body.appendChild(popupContainer)
}

function closePopup(){
    const popupContainer = document.getElementById("popupContainer")
    if(popupContainer){
        popupContainer.remove()
    }
}

function createNote(){ //creates the note with what was entered in the popup
    const popupContainer = document.getElementById('popupContainer')
    const noteTitle = document.getElementById('noteTitle').value //returns what was written
    if(noteTitle.trim() !== ''){
        const title = {
            id: new Date().getTime(),
            text: noteTitle
        }
        /*
        let blob = new Blob([miniNotes.html], {type: "text/html"})
        let link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'copy-' + index + '-notes.html'
        link.click()
        */

        const existingNotes = JSON.parse(localStorage.getItem('notes')) || []
        existingNotes.push(title)
        
        localStorage.setItem('notes', JSON.stringify(existingNotes))

        document.getElementById('noteTitle').value = ''
    }

    popupContainer.remove()
    displayNotes();
}

/*
let index = 0;
function newFile(){
    fetch('miniNotes.html')
        .then(res => console.log(res))
       // .then(htmlContent => {
       //     const blob = new Blob([htmlContent], {type: 'text/html'})
      //  })
        //if(index == 0) let tabs = []
        //const link = document.createElement('a')
       // link.href = URL.createObjectURL(blob)
        //link.download = 'copy-' + index + '-notes.html'
       // link.click()
}
*/
function displayNotes(){
    const notesList = document.getElementById('notes-list')
    notesList.innerHTML = ''

    const notes = JSON.parse(localStorage.getItem('notes')) || []

    notes.forEach(note => {
        const listItem = document.createElement('li')
        listItem.innerHTML = `
        <div id="noteBtns-container">
            <i class="fa-solid fa-pen-to-square" id="editBtn" onclick="editNote(${note.id})"></i>
            <i class="fa-solid fa-x"id="deleteBtn" onclick="deleteNote(${note.id})"></i>
        </div>
        <div id="title-container" onclick="openNotes()">
            <span class="title">${note.text}</span>
        </div>
        `;
        notesList.appendChild(listItem)
    });
}

function editNote(noteId){
    const notes = JSON.parse(localStorage.getItem('notes')) || []
    const noteToEdit = notes.find(note => note.id == noteId)
    const noteText = noteToEdit ? noteToEdit.text : ''
    const editingPopup = document.createElement("div")

    editingPopup.innerHTML = `
    <div id="editing-container" data-note-id="${noteId}"> 
        <h1>Edit Note</h1>
        <textarea id="note-text">${noteText}</textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="updateNote()">Done</button>
            <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
        </div>
    </div>
    `;

    document.body.appendChild(editingPopup)
}

function closeEditPopup(){
    const editingPopup = document.getElementById("editing-container")

    if(editingPopup){
        editingPopup.remove()
    }
}

function updateNote(){
    const noteTitle = document.getElementById('note-text').value.trim()
    const editingPopup = document.getElementById('editing-container')

    if(noteTitle !== ''){
        const noteId = editingPopup.getAttribute('data-note-id')
        let notes = JSON.parse(localStorage.getItem('notes')) || []

        const updatedNotes = notes.map(note => {
            if(note.id == noteId){
                return {id: note.id, text: noteTitle}
            }
            return note;
        })
        

        localStorage.setItem('notes', JSON.stringify(updatedNotes))
    }   

    editingPopup.remove()

    displayNotes()
}

function deleteNote(noteId){
    let notes = JSON.parse(localStorage.getItem('notes')) || []
    notes = notes.filter(note => note.id !== noteId)

    localStorage.setItem('notes', JSON.stringify(notes))
    displayNotes()
}

function openNotes(){
    
}

displayNotes()
