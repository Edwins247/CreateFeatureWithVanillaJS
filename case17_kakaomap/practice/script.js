;(function () {
  'use strict'

  const shops = [
    {
      id: 1292273001,
      name: '매콤돈가스&칡불냉면 판교점',
      lat: 37.40189834738935,
      lng: 127.10624455094185,
    },
    {
      id: 1151112822,
      name: '탄탄면공방 판교테크노밸리점',
      lat: 37.40193038525563,
      lng: 127.11060980539878,
    },
    {
      id: 15775065,
      name: '파리바게뜨 판교테크노점',
      lat: 37.40133360873933,
      lng: 127.10801128231743,
    },
  ]

  const defaultPos = {
    lat: 37.4020589,
    lng: 127.1064401,
  }

  const get = (target) => {
    return document.querySelector(target)
  }

  const $map = get('#map')
  const $getLocationButton = get('.geolocation_button')

  // 카카오맵 띄우기 기본
  const mapContainer = new kakao.maps.Map($map, {
    center: new kakao.maps.LatLng(defaultPos.lat, defaultPos.lng),
    level: 3
  })

  // 마커 이미지를 만드는 메소드
  const createMarkerImage = () => {
    const markerImageSrc = 'assets/marker.png'
    const imageSize = new kakao.maps.Size(30, 46)
    return new kakao.maps.MarkerImage(markerImageSrc, imageSize)
  }

  // 마커를 만드는 메소드
  const createMarker = (lat, lng) => {
    const marker = new kakao.maps.Marker({
      map: mapContainer,
      position: new kakao.maps.LatLng(lat, lng),
      image: createMarkerImage(),
    })
    return marker
  }

  // 상점 위치를 만드는 메소드
  const createShopElement = () => {
    shops.map((shop) => {
      const { lat, lng } = shop
      const marker = createMarker(lat, lng)
      // marker의 info window 생성(고유한 kakao 맵의 정보 화면으로 넘어가게 처리함)
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 2px;">
                  <a href="https://place.map.kakao.com/${shop.id}" target="_blank">${shop.name}</a>
                </div>`,
      })
      infowindow.open(mapContainer, marker)
    })
  }
  
  // 위치 정보 가져오는 것 성공할 때 메소드 처리
  const successGeolocation = (position) => {
    const { latitude, longitude } = position.coords
    mapContainer.setCenter(new kakao.maps.LatLng(latitude, longitude))
    const marker = createMarker(latitude, longitude)
    marker.setMap(mapContainer)
  }
  // 위치 정보 가져오는 것 실패할 때 메소드 처리
  const errorGeolocation = (error) => {
    if (error.code === 1) {
      alert('위치 정보를 허용해주세요')
    } else if (error.code === 2) {
      alert('사용할 수 없는 위치입니다.')
    } else if (error.code === 3) {
      alert('타임아웃이 발생했습니다.')
    } else {
      alert('오류가 발생했습니다.')
    }
  }

  // 현재 위치 정보를 가져오는 메소드
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        successGeolocation,
        errorGeolocation
      )
    } else {
      alert('지도 api 사용 불가')
    }
  }

  const init = () => {
    $getLocationButton.addEventListener('click', () => {
      getLocation()
    })
    createShopElement()
  }

  init()
})()
