// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    password:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleInput(e){
   
    let {type}=e.currentTarget.dataset;
    let {value}=e.detail
    this.setData({
      [type]:value
    })
  },
  async login(){
    let {phone,password}=this.data
    if(!phone.trim()){
     return wx.showToast({
        title:"手机号不能为空",
        icon:"none"
      })
    }
    
    let phoneReg=/^1[3-9]\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title:"手机号输入错误",
        icon:"none"
      })
      return
    }
    if(!password.trim()){
      return wx.showToast({
         title:"密码不能为空",
         icon:"none"
       })
     }
     const res=await request("/login/cellphone",{phone,password,isLogin:true})
     
     if(res.code===200){
      wx.showToast({
        title:"登录成功",
        duration:1500
      })
      wx.setStorageSync('userInfo', JSON.stringify(res.profile))
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
      // wx.navigateBack({
      //   delta: 1
      // })
     
     }else{
      //  this.setData({
      //    phone:"",
      //    password:""
      //  })
       
       return wx.showToast({
        title:res.message,
        icon:"none"
        
      })
     }
    
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