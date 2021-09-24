import  config  from "./config";

const request= (url,data={},method='GET')=>{
    return new Promise((resolve,reject)=>{
        wx.request({
            url: config.host+url,
            data,
            header: {
                cookie:wx.getStorageSync("cookies")?wx.getStorageSync("cookies").find(item=>item.indexOf('MUSIC_U')!==-1):""
            },
            method,
            success: (res)=>{
                if(data.isLogin){
                    wx.setStorage({
                        key:"cookies",
                        data:res.cookies
                    })
                }
                resolve(res.data)
            },
            fail: (err)=>{
                reject(err)
            },
        });
    })
}
//轮播图
export function getBanner(type){
    return request('/banner',{type})
}
//推荐歌单
export function getRecommends(limit){
    return request("/personalized",{limit})
}
//排行榜
export function getTopList(idx){
    return request('/top/list',{idx})
}

//手机号登陆
export function loginByPhone(phone,password,isLogin=true){
    return request("/login/cellphone",{phone,password,isLogin})
}

//用户播放记录
export function getUserRecentPlayList(uid,type){
    return request('/user/record',{uid,type})
}

//视频标签列表
export function getVideoList(){
    return request("/video/group/list")
}

//视频标签下对应的视频数据
export function getVideoData(id,offset=0){
    return request('/video/group',{id,offset})
}

//每日推荐歌曲，需要携带cookie
export function getRecommendSong(){
    return request("/recommend/songs")
}
//音乐详情
export function getSongDetail(ids){
    return request("/song/detail",{ids})
}
//歌曲播放地址
export function getSongPlay(id){
    return request("/song/url", { id })
}
//歌词
export function getLyric(id){
    return request("/lyric",{id})
}
//默认搜索关键字
export function getSearchDefault(){
    return request("/search/default")
}
//热搜榜
export function getSearchHot(){
    return request("/search/hot/detail")
}

//搜索建议
export function getSearchSuggest(keywords,type){
    return request("/search/suggest",{keywords,type})
}
//搜索
export function getSearch(keywords){
    return request("/search",{keywords})
}