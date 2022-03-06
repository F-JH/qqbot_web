<template>
  <div style="padding-top: 30px; height: 100%; position: relative;">
    <video
        id="video"
        preload="auto"
        muted
        class="video-js vjs-default-skin"
        style="width: 100%; height: 100%; object-fit: fill"
    >
      <source src="http://xiao.xlfjh.ml:8080/hls/ar414.m3u8" type="application/x-mpegURL" />
    </video>
  </div>
</template>
<script>
import videojs from 'video.js'
import 'videojs-contrib-hls'
export default {
  mounted () {
    this.$nextTick(() => {
      this.getVideo()
    })
  },
  methods: {
    getVideo () {
      videojs('video', {
        bigPlayButton: true,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        controls: true,
        hls: {
          withCredentials: true
        }
      }, function () {
        this.play()
      })
    }
  }
}
</script>
