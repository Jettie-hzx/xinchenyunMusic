// pages/songDetail/songDetail.js
import PubSub from "pubsub-js"
import moment from "moment-js"
import {getSongDetail,getSongPlay,getLyric} from "../../utils/request"

const appInstance=getApp().globalData
let canMove=true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    id: "",
    picUrl: "",
    songUrl: "",
    title:"",
    author: "",
    liveTime:"00:00",
    duration:"00:00",
    currentWidth:0,
    showLyric:false,
    lyricText:[],
    lyricTime:[],
    currentIndex:0,
    scrollTop:300
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let id=options.id
    this.setData({
      id
    })
 
    await this.getSongDetail(id)
    //this.getSongDetail(id)
    appInstance.musicId===this.data.id?
      this.setData({isPlay:appInstance.isMusicPlay}):
      appInstance.countPlay=0
   
    //console.log(appInstance.isMusicPlay,appInstance.countPlay);
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    //判断进入的页面是否跟上次一致来确定是否需要自动播放
    if(!appInstance.countPlay++){
      //若退出songDetail再重进播放的是同亿歌曲无需重复发请求
     //console.log("fsdfsfsfs");
    await this.getSongPlay(this.data.id)
    //this.getSongPlay(this.data.id)
     this.getLyric(id)
      //保存2次若为同一首歌的url
      appInstance.songUrl=this.data.songUrl
      this.setMusicInstance()
      this.handleMusicPlay()
      //backgroundAudioManager设置src就会自动播放，要放在判断里面
      
    }
    this.watchBackAudio()
  },
  /**
     * 监视系统背景下播放暂停回调
     */
  watchBackAudio(){
    this.backgroundAudioManager.onPause(()=>this.changePlayState(false))
    this.backgroundAudioManager.onPlay(()=>{
     this.changePlayState(true)
     appInstance.musicId=this.data.id
   })
   this.backgroundAudioManager.onStop(()=>this.changePlayState(false))
   this.backgroundAudioManager.onTimeUpdate(()=>{
     let currentTime=this.backgroundAudioManager.currentTime
     
     let liveTime=moment(this.backgroundAudioManager.currentTime).format("mm:ss")
     let currentWidth=this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*520
     let {lyricTime,scrollTop,currentIndex}=this.data
     if(currentTime>lyricTime[currentIndex]){
        currentIndex++
        scrollTop-=70
     }
     
     this.setData({
       liveTime,
       currentWidth,
       currentIndex,
       scrollTop
     })
   });
   this.backgroundAudioManager.onEnded(()=>{
     //this.changePlayState(false)
     this. pubsubMsg("next")
     
   })
  },
  //修改播放状态的功能函数
  changePlayState(isPlay){
    console.log("状态改变"+isPlay);
    this.setData({isPlay})
    appInstance.isMusicPlay=isPlay
    
  },
  
  async getSongDetail(id) {
      const res=await getSongDetail(id)
      let musicInfo=res.songs[0]
      //console.log(musicInfo);
      
      this.setMusicInfo(musicInfo)
    
  },
  //设置音乐信息
  setMusicInfo(musicInfo){
    let picUrl = musicInfo.al.picUrl
    let {ar,name:title} = musicInfo
    let duration=moment(musicInfo.dt/1000).format("mm:ss")
    let author = ""
    ar.length == 1?author = ar[0].name
    :author = ar[0].name + "/" + ar[1].name
    wx.setNavigationBarTitle({title})
    this.setData({
      picUrl,
      author,
      duration,
      title,
      liveTime:"00:00",
      currentWidth:0,
      currentIndex:0,
      scrollTop:300
    })
  },
  //设置音乐播放实例
  setMusicInstance(){
    const {songUrl,title,picUrl,author} =this.data
    this.backgroundAudioManager.src = songUrl || appInstance.songUrl
    this.backgroundAudioManager.title = title
    this.backgroundAudioManager.coverImgUrl = picUrl
    this.backgroundAudioManager.singer = author
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
    this. pubsubMsg(type)
  },
  pubsubMsg(type){
    
    PubSub.subscribe("musicId",async (_,musicId)=>{
      
      await this.getSongDetail(musicId)
      await this.getSongPlay(musicId)
      this.getLyric(musicId)
      this.setMusicInstance()
      this.handleMusicPlay()
      PubSub.unsubscribe("musicId")
    })
    //发布消息给recommend页面
    PubSub.publish("switchType",type)
  },
  //获取音乐链接
  async getSongPlay(id) {
    const res = await getSongPlay(id)
    let songUrl = res.data[0].url

    this.setData({
      songUrl
    })
  },
  async getLyric(id){
    const res=await getLyric(id)
    let lyric=res.lrc.lyric
    this.lyricFormat(lyric)
    //this.setData({lyric})
    
  },
  showLyric(){
    let showLyric=!this.data.showLyric
    this.setData({showLyric})
  },
  lyricFormat(lyric){
    let reg = /[\[|[0-9\:\.]|]]/gi; // 正则匹配去除 []
    let res= lyric.replace(reg, "");
   
    let lyricText=res.split("]").slice(1)
    
    var reg2 = /\[(.+?)\]/g; // 正则匹配出时间
    let lyricTime =lyric.match(reg2); // match 选中匹配成功的内容
    for (let i = 0; i < lyricTime.length; i++) {
      lyricTime[i] = lyricTime[i].slice(1, 9); // slice 截取
      lyricTime[i] =
        parseFloat(lyricTime[i].slice(0, 2), 2) * 60 +
        parseFloat(lyricTime[i].slice(3, 8), 2); // 截取分秒计算秒数
    }
    this.setData({
      lyricText,
      lyricTime:lyricTime.slice(1)
    })
  },
  sliderChange(e){
    
    let currentWidth=e.detail.value
    // this.backgroundAudioManager.onTimeUpdate(()=>{
      this.setData({
        currentWidth
        })
    // });
    
    let currentTime=currentWidth*this.backgroundAudioManager.duration/520
    let liveTime=moment(currentTime).format("mm:ss")
    let {lyricTime}=this.data
    let index=lyricTime.findIndex(item=>item > currentTime)-1
    
    this.setData({
     
      currentIndex:index,
      scrollTop:300-70*index,
      liveTime
    })
     
    this.backgroundAudioManager.seek(currentTime)
    
  },
  //太过频繁，进行节流
  sliderChanging(e){
    //为了一开始就能执行一次
    if(canMove){
      this.sliderChange(e)
     
    }else{
      return
    }
    canMove=false
    setTimeout(()=>{
      canMove=true
    },250)
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