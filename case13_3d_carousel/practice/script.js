;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const cellCount = 6
  let selectIndex = 0
  const prevButton = get('.prev_button')
  const nextButton = get('.next_button')
  const carousel = get('.carousel')

  const rotateCarousel = () => {
    // item에 정해진 css값과 반대로 angle을 줘야지 사진이 돌아가면서 보여짐(3d carousel이므로)
    const angle = (selectIndex / cellCount) * -360
    carousel.style.transform = `translateZ(-346px) rotateY(${angle}deg)`
  }

  prevButton.addEventListener('click', () => {
    selectIndex--
    rotateCarousel()
  })
  nextButton.addEventListener('click', () => {
    selectIndex++
    rotateCarousel()
  })

})()
