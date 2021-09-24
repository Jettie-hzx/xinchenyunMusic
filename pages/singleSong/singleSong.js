// pages/singleSong/singleSong.js
import PubSub from "pubsub-js"

//import  switchType  from "../../utils/pubsub-mytool"
import {getSearch} from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContent:"",
    singleSongList:[],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {keyword:searchContent}=options
    //console.log(options);
    this.setData({searchContent})
    this.getSingleSong()
   
    //switchType(singleSongList)
    PubSub.subscribe("switchType", (_, type) => {
      let { singleSongList, index } = this.data
      const length = singleSongList.length
      if (type === "pre") {
        (index === 0) && (index = length)
        index--
      } else {
        (index === length - 1) && (index = -1)
        index++
      }

      this.setData({ index })
      let musicId = singleSongList[index].id

      PubSub.publish("musicId", musicId)
    })
  },
  async getSingleSong(){
    const res=await getSearch(this.data.searchContent)
    this.setData({
      singleSongList:res.result.songs
    })
  },
  toSongDetail(e) {

    const { id, index } = e.currentTarget.dataset
    this.setData({ index })
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?id=${id}`
      
    });
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