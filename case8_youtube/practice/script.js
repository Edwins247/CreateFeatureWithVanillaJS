;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)
  const getAll = (target) => document.querySelectorAll(target)

  const $search = get('#search')
  const $list = getAll ('.contents.list figure')
  const $searchButton = get('.btn_search')

  const $player = get('.view video')
  const $btnPlay = get('.js-play')
  const $btnReplay = get('.js-replay')
  const $btnStop = get('.js-stop')
  const $btnMute = get('.js-mute')
  const $progress = get('.js-progress')
  const $volume = get('.js-volume')
  const $fullScreen = get('.js-fullScreen')
  
  const init = () => {
    $search.addEventListener('keyup', search);
    $searchButton.addEventListener('click', search);
    for (let index = 0; index < $list.length; index++) {
      const $target = $list[index].querySelector('picture')
      $target.addEventListener('mouseover', onMouseOver)
      $target.addEventListener('mouseout', onMouseOut)
    }
    for (let index = 0; index < $list.length; index++) {
      $list[index].addEventListener('click', hashChange)
    }

    window.addEventListener('hashchange', () => {
      const isView = -1 < window.location.hash.indexOf('view')
      if (isView) {
        getViewPage()
      } else {
        getListPage()
      }
    })

    viewPageEvent()
  }

  const search = () => {
    let searchText = $search.value.toLowerCase()
    for (let index = 0; index < $list.length; index++) {
      const $target = $list[index].querySelector('strong')
      const text = $target.textContent.toLowerCase()
      if (-1 < text.indexOf(searchText)) {
        // -1 초과시, 인덱스가 포함되므로 style을 보여주도록
        $list[index].style.display = 'flex'
      } else {
        $list[index].style.display = 'none'
      }
    }
  }

  // mouseover 할떄 영상으로 보여주고 out을 할 경우 썸네일 이미지로 다시 보여줌
  const onMouseOver = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source')
    webpPlay.setAttribute('srcset', './assets/sample.webp')
  }

  const onMouseOut = (e) => {
    const webpPlay = e.target.parentNode.querySelector('source')
    webpPlay.setAttribute('srcset', './assets/sample.jpg')
  }

  // view페이지로 넘어가면 썸네일에 대한 hash가 바뀌면서 viewPage로 넘어가고 뒤로가기하면 ListPage로 감
  // hashChange 이벤트를 활용해서 처리함
  const hashChange = (e) => {
    e.preventDefault()
    const parentNode = e.target.closest('figure')
    const viewTitle = parentNode.querySelector('strong').textContent
    window.location.hash = `view&${viewTitle}`
    getViewPage()
  }

  const getViewPage = () => {
    const viewTitle = get('view strong')
    const urlTitle = decodeURI(window.location.hash.split('&'[1]))
    viewTitle.innerText = urlTitle

    get('.list').style.display = 'none'
    get('.view').style.display = 'flex'
  }

  const getListPage = () => {
    get('.list').style.display = 'flex'
    get('.view').style.display = 'none'
  }

  // 버튼이 바뀌게 하는 메소드
  const buttonChange = (btn, value) => {
    btn.innerHTML = value
  }

  const viewPageEvent = () => {
    // 바뀐 값으로 볼륨 조정
    $volume.addEventListener('change', (e) => {
      $player.$volume = e.target.value
    })

    // 각각 비디오 버튼 기능을 상황에 맞게 추가 및 처리
    $player.addEventListener('timeupdate', setProgress)
    $player.addEventListener('play', buttonChange($btnPlay, 'pause'))
    $player.addEventListener('pause', buttonChange($btnPlay, 'play'))
    $player.addEventListener('volumeChange', () => {
      $player.muted
        ? buttonChange($btnMute, 'unmute')
        : buttonChange($btnMute, 'mute')
    })
    $player.addEventListener('ended', $player.pause())
    $progress.addEventListener('click', getCurrent)
    $btnPlay.addEventListener('click', playVideo)
    $btnStop.addEventListener('click', stopVideo)
    $btnReplay.addEventListener('click', replayVideo)
    $btnMute.addEventListener('click', mute)
    $fullScreen.addEventListener('click', fullScreen)
  }

  // 현재 영상 시간 값 가져옴, 그에 따라 시간이 바뀜
  const getCurrent = (e) => {
    let percent = e.offsetX / $progress.offsetWidth
    $player.currentTime = percent * $player.duration
    e.target.value = Math.floor(percent / 100)
  }

  // progress의 위치를 time에 맞춰서 세팅해서 할당
  const setProgress = () => {
    let percentage = Math.floor((100 / $player.duration) * $player.currentTime)
    $progress.value = percentage
  }

  // play 버튼 상태에 따라 text 변경 및 비디오를 실행 혹은 정지시킴
  const playVideo = () => {
    if ($player.paused || $player.ended) {
      buttonChange($btnPlay, 'Pause')
      $player.play()
    } else {
      buttonChange($btnPlay, 'Play')
      $player.pause()
    }
  }

  // 아예 비디오를 멈춤
  const stopVideo = () => {
    $player.pause()
    $player.currentTime = 0
    buttonChange($btnPlay, 'play')
  }

  const resetPlayer = () => {
    $progress.value = 0
    $player.currentTime = 0
  }

  // 다시 원점으로 비디오를 돌려서 실행
  const replayVideo = () => {
    resetPlayer()
    $player.play()
    buttonChange($btnPlay, 'Pause')
  }

  const mute = () => {
    if ($player.muted) {
      buttonChange($btnMute, 'mute')
      $player.muted = false
    } else {
      buttonChange($btnMute, 'unmute')
      $player.muted = true
    }
  }

  const fullScreen = () => {
    if ($player.requestFullscreen) {
      if (document.fullscreenElement) {
        document.cancelFullScreen()
      } else {
        $player.requestFullscreen()
      }
    } else if ($player.msRequestFullScreen) {
      if (document.msRequestFullScreen) {
        document.msExitFullScreen()
      } else {
        $player.msRequestFullScreen()
      }
    } else {
      alert('Not Supported')
    }
  }

  init()
})()
