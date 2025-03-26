(() => {
  "use strict";

  const get = (element) => document.querySelector(element);

  // 키 이벤트 처리를 위한 이벤트 등록 함수
  const keyEvent = (control, func) => {
    document.addEventListener(control, func, false);
  };

  class BrickBreak {
    constructor(parent = "body", data = {}) {
      this.parent = get(parent);
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("width", 480);
      this.canvas.setAttribute("height", 340);
      this.ctx = this.canvas.getContext("2d");
      this.fontFamily =
        "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
      this.score = 0;
      this.lives = data.lives;
      this.speed = data.speed;
      this.image = document.createElement("img");
      this.bg = data.bg;
      this.radius = 10;
      this.ballX = this.canvas.width / 2;
      this.ballY = this.canvas.height - 30;
      this.directX = data.speed;
      this.directY = -data.speed;
      this.paddleWidth = data.paddleWidth;
      this.paddleHeight = data.paddleHeight;
      this.rightPressed = false;
      this.leftPressed = false;
      this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
      this.brickRow = data.brickRow;
      this.brickCol = data.brickCol;
      this.brickWidth = data.brickWidth;
      this.brickHeight = data.brickHeight;
      this.brickPad = data.brickPad;
      this.brickPosX = data.brickPosX;
      this.brickPosY = data.brickPosY;
      this.ballColor = data.ballColor;
      this.paddleColor = data.paddleColor;
      this.fontColor = data.fontColor;
      this.brickStartColor = data.brickStartColor;
      this.brickEndColor = data.brickEndColor;
      this.image.setAttribute("src", this.bg);
      this.parent.appendChild(this.canvas);
      this.bricks = [];
    }

    init = () => {
      // 벽돌 배열 만들기
      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        this.bricks[colIndex] = [];
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          this.bricks[colIndex][rowIndex] = { x: 0, y: 0, status: 1 };
        }
      }
      this.keyEvent();
      this.draw();
    };

    // 키를 뗐을 때의 이벤트 처리
    keyupEvent = (event) => {
      if ("Right" === event.key || "ArrowRight" === event.key) {
        this.rightPressed = false;
      } else if ("Left" === event.key || "ArrowLeft" === event.key) {
        this.leftPressed = false;
      }
    };

    // 키를 눌렀을 때의 이벤트 처리
    keydownEvent = (event) => {
      if ("Right" === event.key || "ArrowRight" === event.key) {
        this.rightPressed = true;
      } else if ("Left" === event.key || "ArrowLeft" === event.key) {
        this.leftPressed = true;
      }
    };

    // 마우스 움직임에 따라서 canvas를 넘지않고 paddle을 움직이게함
    mousemoveEvent = (event) => {
      const positionX = event.clientX - this.canvas.offsetLeft;

      if (0 < positionX && positionX < this.canvas.width) {
        this.paddleX = positionX - this.paddleWidth / 2;
      }
    };

    keyEvent = () => {
      keyEvent("keyup", this.keyupEvent);
      keyEvent("keydown", this.keydownEvent);
      keyEvent("mousemove", this.mousemoveEvent);
    };

    // 공을 그리는 메소드
    drawBall = () => {
      // 색깔과 실제 원을 그려서 처리함
      this.ctx.beginPath();
      this.ctx.fillStyle = this.ballColor;
      this.ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.closePath();
    };

    // 벽돌 깨기에 공을 부딪쳐 움직일 paddle 그리기
    drawPaddle = () => {
      this.ctx.beginPath();
      this.ctx.rect(
        this.paddleX,
        this.canvas.height - this.paddleHeight,
        this.paddleWidth,
        this.paddleHeight
      );
      this.ctx.fillStyle = this.paddleColor;
      this.ctx.fill();
      this.ctx.closePath();
    };

    drawBricks = () => {
      let brickX = 0;
      let brickY = 0;
      let gradient = this.ctx.createLinearGradient(0, 0, 200, 0);
      gradient.addColorStop(0, this.brickStartColor);
      gradient.addColorStop(1, this.brickEndColor);

      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          // brick이 깨져서 0이 될 경우 그리지 않게 처리
          if (1 !== this.bricks[colIndex][rowIndex].status) {
            continue;
          }
          // 벽돌들을 그림
          brickX =
            colIndex * (this.brickWidth + this.brickPad) + this.brickPosX;
          brickY =
            rowIndex * (this.brickHeight + this.brickPad) + this.brickPosY;

          // row & column 값에 맞게 x, y 변수를 만들어서 그 벽돌을 그대로 그림
          this.bricks[colIndex][rowIndex].x = brickX;
          this.bricks[colIndex][rowIndex].y = brickY;

          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
          this.ctx.fillStyle = gradient;
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    };

    // score & live의 텍스트를 그리는 함수
    drawScore = () => {
      this.ctx.font = this.fontFamily;
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillText("점수 : " + this.score, 10, 22);
    };

    drawLives = () => {
      this.ctx.font = this.fontFamily;
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillText("목숨 : " + this.lives, this.canvas.width - 68, 22);
    };

    detectCollision = () => {
      let currentBrick = {};

      // index를 감지해서 벽의 위치를 감지하고 공과 부딪치는 충돌감지를 함
      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          currentBrick = this.bricks[colIndex][rowIndex];
          if (1 !== currentBrick.status) {
            // 깨진 상태라면 넘어감
            continue;
          }

          if (
            this.ballX > currentBrick.x &&
            this.ballX < currentBrick.x + this.brickWidth &&
            this.ballY > currentBrick.y &&
            this.ballY < currentBrick.y + this.brickHeight
          ) {
            // 벽돌을 깬 상태로 바꿈
            this.directY = -this.directY
            currentBrick.status = 0
            this.score++

            // score과 brick 개수와 같지 않다면 계속 반복문 진행
            if (this.score !== this.brickCol * this.brickRow) {
              continue
            }
            alert('승리했습니다.')
            this.reset()
          }
        }
      }
    };

    draw = () => {
      // 그릴 때는 기본적으로 계속 그려야하니 지우면서 진행
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.drawImage(
        this.image,
        this.canvas.width / 2 - this.image.width / 2,
        this.canvas.height / 2 - this.image.height / 2
      );

      this.drawBall();
      this.drawPaddle();
      this.drawBricks();
      this.drawScore();
      this.drawLives();
      this.detectCollision();

      // ball이 벽을 넘지 않게 처리하는 로직(양쪽벽 기준)
      if (
        this.ballX + this.directX > this.canvas.width - this.radius ||
        this.ballX + this.directX < this.radius
      ) {
        this.directX = -this.directX;
      }

      // ball이 위, 아래벽을 넘지 않게 처리하는 로직
      if (this.ballY + this.directY < this.radius) {
        this.directY = -this.directY;
      } else if (this.ballY + this.directY > this.canvas.height - this.radius) {
        // 벽 아래쪽으로 갈 떄(paddle을 부딪치면 위로 가도록)
        if (
          this.ballX > this.paddleX &&
          this.ballX < this.paddleX + this.paddleWidth
        ) {
          this.directY = -this.directY;
        } else {
          // 만약 paddle도 안 부딪쳤다면 목숨 차감
          this.lives--;
          if (0 === this.lives) {
            alert("실패하였습니다.");
            this.reset();
          } else {
            // 목숨이 0이 아니면 게임을 다시 시작하므로 ball을 정중앙으로 둠
            this.ballX = this.canvas.width / 2;
            this.ballY = this.canvas.height - this.paddleHeight;
            this.directX = this.speed;
            this.directY = -this.speed;
            this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
          }
        }
      }

      // 키보드를 바탕으로 paddle이 움직이게 처리함(벽에 닿을때까지 움직임)
      if (
        this.rightPressed &&
        this.paddleX < this.canvas.width - this.paddleWidth
      ) {
        this.paddleX += 7;
      } else if (this.leftPressed && 0 < this.paddleX) {
        this.paddleX -= 7;
      }

      // ball을 계속 움직임
      this.ballX += this.directX;
      this.ballY += this.directY;

      requestAnimationFrame(this.draw);
    };

    reset = () => {
      // 실패시 게임 다시 시작
      document.location.reload();
    };
  }

  // 벽돌깨기 게임에 설정할 기본적인 옵션들
  const data = {
    lives: 5,
    speed: 2,
    paddleHeight: 10,
    paddleWidth: 75,
    bg: "./assets/bg.jpeg",
    ballColor: "#04bf55",
    paddleColor: "#05aff2",
    fontColor: "#f2bb16",
    brickStartColor: "#f29f05",
    brickEndColor: "#f21905",
    brickRow: 3,
    brickCol: 5,
    brickWidth: 75,
    brickHeight: 20,
    brickPad: 10,
    brickPosX: 30,
    brickPosY: 30,
  };

  const brickBreak = new BrickBreak(".canvas", data);
  brickBreak.init();
})();
