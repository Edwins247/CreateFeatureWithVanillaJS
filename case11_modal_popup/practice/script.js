;(function () {
  'use strict'
  const get = (target) => {
    return document.querySelector(target)
  }

  const $button = get('.modal_open_button')
  const $modal = get('.modal')
  const $body = get('body')
  const $modalCancelButton = get('.modal_button.cancel')
  const $modalConfirmButton = get('.modal_button.confirm')

  const toggleModal = () => {
    // 모달 띄우기 버튼을 누르면 modal을 보여주고 스크롤을 막음
    $modal.classList.toggle('show')
    $body.classList.toggle('scroll_lock')
  }

  $button.addEventListener('click', () => {
    toggleModal()
  })


  // 버튼을 누르면 마찬가지로 toggle로 처리가 되서 class가 처리됨
  // 로직이 들어갈 수 있기 떄문에 버튼을 구분
  $modalConfirmButton.addEventListener('click', () => {
    toggleModal()
  })


  $modalCancelButton.addEventListener('click', () => {
    toggleModal()
  })

  // 모달 밖 배경 클릭시 모달이 toggle처리되게함(모달이 꺼짐)
  window.addEventListener('click', (e) => {
    // 바깥 배경을 클릭해도 뜨도록
    if (e.target === $modal) {
      toggleModal()
    }
  })

})()
