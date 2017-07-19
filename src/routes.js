import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import home from './views/home/home.vue'

import goodsMgtList from './views/goodsMgt/goodsMgtList.vue'
import goodsMgtNew from './views/goodsMgt/goodsMgtNew.vue'
import goodsMgtEdit from './views/goodsMgt/goodsMgtEdit.vue'
import goodsMgtOnline from './views/goodsMgt/goodsMgtOnline.vue'
import goodsMgtDataImport from './views/goodsMgt/goodsMgtDataImport.vue'

import layoutManage from './components/View/layoutBoardView.vue'
import bindDisplayData from './views/displayMgt/bindDisplayData.vue'
import viewTwoimgs from './views/displayMgt/common/viewTwoimgs.vue'
import viewTwovideo from './views/displayMgt/common/viewTwovideo.vue'

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
        iconCls: '/static/home_click.png',
        icon: '/static/home.png',
        children: [
            { path: '/', component: home, name: '首页',hidden:false }  
        ]
    },
    {
        path: '/',
        component: Home,
        iconCls: '/static/md_click.png',
         icon: '/static/md.png',
        name: '门店管理',
        children: [
            {
                path: '/layoutManage',
                component: layoutManage,
                name: '布局管理'
            }
        ]
    },
    {
        path: '/',
        component: Home,
        iconCls: '/static/sp_click.png',
        icon: '/static/sp.png',
        name: '商品管理',
        children: [
            { path: '/goodsMgtList', component: goodsMgtList, name: '商品管理' },
            { path: '/goodsMgtNew', component: goodsMgtNew, name: '商品创建',hidden: true },
            { path: '/goodsMgtEdit', component: goodsMgtEdit, name: '商品更新',hidden: true },
            { path: '/goodsMgtOnline', component: goodsMgtOnline, name: '商品上架' },
            { path: '/goodsMgtDataImport', component: goodsMgtDataImport, name: '数据导入' }
        ]
    },
    {
        path: '/',
        component: Home,
        iconCls: '/static/ad_click.png',
        icon: '/static/ad.png',
        name: '广告管理',
        children: [
            { 
                path: '/bindDisplayData/viewTwoimgs', 
                component: bindDisplayData,
                name: '素材绑定',
                children:[
                  {path:'/bindDisplayData/viewTwoimgs',component:viewTwoimgs,name: '轮播图',hidden: true},
                  {path:'/bindDisplayData/viewTwovideo',component:viewTwovideo,name: '商品',hidden: true},
                ]
            },
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
