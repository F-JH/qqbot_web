<template xmlns:div="http://www.w3.org/1999/html">
  <div style="height: 100%">
<!--    <el-header>-->
<!--      <el-button @click="testLoad">点击刷新</el-button>-->
<!--    </el-header>-->
    <ul class="log">
      <li v-for="log in logs" style="display: flex">
        <div class="message" style="width: 110px; align-items: center">
          <div :title="log.name">{{log.name.substr(0, 4)}}{{(log.name.length>4)?"...：":":"}}</div>
        </div>
        <div class="message" :style="'width:' + log.len + 'px'" style="align-items: center; margin-left: 10px;" v-if="log.msg">
          {{log.msg}}
        </div>
        <el-button v-if="log.img" @click="showimg(log.img)" icon="el-icon-picture" style="margin-top: 5px" :style="{marginLeft: log.msg?'0px':'10px'}" circle></el-button>
      </li>
    </ul>
    <el-footer style="margin-top: 30px;">
      <transition name="el-zoom-in-center">
        <el-button v-show="reflech" @click="connectGroup('330405140')">点击重连</el-button>
      </transition>
    </el-footer>
    <el-dialog :visible.sync="show">
      <el-image referrerPolicy="no-referrer" :src="showImageUrl">
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "log",
  data(){
    return {
      logs: [],
      show: false,
      showImageUrl: '',
      ws: null,
      reflech: false,
      groups: [
          '330405140',
          '473755421',
          '747819422',
          '961530103'
      ]
    }
  },
  methods:{
    load(){
      axios.get('/api/message/show-list')
        .then((response)=>{
          let res = JSON.parse(response.data);
          console.log(res);
          let groupMsg = res["330405140"];
          // let groupMsg = res["747819422"];
          // let groupMsg = res["473755421"];
          // let groupMsg = res["961530103"];
          let tmpArray = [];
          for(let msg of groupMsg){
            tmpArray.push({id: msg[1], msg: msg[3], img: msg[4], name: msg[6], len: msg[3].length*18});
          }
          this.logs = tmpArray;
        });
    },
    testLoad(){
      // let tmpArray = {id: 's', msg: '尼玛', img: '', name: '半夏', len: 2*18};
      // this.$set(this.logs, this.logs.length, tmpArray);
      console.log(this.logs);
    },
    showimg(url){
      this.showImageUrl = url;
      this.show = true;
      console.log(url);
    },
    wait(ms){
      return new Promise((resolve) => {
        setTimeout(() => {resolve()}, ms);
      });
    },
    async connectGroup(groupId){
      if(this.ws == null){
        this.ws = new WebSocket("ws://119.91.194.230:8080/ws_message");
      }else{
        this.ws.close(1000, '正常关闭');
        while(this.ws.readyState != this.ws.CLOSED){
          await this.wait(100);
        }
        this.reflech = false;
        this.ws = new WebSocket("ws://119.91.194.230:8080/ws_message");
        this.logs.splice(0, this.logs.length);
      }
      this.ws.onmessage = (data)=>{
        let tmpArray;
        if(data.data == "没有数据"){
          tmpArray = {id: '', msg: data.data, img: '', name: '系统提示', len: 4*18};
          // ws.close();
        }else{
          let msg = JSON.parse(data.data);
          tmpArray = {id: msg[1], msg: msg[3], img: msg[4], name: msg[6], len: msg[3].length*18};
        }
        // console.log(this.logs);
        this.$set(this.logs, this.logs.length, tmpArray)
        // this.logs.push(tmpArray);
      };
      this.ws.onclose = ()=>{
        this.$notify({
          title: '警告',
          message: '连接被关闭，请确认是否是你手动触发的',
          type: 'warning'
        });
        console.log("关闭连接");
        this.reflech = true;
      };
      let connect = false;
      for(let i=0; i<10; i++){
        if(this.ws.readyState == this.ws.OPEN){
          const h = this.$createElement;
          this.$notify({
            title: '成功',
            message: h('i', {style: 'color: teal'}, '成功连接到WebSocket服务器！'),
            type:'success'
          });

          console.log("连接到WebSocket服务器...")
          // ws.send("961530103");
          this.ws.send(groupId);
          connect = true;
          break;
        }
        await this.wait(1000);
      }
      if(!connect){
        this.$notify({
          title: '警告',
          message: '连接失败!',
          type: 'warning'
        });
        console.log("连接失败");
        this.reflech = true;
      }
    }
  },
  async mounted() {
    this.connectGroup("330405140");
    window.changeGroup = this.connectGroup;
    window.ws = this.ws;
    window.groups = this.groups;
  },
  watch:{
    logs(newVal){
      if(newVal.length >= 200){
        newVal.splice(0, 1);
      }
      // console.log(newVal);
    }
  }
}
</script>

<style>
.log{
  height: 80%;
  overflow: auto;
  border-radius: 10px;
  margin: 0px auto;
  /*width: 350px;*/
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.5);
}
.message{
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  min-width: 60px;
  /*padding-left: 10px;*/
  border-radius: 15px;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.6);
}

.userStyle {
  display: inline-block;
  white-space: normal;
  width: 100%;
  overflow: hidden; /*超出的文本隐藏*/
  text-overflow: ellipsis; /* 溢出用省略号*/

}
</style>