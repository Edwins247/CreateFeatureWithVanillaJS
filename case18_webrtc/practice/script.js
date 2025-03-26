(() => {
  "use strict";

  const get = (element) => document.querySelector(element);
  // 권한을 허용받기 위한 객체
  const allowUser = {
    audio: true,
    video: true,
  };

  class WebRtc {
    constructor() {
      this.media = new MediaSource();
      this.recorder;
      this.blobs;
      this.playedVideo = get("video.played");
      this.recordVideo = get("video.record");
      this.btnDownload = get(".btn_download");
      this.btnRecord = get(".btn_record");
      this.btnPlay = get(".btn_play");
      this.container = get(".webrtc");
      this.events();
      // 권한을 허용받는 것을 처리하는 메소드
      navigator.mediaDevices.getUserMedia(allowUser).then((videoAudio) => {
        this.success(videoAudio);
      });
    }

    events() {
      // 각 버튼에 맞는 메소드를 바인딩함
      this.btnRecord.addEventListener("click", this.toggleRecord.bind(this));
      this.btnPlay.addEventListener("click", this.play.bind(this));
      this.btnDownload.addEventListener("click", this.download(this));
    }

    success(audioVideo) {
      this.btnRecord.removeAttribute("disabled");
      window.stream = audioVideo;
      // 소켓 통신을 통해서 허용됐다면 해당하는 비디오를 없다면 기존 비디오를 실행시키게 처리함
      if (window.URL) {
        this.playedVideo.setAttribute(
          "src",
          window.URL.createObjectURL(audioVideo)
        );
      } else {
        this.playedVideo.setAttribute("src", audioVideo);
      }
    }

    // 녹화 버튼 누르면 녹화 시작 & 중지하는 메소드
    toggleRecord() {
      if ("녹화" === this.btnRecord.textContent) {
        this.startRecord();
      } else {
        this.btnPlay.removeAttribute("disabled");
        this.btnDownload.removeAttribute("disabled");
        this.btnRecord.textContent = "녹화";
        this.stopRecord();
      }
    }

    pushBlobData(event) {
      // 데이터가 있다면 blob 데이터로 쓰게끔 처리함
      if (!event.data || event.data.size < 1) {
        return;
      }
      this.blobs.push(event.data);
    }

    startRecord() {
      // 비디오 영상의 가장 일반적인 타입으로 지정
      let type = { mimeType: "video/webm;codecs=vp9" };
      this.blobs = [];
      // 타입 지원 여부 확인 후, 타입을 일반타입으로 변경
      if (!MediaRecorder.isTypeSupported(type.mimeType)) {
        type = { mimeType: "video/webm " };
      }
      // 해당 영상을 통해 stream, type 전달, 그리고 버튼 상태를 바꿈
      this.recorder = new MediaRecorder(window.stream, type);
      this.btnRecord.textContent = "중지";
      this.btnPlay.setAttribute("disabled", true);
      this.btnDownload.setAttribute("disabled", true);
      // record가 되는 data가 available이 되면 blob 데이터로 만들어서 다운로드 받을 수 있게 처리함
      this.recorder.ondataavailable = this.pushBlobData.bind(this);
      this.recorder.start(20); // 20초 가량 녹화하게함
    }

    stopRecord() {
      // 녹화를 끝내고 실행되게끔 처리함
      this.recorder.stop();
      this.recordVideo.setAttribute("controls", true);
    }

    play() {
      // 비디오를 실행시킴
      this.recordVideo.src = window.URL.createObjectURL(
        new Blob(this.blobs, { type: "video/webm " })
      );
    }

    download() {
      // 비디오 파일을 받아서 처리
      const videoFile = new Blob(this.blobs, { type: 'video/webm' })
      const url = window.URL.createObjectURL(videoFile)
      // 다운로드 하도록 태그 생성후 연결
      const downloader = document.createElement('a')
      downloader.style.display = 'none'
      downloader.setAttribute('href', url)
      downloader.setAttribute('download', 'test_video.webm')
      this.container.appendChild(downloader)
      downloader.click()
      setTimeout(() => {
        this.container.removeChild(downloader)
        window.URL.revokeObjectURL(url)
      }, 100)

    }
  }

  new WebRtc();
})();
