<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import UserInfo from './test/UserInfo.vue'
export default {
  name: 'App',
  data() {
    return {
      // waifuurl: 'http://localhost:8080/autoload.js'
      waifuurl: '/static/live2d-widget/autoload.js'
    }
  },
  methods: {
    startHacking() {
      this.$notify({
        title: 'It works',
        type: 'success',
        message: '可以开始玩耍了',
        duration: 5000
      });
    },
    addWaifu(){
      let head = document.getElementsByTagName("head")[0];
      let dependcy = document.createElement("link");
      dependcy.setAttribute("rel", "stylesheet");
      dependcy.setAttribute("href", "https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css");
      head.appendChild(dependcy);

      let scriptElement = document.createElement("script");
      // scriptElement.setAttribute("src", "http://localhost:8080/autoload.js");
      console.log(this.waifuurl);
      scriptElement.setAttribute("src", this.waifuurl);
      head.appendChild(scriptElement);
    },
    wait(ms){
      return new Promise((resolve) => {
        setTimeout(() => {resolve()}, ms);
      });
    }
  },
  mounted() {
    this.addWaifu();
    (new Promise(async (resolve, reject)=>{
      // 循环10s搜索看板娘的div是否已经生成
      let waifu;
      for(let i=0; i<10; i++){
        waifu = document.getElementById("waifu");
        if(waifu == null){
          await this.wait(1000);
        }else{
          resolve(waifu);
          break;
        }
      }
      if(waifu == null){
        reject();
      }
    })).then((waifu)=>{
      console.log("找到看板娘了");
      // z-index越大就越在顶层，这里999999应该没人比的过了
      waifu.setAttribute("style", "z-index:999999; bottom: 0px");
      waifu.onmousedown = function(event){
        let ev = event || window.event;
        event.stopPropagation();
        var disX = ev.clientX - waifu.offsetLeft;
        var disY = ev.clientY - waifu.offsetTop;
        document.onmousemove = function(event) {
          var ev = event || window.event;
          waifu.style.left = ev.clientX - disX + "px";
          waifu.style.top = ev.clientY - disY + "px";
          waifu.style.cursor = "move";
        };
      };
      waifu.onmouseup = function() {
        document.onmousemove = null;
        this.style.cursor = "default";
      };
    }).catch(()=>{
      console.log("没找到看板娘，或许你应该设置再等久一点...");
    });
  },
  components: {
    // UserInfo
  }
}
</script>

<style>
html,body,#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100%;
  padding:0px;
  margin:0px;

}
</style>
