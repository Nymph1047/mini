// pages/cart/index.js
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";


Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  async handleChooseAddress(){
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断 权限状态
      if (scopeAddress === false){
        await openSetting();
      }
      // 调用获取收货地址的api
      const address = await chooseAddress();
      wx.setStorageSync("address", address);
    } catch (e) {
      console.log(e)
    }
    // 获取 权限状态
    // wx.getSetting({
    //   success:(result) =>{
    //     // 获取权限状态 主要发现一些 属性名很怪异的时候 都要使用【】形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success:(result1) => {
    //           console.log(result1)
    //         }
    //       })
    //     }else {
    //       // 用户以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success:(result2) =>{
    //           // 可以调用 收货地址代码
    //           wx.chooseAddress({
    //             success:(result3) => {
    //               console.log(result3)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // });

    // 获取 权限状态

  },

  // 商品的选中
  async handeItemChange(e){
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked =!cart[index].checked;

    this.setCart(cart)
  },

  // 设置购物车状态同时，重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v =>{
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum +=v.num;
      }else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0? allChecked : false;
    this.setData({
      cart,
      totalPrice, totalNum, allChecked
    });
    wx.setStorageSync("cart",cart);
  },

  // 商品的全选功能
  handleItemAllCheck(){
    // 获取data中的数据
    let { cart,allChecked } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked = allChecked);
    // 把修改后的值 填充回data或者缓存中
    this.setCart(cart)
  },

  // 商品数量的编辑功能
 async handleItemNumEdit(e){
    // 获取传递过来的参数
    const { operation , id } = e.currentTarget.dataset;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id === id);
    // 判断是否要执行删除
    if (cart[index].num===1&&operation===-1){
      // 弹窗提示
      // wx.showModal({
      //   title:"提示",
      //   content:"您是否要删除？",
      //   success:(res)=>{
      //     if (res.confirm){
      //       cart.splice(index,1);
      //       this.setCart(cart)
      //     }else if (res.cancel){
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
      const res = await showModal({content:"您是否要删除？"})
      if(res.confirm) {
        cart.splice(index,1);
        this.setCart(cart)
      }
    }else{
      // 进行修改数量
      cart[index].num +=operation;
      // 设置回缓存和data中
      this.setCart(cart)
    }

  },

  // 点击 结算
  async handlePay(){
  // 判断收货地址
    const {address,totalNum} = this.data;
    if (!address.userName){
      await showToast({title:"您还没有选择收货地址"})
      return;
    }
    // 判断有没有选购商品
    if (totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url:'/pages/pay/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    // 计算全选
    // every数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么every方法的返回值为true
    // 只要有一个回调函数返回了false 那么不再循环执行 直接返回false
    // const allChecked =cart.length?cart.every(v=>v.checked):false;
    // let allChecked = true;
    // // 总价格 总数量
    // let totalPrice=0;
    // let totalNum=0;
    // cart.forEach(v=>{
    //   if (v.checked){
    //     totalPrice+=v.num*v.goods_price;
    //     totalNum+=v.num;
    //   }else{
    //     allChecked=false;
    //   }
    // })
    // // 判断数组是否为空
    // allChecked=cart.length!=0?allChecked:false;
    // // 给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
    this.setData({address})
    this.setCart(cart);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
