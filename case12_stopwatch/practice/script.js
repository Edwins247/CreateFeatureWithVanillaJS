;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  // 스탑워치 기능을 구현할 클래스
  class Stopwatch {
    constructor(element) {
      this.timer = element
      this.interval = null
      this.defaultTime = '00:00:00'
      this.startTime = 0
      this.elapsedTime = 0 // JS가 싱글스레드로 처리되므로 현재시간을 가져와 경과시간을 비교해서 처리함
    }

    addZero(number) {
      if (number < 10) {
        return '0' + number
      }
      if (number > 99) {
        // 99보다 크면 2자리수로 자름(millisecond는 세자리수라서)
        return number.toString().slice(0, -1)
      }
      return number
    }

    timeToString(time) {
      // getUTC를 활용해서 시간을 표현함
      const date = new Date(time)
      const minutes = date.getUTCMinutes()
      const seconds = date.getUTCSeconds()
      const millisecond = date.getUTCMilliseconds()
      return `${this.addZero(minutes)}:${this.addZero(seconds)}:${this.addZero(millisecond)}`
    }

    print(text) {
      this.timer.innerHTML = text
    }

    startTimer() {
      this.elapsedTime = Date.now() - this.startTime
      // 계산된 시간을 시간대 형식으로 변환하고 출력함
      const time = this.timeToString(this.elapsedTime)
      this.print(time)
    }

    start(){
      // 원활한 stop 처리를 위해 clear
      clearInterval(this.interval)
      this.startTime = Date.now() - this.elapsedTime
      this.interval = setInterval(this.startTimer.bind(this), 10) // window객체가 아닌 class에 제대로 바인딩
    }
    stop(){
      clearInterval(this.interval)
    }
    reset(){
      // timer 제외하고 모두 초기화
      clearInterval(this.interval)
      this.print(this.defaultTime)
      this.interval = null
      this.startTime = 0
      this.elapsedTime = 0
    }
  }

  const $startButton = get('.timer_button.start')
  const $stopButton = get('.timer_button.stop')
  const $resetButton = get('.timer_button.reset')
  const $timer = get('.timer')
  const stopwatch = new Stopwatch($timer)

  $startButton.addEventListener('click', () => {
    stopwatch.start()
  })

  $stopButton.addEventListener('click', () => {
    stopwatch.stop()
  })

  $resetButton.addEventListener('click', () => {
    stopwatch.reset()
  })

})()
