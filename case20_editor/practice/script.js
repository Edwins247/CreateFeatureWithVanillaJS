;(function () {
  'use strict'

  // 글쓰기 에디터를 위한 다양한 버튼을 위한 데이터들(효과를 주기 위해)
  const commands = [
    {
      cmd: 'backColor',
      val: 'blue',
      label: '배경 컬러',
    },
    {
      cmd: 'bold',
      label: '굵기',
    },
    {
      cmd: 'justifyCenter',
      label: '가운데 정렬',
    },
    {
      cmd: 'justifyFull',
      label: '양쪽 정렬',
    },
    {
      cmd: 'justifyLeft',
      label: '좌측 정렬',
    },
    {
      cmd: 'justifyRight',
      label: '우측 정렬',
    },
    {
      cmd: 'underline',
      label: '밑줄',
    }
  ]

  // 배열 객체를 객체화해서 doCommand에 적절하게 이벤트 처리를 함
  const commandObject = {}

  const get = (target) => {
    return document.querySelector(target)
  }

  // command를 적용해서 처리함
  const doCommand = (cmdKey) => {
    const cmd = commandObject[cmdKey]
    const val = cmd.val ? prompt('값을 입력해주세요', cmd.val) : ''
    document.execCommand(cmd.cmd, false, val)
  }

  const onClickShowEditorButton = () => {
    // Editor로 내용을 옮김
    $editorEdit.innerHTML = $editorHTML.innerHTML
    $editorEdit.classList.toggle('show')
    $editorHTML.classList.toggle('show')
  }

  const onClickShowHTMLButton = () => {
    // HTML로 보여주게 옮기면 됨
    $editorHTML.innerText = $editorEdit.innerHTML
    $editorEdit.classList.toggle('show')
    $editorHTML.classList.toggle('show')
  }

  const $editorButtons = get('.editor_buttons')
  // 에디터 모드 & HTML 보기를 위해 DOM과 내부 요소 가져옴
  const $showEditorButton = get('.show_editor_button')
  const $showHTMLButton = get('.show_html_button')
  const $editorEdit = get('.editor.edit')
  const $editorHTML = get('.editor.html')

  const init = () => {
    // 에디터 버튼을 추가함
    commands.map((command) => {
      commandObject[command.cmd] = command
      const element = document.createElement('button')
      element.innerText = command.label
      element.addEventListener('click', (e) => {
        e.preventDefault()
        doCommand(command.cmd)
      })
      $editorButtons.appendChild(element)
    })
  }

  $showEditorButton.addEventListener('click', onClickShowEditorButton)
  $showHTMLButton.addEventListener('click', onClickShowHTMLButton)

  init()
})()
