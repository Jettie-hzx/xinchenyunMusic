import PubSub from "pubsub-js";
import {getRecommendSong} from "../../utils/request"

// pages/recommendSong/recommendSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    index: 0,
    recommondSongs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',

        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',

          });
        }
      });
    }

    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.getRecommendSong()
    //订阅来自songDetail页面发布的消息
    PubSub.subscribe("switchType", (_, type) => {
      let { recommondSongs, index } = this.data
      const length = recommondSongs.length
      if (type === "pre") {
        (index === 0) && (index = length)
        index--
      } else {
        (index === length - 1) && (index = -1)
        index++
      }

      this.setData({ index })
      let musicId = recommondSongs[index].id

      PubSub.publish("musicId", musicId)
    })
  },
  async getRecommendSong() {
    const res = await getRecommendSong()
    //console.log(res);
    const recommondSongs = res.recommend.map(item => {
      return {
        id: item.id,
        artists: item.artists,
        name: item.name,
        album: item.album,
        duration: item.duration
      }
    })
    this.setData({ recommondSongs })
  },
  showPopup() {
    console.log(1);
  },
  toSongDetail(e) {

    const { id, index } = e.currentTarget.dataset
    this.setData({ index })
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?id=${id}`,
      // success: (res) => {
      //   res.eventChannel.emit("sendSongDetail", {
      //     data: item
      //   })
      // }
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