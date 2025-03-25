;(function () {
  'use strict'

  const get = function (target) {
    return document.querySelector(target)
  }

  const getAll = function (target) {
    return document.querySelectorAll(target)
  }

  // 유사 배열 객체라서 직접 배열로 변환하는 로직이 필요
  const keys = Array.from(getAll('.key'))

  const soundsRoot = 'assets/sounds/'
  const drumSounds = [
    { key: 81, sound: 'clap.wav' },
    { key: 87, sound: 'crash.wav' },
    { key: 69, sound: 'hihat.wav' },
    { key: 65, sound: 'kick.wav' },
    { key: 83, sound: 'openhat.wav' },
    { key: 68, sound: 'ride.wav' },
    { key: 90, sound: 'shaker.wav' },
    { key: 88, sound: 'snare.wav' },
    { key: 67, sound: 'tom.wav' },
  ]

  // 오디오 element를 만드는 함수
  const getAudioElement = (index) => {
    const audio = document.createElement('audio')
    audio.dataset.key = drumSounds[index].key
    audio.src = soundsRoot + drumSounds[index].sound
    return audio
  }

  // keycode 값을 받아와 그에 맞는 오디오 재생하는 함수
  const playSound = (keycode) => {
    const $audio = get(`audio[data-key="${keycode}"]`)
    const $key = get(`div[data-key="${keycode}"]`)
    if ($audio && $key) {
      $key.classList.add('playing')
      $audio.currentTime = 0
      $audio.play()
    }
  }

  // keydown 이벤트를 발생시켜, 키보드 입력시 해당하는 드럼 소리가 나게함
  const onKeyDown = (e) => {
    console.log(e.keyCode)
    playSound(e.keyCode)
  }

  // 마우스 클릭시 소리가 나게하는 로직
  const onMouseDown = (e) => {
    const keycode = e.target.getAttribute('data-key')
    playSound(keycode)
  }

  // 소리가 날 때 애니메이션을 제거해주는 함수
  const onTransitionEnd = (e) => {
    if (e.propertyName === 'transform') {
      e.target.classList.remove('playing')
    }
  }

  const init = () => {
    window.addEventListener('keydown', onKeyDown)
    keys.forEach((key, index) => {
      const audio = getAudioElement(index)
      key.appendChild(audio)
      key.dataset.key = drumSounds[index].key
      key.addEventListener('click', onMouseDown)
      // transition이 끝날 때 확실하게 해당 클래스 제거를 위해 이벤트 추가
      key.addEventListener('transitionend', onTransitionEnd)
    })
  }

  init()
})()
