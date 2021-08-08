'use strict'

// Read existing todos from localStorage
const getSavedTodos = () => {
    const areThereTodos = localStorage.getItem('todos')

    try {
        return areThereTodos ? JSON.parse(areThereTodos) : []
    } catch (e) {
        return []
    }
}

//Add the array to the local storage
const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

//Application rendering function
const renderTodos = function (todos, filters) {
    const todoEl =  document.querySelector('#todos')
    const filteredTodos = todos.filter((todo) => {
        const searchTextMatch = todo.text.toLowerCase().includes(filters.searchText.toLowerCase()) //array com objectos que validem a condição
        const hideCompletedMatch = !filters.hideCompleted || !todo.completed
        return searchTextMatch && hideCompletedMatch //retorna um array com estas duas condições cumpridas
    })

    const incompleteTodos = filteredTodos.filter((todo) => !todo.completed)

    todoEl.innerHTML = ''
    todoEl.appendChild(generateSummaryDOM(incompleteTodos))

    if (filteredTodos.length > 0) {
        filteredTodos.forEach((todo) => {
            todoEl.appendChild(generateTodoDOM(todo))
        })
    } else {
        const messageEl = document.createElement('p')
        messageEl.classList.add('empty-message')
        messageEl.textContent = 'No to-dos to show'
        todoEl.appendChild(messageEl)
    }
}

//Modify the objects completed property
const toggleTodo = function (id) {
    const todo = todos.find ((todo) => todo.id === id)

    if(todo){
        todo.completed = !todo.completed
    }
}

//Remove todo by id
const removeTodo = function (id) {
    const index = todos.findIndex((todo) => todo.id === id)

    if(index > -1) {
        todos.splice(index,1)
    }
}


//Generate the DOM elements for an individual note
const generateTodoDOM = (todo) => {
    const todoText = document.createElement('span')
    const containerEl = document.createElement('div')
    const todoEl = document.createElement('label')
    const checkbox = document.createElement('input')
    const button = document.createElement('button')

    //Set up checkbox
    checkbox.setAttribute('type', 'checkbox')
    checkbox.checked = todo.completed
    containerEl.appendChild(checkbox)
    checkbox.addEventListener('change', (e) => {
        toggleTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos,filters)
    })

    //Set up the todo text
    todoText.textContent = todo.text
    containerEl.appendChild(todoText)

    //Setup container
    todoEl.classList.add('list-item')
    containerEl.classList.add('list-item__container')
    todoEl.appendChild(containerEl)

    //Setup the remove button
    button.textContent = 'remove'
    button.classList.add('button', 'button--text')
    todoEl.appendChild(button)
    button.addEventListener('click', (e) => {
        removeTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters)
    })

    return todoEl
}


//Get the list summary
const generateSummaryDOM = (incompleteTodos) => {
    const summary = document.createElement('h2')
    const plural = incompleteTodos.length === 1 ? '' : 's'
    summary.classList.add('list-title')

    summary.textContent = `You have ${incompleteTodos.length} todo${plural} left`
    
    return summary
}
