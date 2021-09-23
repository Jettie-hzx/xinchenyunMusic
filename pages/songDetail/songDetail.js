// pages/songDetail/songDetail.js
import PubSub from "pubsub-js"
import requset from "../../utils/request"

const appInstance=getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    id: "",
    picUrl: "",
    songUrl: "",
    title: "",
    author: "",
    liveTime:"",
    duration:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取页面传参
    this.getSongDetail()
    
    appInstance.musicId===this.data.id?
      this.setData({isPlay:appInstance.isMusicPlay}):
      appInstance.countPlay=0
   
    //console.log(appInstance.isMusicPlay,appInstance.countPlay);
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    //判断进入的页面是否跟上次一致来确定是否需要自动播放
    
    
    if(!appInstance.countPlay++){
      //若退出songDetail再重进播放的是同亿歌曲无需重复发请求
      await this.getSongPlay(this.data.id)
      //保存2次若为同一首歌的url
      appInstance.songUrl=this.data.songUrl
      this.handleMusicPlay()
    }
    this.setMusicInstance()
    /**
     * 监视系统背景下播放暂停回调
     */
     this.backgroundAudioManager.onPause(()=>this.changePlayState(false))
     this.backgroundAudioManager.onPlay(()=>{
      this.changePlayState(true)
      appInstance.musicId=this.data.id
    })
    this.backgroundAudioManager.onStop(()=>this.changePlayState(false))
    this.backgroundAudioManager.onEnded(()=>{
      this.changePlayState(false)
      // this.handleSwitch("next")
    })
  },
  //获取上个页面传递的音乐详情
  getSongDetail() {
    const eventChannel = this.getOpenerEventChannel()

    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('sendSongDetail', data => {
      //console.log(data);
      const musicInfo=data.data
      this.setMusicInfo(musicInfo)
    })
  },
  setMusicInfo(musicInfo){
    let picUrl = musicInfo.album.picUrl
    let {id,artists,name:title} = musicInfo
    
    let author = ""
    artists.length == 1?author = artists[0].name
    :author = artists[0].name + "/" + artists[1].name
    wx.setNavigationBarTitle({title})
    this.setData({
      picUrl,
      author,
      id,
      title
    })
  },
  setMusicInstance(){

    this.backgroundAudioManager.src = this.data.songUrl || appInstance.songUrl
    this.backgroundAudioManager.title = this.data.title
    this.backgroundAudioManager.coverImgUrl = this.data.picUrl
    this.backgroundAudioManager.singer = this.data.author
  },
  //修改播放状态的功能函数
  changePlayState(isPlay){
    this.setData({isPlay})
    appInstance.isMusicPlay=isPlay
    
  },
  // 控制音乐播放暂停回调
  handleMusicPlay() {
    let isPlay = this.data.isPlay
    this.musicControl(isPlay)
  },
  //控制音乐播放暂停的功能函数
  musicControl(isPlay) {
    isPlay ? this.backgroundAudioManager.pause() : this.backgroundAudioManager.play()
  },
  //点击切换歌曲的回调
  handleSwitch(e){
    
    const type=e.currentTarget.id
    //backgroundAudioManager.stop()
    PubSub.subscribe("musicInfo",async (_,musicInfo)=>{
      this.setMusicInfo(musicInfo)
      await this.getSongPlay(musicInfo.id)
      this.setMusicInstance()
      this.handleMusicPlay()
      PubSub.unsubscribe("musicInfo")
    })
    //发布消息给recommend页面
    PubSub.publish("switchType",type)
  },
  //获取音乐链接
  async getSongPlay(id) {
    const res = await requset("/song/url", { id })
    let songUrl = res.data[0].url
    //console.log(res);
    this.setData({
      songUrl
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