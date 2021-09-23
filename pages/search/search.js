// pages/search/search.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:"",
    hotList:[],
    searchContent:"",
    searchList:[],
    historyList:[],
    isFound:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    
  },
  async getInitData(){
    const placeholderContent = await request("/search/default")
    const hotDetail=await request("/search/hot/detail")
    
    this.setData({
      placeholderContent:placeholderContent.data.showKeyword,
      hotList:hotDetail.data
    })
  },
  handleSearch(e){
    
    //console.log(e.detail.value);
    this.setData({
      searchContent:e.detail.value
    })
    
    this.getSearchInfo()
  },
  async getSearchInfo(){
    let {searchContent}=this.data
    if(!searchContent.trim()){
      this.setData({
        isFound:false,
        searchList:[]
      })
      return
    }
    this.setData({
      isFound:true
    })
    const res=await request("/search/suggest",{keywords:searchContent,type:'mobile'})
    //console.log(res);
    let searchList=res.result.allMatch
    this.setData({
      searchList
      
    })
    
  },

  clearInput(){
    
    this.setData({
      searchContent:"",
      searchContent:[]
    })
  },
  goSingleSong(e){
    const {keyword} =e.currentTarget.dataset
    console.log(keyword);
    wx.navigateTo({
      url: '/pages/singleSong/singleSong',
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