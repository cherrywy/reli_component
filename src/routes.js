import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import home from './views/home/home.vue'
import LayoutManagement from './views/StoreManagement/LayoutManagement.vue'
import GoodsManagement from './views/GoodsManagement/GoodsManagement.vue'
import GoodsShelves from './views/GoodsManagement/GoodsShelves.vue'
import MaterialBind from './views/AdManagement/MaterialBind.vue'
import AdMachineManagement from './views/AdManagement/AdMachineManagement.vue'

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
        children: [
            { path: '/', component: home, name: '首页',hidden:true },
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '门店管理',
        children: [
            { path: '/LayoutManagement', component: LayoutManagement, name: '布局管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商品管理',
        children: [
            { path: '/GoodsManagement', component: GoodsManagement, name: '商品管理' },
            { path: '/GoodsShelves', component: GoodsShelves, name: '商品上架' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '广告管理',
        children: [
            { path: '/MaterialBind', component: MaterialBind, name: '素材绑定' },
            { path: '/AdMachineManagement', component: AdMachineManagement, name: '广告机管理' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;