;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const API_URL = 'http://localhost:3000/todos';
  // $을 붙인 이유는 단 하나의 변수로 구분하기 위함이고, 이를 El을 붙여서 구분할 수도 있음
  const $todos = get('.todos');
  // Post 요청을 위해 form과 input el을 가져옴
  const $form = get('.todo_form');
  const $todoInput = get('.todo_input');

  const createTodoElement = (item) => {
    const { id, content, completed } = item
    const $todoItem = document.createElement('div')
    const isChecked = completed ? 'checked' : ''
    $todoItem.classList.add('item')
    $todoItem.dataset.id = id
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
                ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `
    return $todoItem
  }

  const renderAllTodos = (todos) => {
    $todos.innerHTML = ''
    // todos로 받은걸 Element로 만들고 붙임
    todos.forEach((item) => {
      const todoElement = createTodoElement(item);
      $todos.appendChild(todoElement);
    })
  }

  const getTodos = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((todos) => renderAllTodos(todos))
      .catch((error) => console.error(error));
  }

  const addTodo = (e) => {
    e.preventDefault();
    const todo = {
      content: $todoInput.value,
      completed: false,
    }
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo),
    }).then(getTodos) // getTodos를 호출하면서 리스트를 다시 호출해 갱신
      .then(() => {
        // POST가 정상적으로 처리되면 input 값을 초기화하고 포커싱 시킴
        $todoInput.value = ''
        $todoInput.focus()  
      })
      .catch((error) => console.error(error))
  }

  const toggleTodo = (e) => {
    // todo checkbox만을 클릭시 이벤트를 처리하도록 함
    if (e.target.className !== 'todo_checkbox') return;
    // 클릭한 아이템 기준으로 가장 가까운 태그를 가져옴
    const $item = e.target.closest('.item');
    // 이를 통해 해당하는 data-id를 찾아서 몇 번째 체크박스인지 확인함
    const id = $item.dataset.id;
    
    // 체크가 됐는지 확인
    const completed = e.target.checked;

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'        
      },
      body: JSON.stringify({ completed }),
    })
      .then(getTodos)
      .catch((error) => console.error(error));

  }

  const changeEditMode = (e) => {
    // 수정을 위해 선택한 edit button중 가까운 item을 찾아 해당 요소들을 다 찾아옴
    const $item = e.target.closest('.item');
    const $label = $item.querySelector('label');
    const $editInput = $item.querySelector('input[type="text"]');
    const $contentButtons = $item.querySelector('.content_buttons');
    const $editButtons = $item.querySelector('.edit_buttons');
    const value = $editInput.value;

    if (e.target.className === 'todo_edit_button') {
      // edit button이 눌릴 때, input으로 입력하고 수정 확인, 취소 버튼이 나오게 처리함
      $label.style.display = 'none'
      $editInput.style.display = 'block'
      $contentButtons.style.display = 'none'
      $editButtons.style.display = 'block'
      // edit 상태이므로 focus를 줌(커서를 끝으로 보냄)
      $editInput.focus()
      $editInput.value = ''
      $editInput.value = value
    }

    if (e.target.className === 'todo_edit_cancel_button') {
      // edit에서 취소를 하면 원래대로 돌아가게 처리
      $label.style.display = 'block'
      $editInput.style.display = 'none'
      $contentButtons.style.display = 'block'
      $editButtons.style.display = 'none'
      // 만약 취소시, 기존에 쓰던 텍스트를 초기화 시킴
      $editInput.value = $label.innerText
    }
  }

  const editTodo = (e) => {
    if (e.target.className !== 'todo_edit_confirm_button') return;
    // confirm_button과 가까운 태그 찾아옴
    const $item = e.target.closest('.item');
    const id = $item.dataset.id;
    const editInput = $item.querySelector('input[type="text"]');
    const content = editInput.value;

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'        
      },
      body: JSON.stringify({ content }),
    })
      .then(getTodos)
      .catch((error) => console.error(error));
  }

  const removeTodo = (e) => {
    // remove button을 기준으로 가까운 item에 대해서 DELETE 처리를 진행
    if (e.target.className !== 'todo_remove_button') return;
    const $item = e.target.closest('.item');
    const id = $item.dataset.id;

    fetch(`${API_URL}/${id}`,{
      method: 'DELETE',
    }).then(getTodos).catch((error) => console.error(error));
  }

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
    })
    $form.addEventListener('submit', addTodo);
    $todos.addEventListener('click', toggleTodo);
    $todos.addEventListener('click', changeEditMode);
    $todos.addEventListener('click', editTodo);
    $todos.addEventListener('click', removeTodo);
  }
  init()
})()
