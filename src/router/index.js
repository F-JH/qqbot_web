import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import AddUser from '../test/AddUser.vue'
import EditUser from '../test/EditUser.vue'
import myTest from '../test/myTest.vue'
import UserInfor from '../test/UserInfo.vue'

import index from '../views/index.vue'
import log from '../views/log/log.vue'
import live from '../views/live/live.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/index',
      name: 'index',
      component: index,
      children: [
        // {path: 'UserInfo', name: '用户信息', component: UserInfor},
        {path: 'log', name: '日志', component: log},
        {path: 'live', name: '直播间', component: live}
      ]
    }
    // {
    //   path: '/UserInfo',
    //   name: 'UserInfo',
    //   component: UserInfor
    // },
    // {
    //   path: '/AddUser',
    //   name: 'AddUser',
    //   component: AddUser
    // },
    // {
    //   path: '/createUser',
    //   name: 'create',
    //   component: EditUser
    // },
    // {
    //   path: '/myTest',
    //   name: 'test',
    //   component: myTest
    // }
  ]
})
