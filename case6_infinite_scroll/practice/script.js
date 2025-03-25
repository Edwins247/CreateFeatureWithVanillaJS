;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  let page = 1
  const limit = 10
  const $posts = get('.posts')
  const end = 100
  let total = 10

  const $loader = get('.loader')

  const getPost = async () => {
    // 외부 API를 통해 post 데이터를 받아옴
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('에러가 발생했습니다.')
    } 
    return await response.json()
  }

  const showPosts = (posts) => {
    posts.forEach((post) => {
      // post를 보여주기 위해서 div 태그를 만듬
      const $post = document.createElement('div')
      $post.classList.add('post')
      $post.innerHTML = `
          <div class="header"></div>
            <div class="id">${post.id}</div>
            <div class="title">${post.title}</div>
          </div>
          <div class="body">
            ${post.body}
          </div>
      `
      $posts.appendChild($post)
    })
  }

  const showLoader = () => {
    $loader.classList.add('show')
  }

  const hideLoader = () => {
    $loader.classList.remove('show')
  }

  const loadPost = async () => {
    // 로딩 El 보여줌
    showLoader()
    try {
      const response = await getPost()
      showPosts(response)
    } catch (error) {
      console.error(error)
    } finally {
      // 로딩 El 사라지게 함
      hideLoader()
    }
  }

  // 스크롤 끝 감지를 위한 함수
  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    // 정해진 개수만큼 불러올 때 더 이상 불러오지 않게 하기 위한 처리
    if (total === end) {
      // 이벤트가 끝났으니 제거
      window.removeEventListener('scroll', onScroll)
      return
    }

    // scrollTop, clientHeight 스크롤 영역과 전체 보여지는 길이가 길면 감지
    // 이 때 -5는 그만큼의 간격을 주기 위함(무한 스크롤 방식)
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      // 스크롤 할 때마다 post를 load해서 보여주되, 다음 페이지의 데이터를 불러옴
      page++
      total += 10
      loadPost()
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadPost()
    // 스크롤 끝 감지
    window.addEventListener('scroll', onScroll)
  })
})()
