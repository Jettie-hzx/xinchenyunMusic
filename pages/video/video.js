// pages/video/video.js
import {getVideoList,getVideoData} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    currentIndex:0,
    videoList:[],
    videoData:[],
    navId:'',
    scrollLeft:0,
    scrollViewWidth:0,
    videoId:'',
    videoUpdateTime:[],//记录video播放的时长
    //isPlayed:false,
    isTriggered:false,
    offset:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoList()
  },
  
  async getVideoList(){
    const res=await getVideoList()
    
    const videoList=res.data.slice(0,15)
    this.setData({
      videoList,
      navId:res.data[0].id
    })
    this.getVideoData(this.data.navId)
  },
  async getVideoData(navId,offset=0){
    if(!navId) return
    const res=await getVideoData(navId,offset)
    const msg="暂无推荐视频，请稍后再试"
    if(res.msg===msg){
      return wx.showToast({
        title:msg,
        icon:"none"
      })
    }
    wx.hideLoading();
    let newVideoData=res.datas.map(item=>item.data)
    let {videoData}=this.data
    offset?videoData.push(...newVideoData):videoData=newVideoData
    this.setData({
      videoData,
      isTriggered:false
    })

  },
  changeNav(e){
    const {index:currentIndex,navid}=e.currentTarget.dataset;
    let offsetLeft = e.currentTarget.offsetLeft
    this.setData({
      currentIndex,
      navId:navid,
      videoData:[],
      offset:0,
      scrollLeft: offsetLeft - this.data.scrollViewWidth/2
    })
   wx.showLoading({
      title: '正在加载'
     });
    this.getVideoData(this.data.navId)
  },
  handlePlay(e){
    
    let vid=e.currentTarget.id
    this.setData({
      videoId:vid,
      //isPlayed:true
    })
    // this.vid!==vid&&this.videoContext&&this.videoContext.stop()
    // this.vid=vid
    this.videoContext= wx.createVideoContext(vid)
    //this.videoContext.play()
  },
  
  
  // 视频播放记录时间回调
  handleTimeUpdate(e){
    //console.log(e.detail);
  },
  // 下拉刷新回调
  handleScrollRefresh(){
    //this.setData({isTriggered:true})
    this.getVideoData(this.data.navId);
  },
  // 上拉加载
  handleScrolltoLower(){
    let {offset}=this.data

    this.getVideoData(this.data.navId,++offset);
    this.setData({offset})
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
     
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.createSelectorQuery().select('.videoList').boundingClientRect((rect)=>{
      this.data.scrollViewWidth = Math.round(rect.width)
     }).exec()
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