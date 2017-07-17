import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import home from './views/home/home.vue'

import layoutManage from './views/shop/layoutManage.vue'
import bindDisplayData from './views/displayMgt/bindDisplayData.vue'
import bindList from './views/displayMgt/bindList.vue'
import manageDisplayDevice from './views/displayMgt/manageDisplayDevice.vue'
import editDevice from './views/displayMgt/editDevice.vue'
import bind_list from './views/displayMgt/bind_list.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'el-icon-message',
        children: [
            { path: '/', component: home, name: '首页',hidden:true }  
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '门店管理',
        children: [
            { path: '/layoutManage', component: layoutManage, name: '布局管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商品管理'
    },
    {
        path: '/',
        component: Home,
        name: '广告管理',
        children: [
            { path: '/bindDisplayData', component: bindDisplayData, name: '素材绑定' },
            { path: '/manageDisplayDevice', component: manageDisplayDevice, name: '广告机管理' },
            { path: '/editDevice', component: editDevice, name: '查看编辑广告机',hidden:true },
            { path: '/bindList', component: bindList, name: '素材绑定',hidden:true },
            { path: '/bind_list', component: bind_list, name: '素材绑定',hidden:true }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;