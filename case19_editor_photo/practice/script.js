;(function () {
  'use strict'

  const get = (element) => document.querySelector(element)

  // 이미지 에디터를 위한 기본 클래스 및 변수 선언
  class PhotoEditor {
    constructor() {
      this.container = get('main')
      this.canvas = get('.canvas')
      this.ctx = this.canvas.getContext('2d')
      this.width = 700
      this.height = 411
      this.minSize = 20
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.ctx.lineWidth = 4
      this.ctx.strokeStyle = '#ff0000'
      this.targetImage = get('.image_wrap')
      this.targetCanvas = document.createElement('canvas')
      this.targetCtx = this.targetCanvas.getContext('2d')
      this.targetWidth
      this.targetHeight
      this.sourceX
      this.sourceY
      this.sourceWidth
      this.img = new Image()
      this.btnFlip = get('.btn_flip')
      this.btnSepia = get('.btn_sepia')
      this.btnGray = get('.btn_gray')
      this.btnSave = get('.btn_save')
      this.fileDrag = get('.drag_area')
      this.fileInput = get('.drag_area input')
      this.fileImage = get('.fileImage')
      this.clickEvent()
      this.fileEvent()
      this.drawEvent()
    }

    clickEvent() {
      this.btnFlip.addEventListener('click', this.flipEvent.bind(this))
      this.btnSepia.addEventListener('click', this.sepiaEvent.bind(this))
      this.btnGray.addEventListener('click', this.grayEvent.bind(this))
      this.btnSave.addEventListener('click', this.download.bind(this))
    }

    flipEvent() {
      // 뒤집는 효과를 주고 그려줌
      this.targetCtx.translate(this.targetWidth, 0)
      this.targetCtx.scale(-1, 1)
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight        
      )
    }

    sepiaEvent() {
      // sepia 필터 적용
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight)
      this.targetCtx.filter = 'sepia(1)'
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight        
      )
    }

    grayEvent() {
      // gray 필터 적용
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight)
      this.targetCtx.filter = 'grayscale(1)'
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight        
      )
    }

    download() {
      // 다운로드 처리함
      const url = this.targetCanvas.toDataURL()
      const downloader = document.createElement('a')
      downloader.style.display = 'none'
      downloader.setAttribute('href', url)
      downloader.setAttribute('download', 'canvas.png')
      this.container.appendChild(downloader)
      downloader.click()
      setTimeout(() => {
        this.container.removeChild(downloader)
      }, 100);
    }

    // 파일을 올리면 그 이미지를 보여주는 메소드
    fileEvent() {
      this.fileInput.addEventListener('change', (event) => {
        const fileName = URL.createObjectURL(event.target.files[0])
        const img = new Image()
        img.addEventListener('load', (e) => {
          this.width = e.path[0].naturalWidth
          this.height = e.path[0].naturalHeight
        })
        this.fileImage.setAttribute('src', fileName)
        img.setAttribute('src', fileName)
      })
    }

    drawEvent() {
      const canvasX = this.canvas.getBoundingClientRect().left
      const canvasY = this.canvas.getBoundingClientRect().top
      let sX, sY, eX, eY;
      let drawStart = false

      // 마우스로 움직이고 누르는 것을 기준삼아서 좌표를 얻음, drawStart를 통해서 canvas에 그림
      this.canvas.addEventListener('mousedown', (e) => {
        sX = parseInt(e.clientX - canvasX, 10)
        sY = parseInt(e.clientY - canvasY, 10)
        drawStart = true
      })

      this.canvas.addEventListener('mousemove', (e) => {
        if (!drawStart) return
        eX = parseInt(e.clientX - canvasX, 10)
        eY = parseInt(e.clientY - canvasY, 10)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.strokeRect(sX, sY, eX - sX, eY - sY)

      })

      this.canvas.addEventListener('mouseup', () => {
        drawStart = false

        // minSize를 넘지 않으면 return
        if (Math.abs(eX - sX) < this.minSize || Math.abs(eY - sY) < this.minSize) {
          return
        }

        // 위 기준을 통과하면 시작점을 빼고 그려야함
        this.drawOutput(sX, sY, eX - sX, eY - sY)
      })
    }

    // 앞서 drawEvent로 계산한 위치에 대해서 해당하는 크기만큼 이미지를 그려줌
    drawOutput(x, y, width, height) {
      this.targetImage.innerHTML = ''
      if (Math.abs(width) <= Math.abs(height)) {
        this.targetHeight = this.height
        this.targetWidth = (this.targetHeight * width) / height
      } else {
        this.targetWidth = this.width
        this.targetHeight = (this.targetWidth * height) / width
      }
      this.targetCanvas.width = this.targetWidth
      this.targetCanvas.height = this.targetHeight

      this.img.addEventListener('load', () => {
        const buffer = this.img.width / this.width
        this.sourceX = x * buffer
        this.sourceY = y * buffer
        this.sourceWidth = width * buffer
        this.sourceHeight = height * buffer
        this.targetCtx.drawImage(
          this.img,
          this.sourceX,
          this.sourceY,
          this.sourceWidth,
          this.sourceHeight,
          0,
          0,
          this.targetWidth,
          this.targetHeight
        )
      })

      this.img.src = this.fileImage.getAttribute('src')
      this.targetImage.appendChild(this.targetCanvas)
    }
  }

  new PhotoEditor()
})()
