// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommends: [],
    topList: [],
    current:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBanners();
    this.getRecommends()
    this.getTopList()
  },
  goRecommend(){
    wx.navigateTo({
      url:"/pages/recommendSong/recommendSong"
    })
  },
  swiperChange(e){
    const {current}=e.detail
    this.setData({current})
  },
  async getBanners() {
    const {banners}=await request('/banner',{type:2})
    this.setData({banners})
    
  },
  async getRecommends() {
    const {result:recommends}=await request("/personalized",{limit:10})
    this.setData({recommends})
    
  },
  async getTopList() {
    let index = 0
    let topList = []
    while (index < 5) {
      const { playlist: topListData } = await request('/top/list', { idx: index++ })
      let topListItem = {
        name: topListData.name,
        tracks: topListData.tracks.slice(0, 3)
      }
      topList.push(topListItem)

    }
    this.setData({
      topList
    })
    


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