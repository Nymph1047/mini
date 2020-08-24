// pages/goods_list/index.js

// 用户上滑页面 滚动条触底 开始加载下一页数据
// 1 找到滚动条触底事件
// 2 判断还有没有下一页数据
//      1获取到总页数
//      2获取到当前的页码
//      3判断一下 当前的页码是否大于等于 总页数
// 3 假如没有下一页数据 弹出一个提示
// 4 假如还有下一页数据 加载下一页数据
//         1当前页面 ++
//         2重新发送请求
//         3数据请求回来 要对data中的数组 进行 拼接 而不是替换

import {request} from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },

  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    this.QueryParams.cid=options.cid
    this.getGoodsList()
  },
  // 获取商品列表数据
  async getGoodsList(){
    const res= await request({url:"/goods/search",data:this.QueryParams});
    // 获取总条数
    const total = res.data.message.total;
    // 计算总页数
    this.totalPages = Math.ceil( total/this.QueryParams.pagesize);
    this.setData({
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },
// 标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData(
        {
          tabs
        }
    )
  },
  // 页面上滑 滚动条触底事件
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      goodsList:[]
    })
    this.QueryParams.pagenum = 1;
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.QueryParams.pagenum>=this.totalPages){
      // 没有数据
      wx.showToast({
        title: '没有数据了'
      })
    }else{
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
