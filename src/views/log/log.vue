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
        <div class="message" :style="{'width':log.len + 'px', 'backgroundColor':log.color}" style="align-items: center; margin-left: 10px;" v-if="log.msg">
          {{log.msg}}
        </div>
        <el-button v-if="log.img" @click="showimg(log.img)" icon="el-icon-picture" style="margin-top: 5px" :style="{marginLeft: log.msg?'0px':'10px'}" circle></el-button>
      </li>
    </ul>
    <el-footer style="margin-top: 30px;">
      <transition name="el-zoom-in-center">
        <el-button v-show="reflech" @click="connectGroup(groupId)">点击重连</el-button>
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
      // domain: '119.91.194.230:8080',
      // domain: 'localhost:8080',
      domain: this.$root.Bus.config.domain,
      logs: [],
      show: false,
      showImageUrl: '',
      ws: null,
      startHeart: false, // 是否启动心跳包
      reflech: false,
      groupId: '',
      groups: [
          '330405140',
          '473755421',
          '747819422',
          '961530103'
      ]
    }
  },
  methods:{
    // load(){
    //   axios.get('/api/message/show-list')
    //     .then((response)=>{
    //       let res = JSON.parse(response.data);
    //       console.log(res);
    //       let groupMsg = res["330405140"];
    //       // let groupMsg = res["747819422"];
    //       // let groupMsg = res["473755421"];
    //       // let groupMsg = res["961530103"];
    //       let tmpArray = [];
    //       for(let msg of groupMsg){
    //         tmpArray.push({id: msg[1], msg: msg[3], img: msg[4], name: msg[6], len: msg[3].length*18});
    //       }
    //       this.logs = tmpArray;
    //     });
    // },
    showimg(url){
      this.showImageUrl = url;
      this.show = true;
      // console.log(url);
    },
    wait(ms){
      return new Promise((resolve) => {
        setTimeout(() => {resolve()}, ms);
      });
    },
    async connectGroup(groupId){
      this.groupId = groupId;
      if(this.ws == null){
        this.ws = new WebSocket("ws://" + this.domain + "/ws_message");
      }else{
        this.ws.close(1000, '正常关闭');
        while(this.ws.readyState != this.ws.CLOSED){
          await this.wait(100);
        }
        this.reflech = false;
        this.ws = new WebSocket("ws://" + this.domain + "/ws_message");
        this.logs.splice(0, this.logs.length);
      }

      this.startHeart = false;

      this.ws.onmessage = (data)=>{
        let tmpArray;
        if(data.data == "没有这个群的数据"){
          tmpArray = {id: '', msg: data.data, img: '', name: '系统提示', len: 8*18, color: '#f56c6c'};
          this.ws.close(1000, '没有数据，关闭通道');
          this.$set(this.logs, this.logs.length, tmpArray)
        }else if(data.data == "end"){
          this.ws.send(JSON.stringify({code:200, groupId:this.groupId}));
          this.startHeart = true;
        }else if(data.data == "已经是最新数据"){

        }else{
          let msg = JSON.parse(data.data);
          if(msg.length == 2){
            for(let log of this.logs){
              if(log.id == msg[1])
                log.color = '#7b8c9d';
            }
          }else{
            tmpArray = {id: msg[1], msg: msg[3], img: msg[4], name: msg[6], len: msg[3].length*18, color:msg[0]?'#7b8c9d':''};
            this.$set(this.logs, this.logs.length, tmpArray);
          }
        }
      };

      this.ws.onclose = (e)=>{
        this.$notify({
          title: '警告',
          message: '连接被关闭，请确认是否是你手动触发的',
          type: 'warning'
        });
        console.log("连接断开: " + e.code + '|' + e.reason + '|' + e.wasClean);
        console.log(e);
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
          this.ws.send(JSON.stringify({code:300, groupId:groupId}));
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
    // this.connectGroup('961530103');
    window.changeGroup = this.connectGroup;
    window.ws = this.ws;
    window.groups = this.groups;
    window.logs = this.logs;
  },
  watch:{
    logs(newVal){
      if(newVal.length >= 200){
        newVal.splice(0, 1);
      }
    },
    async startHeart(newVal, oldVal){
      if(newVal){
        let tmpWs = this.ws;
        while(tmpWs.readyState == 1){
          await this.wait(15000);
          tmpWs.send(JSON.stringify({code:100, groupId:this.groupId, timestamp: new Date().getTime()}));
        }
      }
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
  /*color: #f56c6c;*/
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