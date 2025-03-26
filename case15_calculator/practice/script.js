;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const getAll = (target) => {
    return document.querySelectorAll(target)
  }

  class Calculator {
    constructor(element) {
      this.element = element
      this.currentValue = ''
      this.prevValue = ''
      this.operation = null
    }

    // element 빼고 모두 초기화
    reset() {
      this.currentValue = ''
      this.prevValue = ''
      this.resetOperation()
    }

    
    clear() {
      // 현재 값이 존재하는 경우
      if (this.currentValue) {
        this.currentValue = ''
        return
      }

      // 연산자를 선택한 경우
      if (this.operation) {
        this.resetOperation()
        this.currentValue = this.prevValue
        return
      }

      // 이전 값이 있는 경우
      if (this.prevValue) {
        this.prevValue = ''
      }
    }

    // 숫자를 추가해주는 메소드
    appendNumber(number) {
      // .처리를 한 번만 입력하게 처리함(.도 number 클래스임)
      if (number === '.' && this.currentValue.includes('.')) return
      // 숫자가 입력대로 붙이는 계산기대로 표현하기 위해 string으로 변환
      this.currentValue = this.currentValue.toString() + number.toString()
    }

    // 연산자를 누르면 연산자를 지정해주는 메소드
    setOperation(operation) {
      this.operation = operation
      // 연산자 클릭시 currentValue가 prevValue가 되야함, 그래야 계산 가능
      this.prevValue = this.currentValue
      this.currentValue = ''

      const elements = Array.from(getAll('.operation'))
      const element = elements.filter((element) => 
        element.innerText.includes(operation)
      )[0]

      // 연산자 클릭시 선택됨을 나타나게 클래스 추가
      element.classList.add('active')
    }

    // 값을 업데이트 하는 메소드
    updateDisplay() {
      if (this.currentValue) {
        this.element.value = this.currentValue
        return
      }
      // 이전 값이 있다면 할당
      if (this.prevValue) {
        this.element.value = this.prevValue
        return
      }
      // 값이 없다면 0으로
      this.element.value = 0
    }

    // 값을 초기화하는 메소드
    resetOperation() {
      // 클래스 해제와 초기화를 다해야함, active한 것을 초기화함
      this.operation = null
      const elements = Array.from(getAll('.operation'))
      elements.forEach((element) => {
        element.classList.remove('active')
      })
    }

    // 계산하는 메소드
    compute() {
      let computation
      const prev = parseFloat(this.prevValue)
      const current = parseFloat(this.currentValue)
      // 숫자가 아니면 리턴함
      if (isNaN(prev) || isNaN(current)) return

      // 사칙 연산 진행
      switch (this.operation) {
        case '+':
          computation = prev + current
          break
        case '-':
          computation = prev - current
          break
        case '*':
          computation = prev * current
          break
        case '÷':
          computation = prev / current
          break
        default:
          return
      }
      // 계산값을 할당하고 보여주고 operation도 초기화
      this.currentValue = computation.toString()
      this.prevValue = ''
      this.resetOperation()
    }
  }

  // 버튼에 클릭 이벤트를 발생시키기 위해서 태그를 가져와 이벤트 등록
  const numberButtons = getAll('.cell_button.number')
  const operationButtons = getAll('.cell_button.operation')
  const computeButton = get('.cell_button.compute')
  const clearButton = get('.cell_button.clear')
  const allClearButton = get('.cell_button.all_clear')
  const display = get('.display')

  const calculator = new Calculator(display)

  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      // button의 innerText값을 숫자로 넘김
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    })
  })

  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.setOperation(button.innerText)
      calculator.updateDisplay()
    })
  })

  computeButton.addEventListener('click', () => {
    calculator.compute()
    calculator.updateDisplay()
  })

  clearButton.addEventListener('click', () => {
    calculator.clear()
    calculator.updateDisplay()
  })

  allClearButton.addEventListener('click', () => {
    calculator.reset()
    calculator.updateDisplay()
  })
})()
