// variables
const todoInput = document.querySelector('#todo-input')
const addBtn = document.querySelector('#add-btn')
const todoList = document.querySelector('ul')


let todoArray = new Set()
let user;

// function to add new todo item
const addTodo = () => {
    if (todoArray.size != 5) {
        if (todoInput.value != '') {
            todoInput.parentElement.classList.remove('error')
            todoArray.add(todoInput.value)

            if (user) {
                let db = [...todoArray]
                let _db = (JSON.stringify(db))
                localStorage.setItem(user, _db)
                setTodo(todoArray)

            } else {
                setTodo(todoArray)
            }

        } else {
            todoInput.parentElement.classList.add('error')
        }

        todoInput.value = ''

    } else {
        alert('you have five things to do')
    }
}

// event handlers
addBtn.addEventListener('click', addTodo)

todoInput.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') addTodo()
})


todoList.addEventListener('click', (e) => {

    let target = e.target
    let item = target.parentElement.parentElement
    let itemID = item.id

    if (target.innerText === 'Edit') {
        editTodo(item, itemID)

    } else if (target.innerText === 'Save') {
        updateTodo(item, itemID)

    } else if (target.innerText === 'Delete') {
        let delItem = item.querySelector('p').innerText

        if (user) {
            todoArray.delete(delItem)
            let db = [...todoArray]
            let _db = (JSON.stringify(db))
            localStorage.setItem(user, _db)
            setTodo(todoArray)

        } else {
            todoArray.delete(delItem)
            setTodo(todoArray)
        }

    }
})

// text function to count todo items
const informText = () => {
    let infoMsg = document.querySelector('#info-msg')
    let listNo = todoList.querySelectorAll('li').length

    // *** my intentional use of ternary operator instead of if-else statements ***
    listNo < 1 ?
        infoMsg.innerText = 'Nothing to do'
        : listNo == 1 ?
            infoMsg.innerText = 'Just one thing to do!'
            : infoMsg.innerText = `You have ${listNo} things to do`
}

// set todo html
const setTodo = (arr) => {
    let htmlArr = '';

    for (el of arr) {
        let html =
            `<li id=${el}>
                <div class="todo">
                    <p>${el}</p>
                    <input type="text" class="hide"/>
                </div>
                <div class="btns">
                    <button> Edit </button>
                    <button class="save hide"> Save </button>
                    <button> Delete </button>
                </div>
            </li>`

        htmlArr += html
    }

    todoList.innerHTML = htmlArr
    informText()
}


// edit todo function
const editTodo = (el, id) => {
    let taskItem = el.querySelector('p')
    let newInput = el.querySelector('input[type=text]')
    let edBtn = el.querySelectorAll('button')[0]
    let saveBtn = el.querySelectorAll('button')[1]
    let delBtn = el.querySelectorAll('button')[2]

    if (taskItem.closest('li').id === id) {

        newInput.value = taskItem.innerText

        newInput.classList.remove('hide')
        saveBtn.classList.remove('hide')

        newInput.classList.add('edit-mode')
        taskItem.classList.add('hide')
        edBtn.classList.add('hide')
        delBtn.classList.add('hide')

        saveBtn.addEventListener('click', () => updateTodo(el, id))

        newInput.addEventListener('keypress', (e) => {
            if (e.key == 'Enter') updateTodo(el, id)
        })
    }
}


// update todo function
const updateTodo = (el, id) => {
    let taskItem = el.querySelector('p')
    let newInput = el.querySelector('input[type=text]')
    let edBtn = el.querySelectorAll('button')[0]
    let saveBtn = el.querySelectorAll('button')[1]
    let delBtn = el.querySelectorAll('button')[2]

    if (taskItem.closest('li').id === id && newInput.value !== '') {

        if (newInput.value !== taskItem.innerText) {
            if (user) {
                let newChild = createNode(newInput.value)
                let oldChild = taskItem.closest('li')

                todoList.replaceChild(newChild, oldChild)

                todoArray.delete(taskItem.innerText)
                todoArray.add(newInput.value)

                let db = [...todoArray]
                let _db = (JSON.stringify(db))
                localStorage.setItem(user, _db)

            } else {
                let newChild = createNode(newInput.value)
                let oldChild = taskItem.closest('li')

                todoList.replaceChild(newChild, oldChild)

                todoArray.delete(taskItem.innerText)
                todoArray.add(newInput.value)
            }

        } else {
            taskItem.innerText = newInput.value

        }

        newInput.classList.remove('edit-mode')
        taskItem.classList.remove('hide')
        edBtn.classList.remove('hide')
        delBtn.classList.remove('hide')

        newInput.classList.add('hide')
        edBtn.classList.add('edit')
        delBtn.classList.add('delete')
        saveBtn.classList.add('hide')
    }
}


const createNode = (val) => {
    let nodeChild = document.createElement('li')
    nodeChild.setAttribute('id', val)

    let html = `<div class="todo">
                <p>${val}</p>
                <input type="text" class="hide"/>
            </div>
            <div class="btns">
                <button> Edit </button>
                <button class="save hide"> Save </button>
                <button> Delete </button>
            </div>`

    nodeChild.innerHTML = html

    return nodeChild
}


// signer
const signIn = document.querySelector('.logo-wrap p')
const modal = document.querySelector('#modal')
const userNm = modal.querySelector('input')
const signBtn = modal.querySelector('button')
const disModal = modal.querySelector('span')


signIn.addEventListener('click', () => {
    modal.style.display = 'flex'
})

disModal.addEventListener('click', (e) => {
    modal.style.display = 'none'
    console.log(e.target)
})

modal.addEventListener('click', (e) => {
    e.target == modal ? modal.style.display = 'none' : null
})

signBtn.addEventListener('click', () => {
    user = userNm.value

    if (user == '') {
        userNm.classList.add('error')

    } else {
        userNm.classList.remove('error')
        signIn.innerText = user
        todoArray.clear()
        setTodo(todoArray)
        userNm.value = ''

        let db = [...todoArray]
        let _db = (JSON.stringify(db))
        let userData = localStorage.getItem(user)

        if (userData) {
            let _userData = JSON.parse(userData)
            todoArray = new Set(_userData)
            setTodo(todoArray)
            modal.style.display = 'none'
        } else {
            localStorage.setItem(user, _db)
            modal.style.display = 'none'
        }
    }
})