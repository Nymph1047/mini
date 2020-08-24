// pages/category/index.js

import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧商品
    rightContent:[],
    // 接口的返回数据
    Cates:[],
    // 当前左侧菜单的索引
    currentIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 小程序中也是存在本地存储技术
    const Cates = wx.getStorageSync('cates');
    if (!Cates){
      this.getCates()
    }else{
      if (Date.now()-Cates.time>1000*10){
        this.getCates();
      }else {
        this.Cates=Cates.data
        // 构造左侧的数据
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        // 构造右侧
        let rightContent = this.Cates[0].children

        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
 async getCates(){
    // request({url:"/categories"}).then(res=>{
    //   this.Cates = res.data.message
    //
    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})
    //
    //   // 构造左侧的数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   // 构造右侧
    //   let rightContent = this.Cates[0].children
    //
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
   const res = await request({url:"/categories"});
     this.Cates = res.data.message

     // 把接口的数据存入到本地存储中
     wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})

     // 构造左侧的数据
     let leftMenuList = this.Cates.map(v=>v.cat_name);
     // 构造右侧
     let rightContent = this.Cates[0].children

     this.setData({
       leftMenuList,
       rightContent
     })
  },

  // 左侧菜单的点击事件
  handleItemTap(e){
    // 获取被点击标题身上的索引
    // 给data中的currentIndex赋值就可以了
    // 根据不同的索引来渲染右侧的商品内容
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex:index,
      rightContent
    })
  }
})
