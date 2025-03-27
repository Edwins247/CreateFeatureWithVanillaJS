;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)

  const $canvas = get('.canvas')
  const ctx = $canvas.getContext('2d')

  const $score = get('.score')
  const $highscore = get('.highscore')
  const $play = get('.js-play')

  const colorSet = {
    board:'rgb(20, 105, 38)',
    snakeHead: 'rgba(229, 65, 120, 0.929)',
    snakeBody: 'rgba(153, 206, 244, 0.498)',
    food: 'rgb(66, 187, 103)',
  }

  // 지렁이 게임에서 기본 옵선 초기화
  let start = 0
  let option = {
    highScore: localStorage.getItem('score') || 0,
    gameEnd: true,
    direction: 2,
    snake: [
      { x: 10, y: 10, direction: 2 },
      { x: 10, y: 20, direction: 2 },
      { x: 10, y: 20, direction: 2 },
    ],
    food: { x: 0, y: 0},
    score: 0,
  }

  const init = () => {
    // 방향키가 아니면 return
    document.addEventListener('keydown', (event) => {
      if (!/Arrow/gi.test(event.key)) {
        return
      }
      event.preventDefault()
      const direction = getDirection(event.key)
      if (!isDirectionCorrect(direction)) {
        return
      }
      option.direction = direction
    })

    $play.onclick = () => {
      if (option.gameEnd) {
        option = {
          highScore: localStorage.getItem('score') || 0,
          gameEnd: false,
          direction: 2,
          snake: [
            { x: 10, y: 10, direction: 2 },
            { x: 10, y: 20, direction: 2 },
            { x: 10, y: 30, direction: 2 },
          ],
          food: { x: 0, y: 0 },
          score: 0,
        }
        $score.innerHTML = `점수 : 0점`
        $highscore.innerHTML = `최고점수 : ${option.highScore}점`
        randomFood()
        // animation 효과를 주기 위해서 계속 함수를 반복하는데 있어서 유용함(setInterval보다 나음)
        window.requestAnimationFrame(play)
      }
    }
  }

  // board를 그리는 메소드
  const buildBoard = () => {
    ctx.fillStyle = colorSet.board
    ctx.fillRect(0, 0, 300, 300)
  }

  // 지렁이를 그리는 메소드
  const buildSnake = (ctx, x, y, head = false) => {
    ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody
    ctx.fillRect(x, y, 10, 10)
  }

  const buildFood = (ctx, x, y) => {
    ctx.beginPath()
    ctx.fillStyle = colorSet.food
    ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  const setSnake = () => {
    for (let i = option.snake.length - 1; i >= 0; --i) {
      // snake를 옵션을 통해서 그려서 처리함
      buildSnake(ctx, option.snake[i].x, option.snake[i].y, i === 0)
    }
  }

  const setHighScore = () => {
    const localScore = option.highScore * 1 || 0
    const finalScore = $score.textContent.match(/(\d+)/)[0] * 1
    if (localScore < finalScore) {
      alert(`최고기록 : ${finalScore}점`)
      localStorage.setItem('score', finalScore)
    }
  }

  const setDirection = (number, value) => {
    // y축, x축이 화면을 벗어나면 number를 더해서 위치의 value를 지정
    while (value < 0) {
      value += number
    }

    // 그게 아니면 그 나눈 값을 할당
    return value % number
  }

  const setBody = () => {
    const tail = option.snake[option.snake.length - 1]
    const direction = tail.direction
    let x = tail.x
    let y = tail.y
    switch (direction) {
      // down
      case 1:
        y = setDirection(300, y - 10)
        break
      // up
      case -1:
        y = setDirection(300, y + 10)
        break
      // left
      case -2:
        x = setDirection(300, x + 10)
        break
      // right
      case 2:
        x = setDirection(300, x - 10)
        break
      default:
        break
    }
    // 위의 움직인 방향대로 snake를 처리함
    option.snake.push(x, y, direction)
  }

  const getFood = () => {
    const snakeX = option.snake[0].x
    const snakeY = option.snake[0].y
    const foodX = option.food.x
    const foodY = option.food.y
    if (snakeX == foodX && snakeY == foodY) {
      option.score++
      $score.innerHTML = `점수 : ${option.score}점`
      setBody()
      randomFood()
    }
  }

  const randomFood = () => {
    let x = Math.floor(Math.random() * 25) * 10
    let y = Math.floor(Math.random() * 25) * 10
    while (option.snake.some((part) => part.x === x && part.y === y)) {
      // 지렁이가 움직이는 위치에 음식이 있다면 위치를 바꿔줌
      x = Math.floor(Math.random() * 25) * 10
      y = Math.floor(Math.random() * 25) * 10
    } 
    option.food = { x, y }
  }

  const playSnake = () => {
    let x = option.snake[0].x
    let y = option.snake[0].y
    switch (option.direction) {
      // down
      case 1:
        y = setDirection(300, y + 10)
        break
      // up
      case -1:
        y = setDirection(300, y - 10)
        break
      // left
      case -2:
        x = setDirection(300, x - 10)
        break
      // right
      case 2:
        x = setDirection(300, x + 10)
        break
    }
    const snake = [{ x, y, direction: option.direction }]
    const snakeLength = option.snake.length
    // snake option이 바뀐 것이 다시 그려짐
    for (let i = 1; i < snakeLength; ++i) {
      snake.push({ ...option.snake[i - 1] })
    }
    option.snake = snake
  }

  const getDirection = (key) => {
    // 키보드 조작함에 따라서 direction 값을 리턴해줌
    let direction = 0
    switch (key) {
      case 'ArrowDown':
        direction = 1
        break
      case 'ArrowUp':
        direction = -1
        break
      case 'ArrowLeft':
        direction = -2
        break
      case 'ArrowRight':
        direction = 2
        break
    }
    return direction
  }

  // 가는 방향의 역방향은 가지 못하므로 처리해주는 메소드(동시에 위-아래, 왼쪽-오른쪽으로 못 가므로)
  const isDirectionCorrect = (direction) => {
    return (
      option.direction === option.snake[0].direction &&
      option.direction !== -direction
    )
  }

  const isGameOver = () => {
    const head = option.snake[0]
    return option.snake.some(
      (body, index) => index !== 0 && head.x === body.x && head.y === body.y
    )
  }

  const play = (timestamp) => {
    start++
    if (option.gameEnd) {
      return
    }
    if (timestamp - start > 1000 / 10) {
      if (isGameOver()) {
        option.gameEnd = true
        setHighScore();
        alert('게임 오버!')
        return;
      }
      playSnake()
      buildBoard()
      buildFood(ctx, option.food.x, option.food.y)
      getFood()
      setSnake()
      start = timestamp
    }
    window.requestAnimationFrame(play)
  }



  init()
})()
