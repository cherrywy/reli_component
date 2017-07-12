import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import home from './views/home/home.vue'

import layoutManage from './views/shop/layoutManage.vue'
import goodsManage from './views/goods/goodsManage.vue'
import onlineGoods from './views/goods/onlineGoods.vue'
import bindDisplayData from './views/displayManage/bindDisplayData.vue'
import manageDisplayDevice from './views/displayManage/manageDisplayDevice.vue'
import editDevice from './views/displayManage/editDevice.vue'

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
            { path: '/', component: home, name: '首页',hidden:true },
            
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
        name: '商品管理',
        children: [
            { path: '/goodsManage', component: goodsManage, name: '商品管理' },
            { path: '/onlineGoods', component: onlineGoods, name: '商品上架' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '广告管理',
        children: [
            { path: '/bindDisplayData', component: bindDisplayData, name: '素材绑定' },
            { path: '/manageDisplayDevice', component: manageDisplayDevice, name: '广告机管理' },
            { path: '/editDevice', component: editDevice, name: '查看编辑广告机',hidden:true }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;