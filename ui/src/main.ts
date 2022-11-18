import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import CustomerScreen from '@/views/CustomerScreen.vue'
import OperatorScreen from '@/views/OperatorScreen.vue'
import StatusScreen from '@/views/StatusScreen.vue'
import CreateGroup from '@/views/CreateGroup.vue'
import MyGroups from '@/views/MyGroups.vue'
import Group from '@/views/Group.vue'

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/customer",
      component: CustomerScreen,
    },
    {
      path: "/operator",
      component: OperatorScreen,
    },
    {
      path: "/",
      component: StatusScreen,
    },
    {
      path: "/creategroup",
      component: CreateGroup,
    },
    {
      path: "/mygroups",
      component: MyGroups,
    },
    {
      path: "/group/:groupId",
      name: 'group',
      component: Group,
      props (route) {
        return {
          groupId: route.params.groupId
        }
      }
    }
  ],
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
