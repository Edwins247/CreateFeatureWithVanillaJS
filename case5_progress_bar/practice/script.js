;(function () {
  'use strict'

  let timerId

  const get = (target) => {
    return document.querySelector(target)
  }

  // throttle 선언, 일정한 주기마다 이벤트를 발생시킴
  const throttle = (callback, time) => {
    if (timerId) return
    timerId = setTimeout(() => {
      callback()
      timerId = undefined
    }, time)
  }

  const $progressBar = get('.progress-bar')

  const onScroll = () => {
    // scroll의 총 height를 구하고 보여지는 영역을 뺌
    const height = 
      document.documentElement.scrollHeight - 
      document.documentElement.clientHeight

    const scrollTop = document.documentElement.scrollTop

    // 전체 scroll하는 길이를 구함, 이를 progressbar의 width로 처리해서 progressbar 표현
    const width = (scrollTop / height) * 100
    $progressBar.style.width = width + '%'
  }

  // scroll 할 때마다 이벤트 발생
  // 100ms로 throttle을 줘서 프로그래스바 이벤트를 처리함(스크롤시, 100ms마다 이벤트 발생)
  window.addEventListener('scroll', () => throttle(onScroll, 100))
})()
