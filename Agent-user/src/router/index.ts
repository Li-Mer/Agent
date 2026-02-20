import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
    {
        //聊天界面  
        path: "/",
        name: "home",
        component: () => import("@/page/home/home.vue")
    },
    {
        //商品详情页
        path: "/goodsDetails",
        name: "goodsDetails",
        component: () => import("@/page/goodsDetails/index.vue")
    },
    {
        //投诉页
        path: "/complaintPage",
        name: "complaintPage",
        component: () => import("@/page/complaintPage/index.vue")
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;