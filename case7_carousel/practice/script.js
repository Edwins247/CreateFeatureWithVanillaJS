;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  class Carousel {
    constructor(carouselElement) {
      this.carouselElement = carouselElement
      this.itemClassName = 'carousel_item'
      this.items = this.carouselElement.querySelectorAll('.carousel_item')

      this.totalItems = this.items.length
      this.current = 0
      // 버튼 눌렀을 때 이미지 슬라이더가 이벤트가 동작하지 않게 하기 위한 변수
      this.isMoving = false
    }

    initCarousel() {
      this.isMoving = false
      this.items[this.totalItems - 1].classList.add('prev')
      this.items[0].classList.add('active')
      this.items[1].classList.add('next')
    }

    // 버튼을 누를 때 자연스럽게 넘기도록 무조건적으로 넘어가지 않게 제안을 걸어둠
    disabledInteraction() {
      this.isMoving = true
      setTimeout(() => {
        this.isMoving = false
      }, 500)
    }

    // 현 carousel 아이템 기준으로 다음 & 이전 아이템에 대한 처리 필요함
    setEventListener() {
      this.prevButton = this.carouselElement.querySelector(
        '.carousel_button--prev'
      )
      this.nextButton = this.carouselElement.querySelector(
        '.carousel_button--next'
      )

      this.prevButton.addEventListener('click', () => {
        this.movePrev()
      })
      this.nextButton.addEventListener('click', () => {
        this.moveNext()
      })
    }

    moveCarouselTo() {
      if (this.isMoving) return
      this.disabledInteraction()
      let prev = this.current - 1
      let next = this.current + 1

      // carousel이 움직임에 따라 숫자를 처리하는 로직
      if (this.current === 0) {
        prev = this.totalItems - 1
      } else if (this.current === this.totalItems - 1) {
        next = 0
      }

      // carousel에 속성에 맞게 className을 붙이기
      for (let i = 0; i < this.totalItems; i++) {
        if (i == this.current) {
          this.items[i].className = this.itemClassName + ' active'
        } else if (i == prev) {
          this.items[i].className = this.itemClassName + ' prev'
        } else if (i == next) {
          this.items[i].className = this.itemClassName + ' next'
        } else {
          this.items[i].className = this.itemClassName 
        }
      }
    }

    moveNext() {
      if (this.isMoving) return
      // 처음으로 돌아가야 하므로 0이 됨
      if (this.current === this.totalItems - 1) {
        this.current = 0
      } else {
        // 아닌 경우 하나씩 늘림
        this.current++
      }
      this.moveCarouselTo()
    }

    movePrev() {
      if (this.isMoving) return
      if (this.current === 0) {
        this.current = this.totalItems - 1
      } else {
        this.current--
      }
      this.moveCarouselTo()
    }
  
  }


  document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = get('.carousel')
    const carousel = new Carousel(carouselElement)

    carousel.initCarousel()
    carousel.setEventListener()
  })

})()
