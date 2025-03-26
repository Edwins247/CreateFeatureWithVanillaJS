;(function () {
  'use strict'

  const get = (element) => document.querySelector(element)

  class Chart {
    // Chart에 대한 기본 생성 요소들
    constructor(parent = 'body', data = {}, { width, height, radius, colors }) {
      this.parent = get(parent)
      this.canvas = document.createElement('canvas')
      this.canvas.width = width
      this.canvas.height = height
      this.ctx = this.canvas.getContext('2d')
      this.legends = document.createElement('div')
      this.legends.classList.add('legends')
      this.parent.appendChild(this.canvas)
      this.parent.appendChild(this.legends)
      this.label = ''
      this.total = 0
      this.datas = Object.entries(data)
      this.radius = radius
      this.colors = colors
    }

    // data의 value의 합을 구함
    getTotal = () => {
      for (const [data, value] of this.datas) {
        this.total += value
      }
    }
    
    // legends를 그림
    drawlegends = () => {
      let index = 0
      for (const [instruments, value] of this.datas) {
        this.label +=
          "<span style='background-color:" +
          this.colors[index] +
          "'>" +
          instruments +
          '</span>'
        index++ 
      }
      this.legends.innerHTML = this.label
    }

    drawCanvas = (centerX, centerY, radius, startAngle, endAngle, color) => {
      this.ctx.beginPath()
      this.ctx.fillStyle = color
      this.ctx.moveTo(centerX, centerY)
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      this.ctx.closePath()
      this.ctx.fill()
    }

    // Chart를 그리는 함수(도넛차트인지 여부와 위치를 매개변수로 받음)
    drawChart = (donutChart, centerX, centerY, fontOption) => {
      let initial = 0
      let index = 0
      let fontSize = fontOption.font.split('px')[0] || 14

      for (const [data, value] of this.datas) {
        // angleValue로 나오는 값을 기준으로 캔버스에 그릴 것
        const angleValue = (2 * Math.PI * value) / this.total
        this.drawCanvas(
          centerX,
          centerY,
          this.radius,
          initial,
          initial + angleValue,
          this.colors[index]
        )

        this.ctx.moveTo(centerX, centerY)

        // 파이와 글자 위치를 정함, 삼각함수로 계산후 처리
        const triangleCenterX = Math.cos(initial + angleValue / 2)
        const triangleCenterY = Math.sin(initial + angleValue / 2)
        const labelX = centerX - fontSize + ((2 * this.radius) / 3) * triangleCenterX
        const labelY = centerY + (this.radius / 2) * triangleCenterY
        const text = Math.round((100 * value) / this.total) + '%'

        // 그리고 위에서 얻은 위치값과 각도를 바탕으로 그림을 그리고 반복함
        this.ctx.fillStyle = !!fontOption ? fontOption.color : 'black'
        this.ctx.font = !!fontOption ? fontOption.font : `${fontSize}px arial`
        this.ctx.fillText(text, labelX, labelY)

        initial += angleValue
        index++
      }
      // 도넛 차트가 들어왔다면, 그에 맞게 값을 수정함
      if (donutChart) {
        this.drawCanvas(
          centerX,
          centerY,
          this.radius / 3.5,
          0,
          Math.PI * 2,
          'white'
        )
      }
    }
  }

  // 차트를 그리기 전 기본적인 옵션 선언
  const data = {
    guitar: 30,
    bass: 20,
    drum: 25,
    piano: 18,
  }

  const option = {
    radius: 150,
    width: 700,
    height: 500,
    colors: ['#c15454', '#6fd971', '#687bd2', '#b971e0'],
  }

  const labelOption = {
    color: '#fff',
    font: "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  }

  // Chart 인스턴스를 만든 뒤, 캔버스에 그림
  const chart = new Chart('.canvas', data, option)
  const { width, height, radius } = option
  chart.getTotal()
  chart.drawlegends()
  chart.drawChart(false, width / 2 - 10 - radius, height / 2, labelOption)
  // 도넛 차트 만들기(그만큼 값을 수정함)
  chart.drawChart(true, width / 2 + 10 + radius, height / 2, labelOption)
})()
