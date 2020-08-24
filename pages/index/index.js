// 0 发送请求
import { request } from "../../request/index.js";

Page({
    data:{
      // 轮播图数组
        swiperList:[],
        catesList:[],
        floorList:[]
    },
    onLoad: function (options) {
        // 1.发送轮播图请求获取轮播图数据
        // wx.request({
        //     url:"https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
        //     success:(result) =>{
        //         this.setData({
        //             swiperList:result.data.message
        //         })
        //     }
        // })
        this.getSwiperList()
        this.getCateList()
        this.getFloorList()
    },
    // 获取轮播图数据
    getSwiperList(){
        request({url:"/home/swiperdata"}).then(res=>{
            this.setData({
                swiperList:res.data.message
            })
        })
    },
    // 获取分类导航数据
    getCateList(){
        request({url:"/home/catitems"}).then(res=>{
            this.setData({
                catesList:res.data.message
            })
        })
    },

    // 获取楼层数据
    getFloorList(){
        request({url:"/home/floordata"}).then(res=>{
            this.setData({
                floorList:res.data.message
            })
        })
    }
})
