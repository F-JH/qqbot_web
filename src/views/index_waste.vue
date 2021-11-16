<template>
    <el-container class="index-con" >
        <el-aside class="myside">
            <el-menu
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                style="text-align: center;"
                router>
            <div class="logobox">
              <img class="logoimg" src="../assets/img/logo.png" alt="">
            </div>
              <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{menu.menuname}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="chmenu in menu.childrenmenus" :key="chmenu.menuid" :index="chmenu.url">{{chmenu.menuname}}</el-menu-item>
<!--                  <el-menu-item index="/index/UserInfo">用户信息</el-menu-item>-->
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
        </el-aside>
        <el-container>
          <el-header class="topNavigation">
            <el-menu
                class="el-menu-demo"
                background-color="#545c64"
                active-text-color="#ffd04b"
                text-color="#fff"
                mode="horizontal"
                style="width: 100%; height: 100%">
              <el-menu-item>别点了</el-menu-item>
              <el-menu-item>点了我也不鸟你</el-menu-item>
            </el-menu>
          </el-header>
          <router-view />
        </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'console',
  data(){
        return {
          allmenu:[]
        }
    },
  created() {
    let res = {
      data: [
        {
          menuid: 1,
          menuname: 'QQBOT',
          childrenmenus: [
            {
              menuid: 2,
              url: '/index/log',
              menuname: '日志'
            },
            {
              menuid: 3,
              url: '/index/UserInfo',
              menuname: '用户管理'
            }
          ]
        }
      ]
    };

    this.allmenu = res.data;
  },
  methods: {}
}
</script>

<style>
.myside{
   /* height: 100%;  */
   background-color: #545c64;
}
.index-con{
  width: 100%;
  height: 100%;
  /* background-color: cadetblue; */
  /* box-sizing: border-box; */
}
.el-menu {
    border-right: solid 0px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #FFF; 
}
.el-header {
  padding: 0 0px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
</style>