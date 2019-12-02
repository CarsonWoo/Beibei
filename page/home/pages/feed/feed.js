// pages/home/feed/feed.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    location:0,
    scrollviewheight:1334,
    btn_share:app.globalData.FTP_ICON_HOST+"btn_share_feed.png",
    ic_like_check: app.globalData.FTP_ICON_HOST + "ic_like_feed_check.png",
    ic_like_normal: app.globalData.FTP_ICON_HOST + "ic_like_feed_normal.png",
    isLike:false,
    likeNumber:0,
    favourAnimation:'',//点击喜欢按钮的动画
    img_top_banner:"../../../../images/bg_prize.png",
    articleList:[],
    isShowBanner:true,
    bannerPic:'',
    bannerUrl:'',//banner点击跳转的页面,
    isShowBottomToastButton:false,
    articleList: [],
    swiperCircular: false,
    isPageEnd: false,
    swiperCurrent:0,
    isTapLikeBtn:false,
    isCollectFormId:true,
    from_sign_page:false, //是否为打卡页查看原文跳转
  },
 

  // onLikeTap: function (event) {
  //   let that = this;
  //   console.log("tap")
  //   console.log(this.data.id)
  //   wx.request({
  //     url: app.globalData.HOST + '/home/like_feeds.do',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'token': app.globalData.token
  //     },
  //     method: 'POST',
  //     data: {
  //       id: this.data.id
  //     },
  //     success: (res) => {
  //       console.log(res)
  //       if (res.data.status == 200) {
  //         that.setData({
  //           isLike:true
  //         })
  //         wx.showToast({
  //           title: '点赞成功',
  //           duration: 800
  //         })
  //       }
  //     },
  //     fail: (res) => {
  //       console.log(res)
  //     }
  //   })
  // },

  

  getToken: function () {
    wx.login({
      success: (res) => {
        var code = res.code
        wx.getUserInfo({
          success: (res_user) => {
            // var token = null
            // console.log("in")
            wx.request({
              url: app.globalData.HOST + '/user/wx_login.do',
              data: {
                code: code,
                username: res_user.userInfo.nickName,
                gender: res_user.userInfo.gender,
                portrait: res_user.userInfo.avatarUrl
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: (res) => {

                if (res.data.status == 200) {

                  console.log(res.data)
                  var token = res.data.data
                  wx.setStorage({
                    key: 'token',
                    data: token,
                  })
                  app.globalData.token = token
                  this.loadData()
                }
                else {
                  console.log("登录失败" + res.data.msg)
                }

              },
              fail: (res) => {
                console.log("request fail")
              }
            })
            // this.globalData.token = token
          },
          fail: () => {
            // var token = null
            wx.request({
              url: app.globalData.HOST + '/user/wx_login.do',
              data: {
                code: code,
                username: null,
                gender: null,
                portrait: null
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: (res) => {
                console.log(res.data)
                // console.log("test point")
                var token = res.data.data
                wx.setStorage({
                  key: 'token',
                  data: token,
                })
                app.globalData.token = token
                this.loadData()
              },
              fail: (res) => {
                console.log("getUserInfo Fail && request Fail")
              }
            })
            // console.log(token)
            // this.globalData.token = token
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var location = options.location
    var share_tap = options.share_tap //判断用户是否为分享链接进入feed
    var next_index = options.next_index
    var is_end = options.is_end
    var is_hot = options.is_hot
    var from_sign_page = options.from_sign_page
    console.log(from_sign_page)
    this.setData({
      id: id
    })
    if (location != null && location != undefined) {
      this.setData({
        location: location
      })
    }
    if (share_tap != null && share_tap != undefined){
      if(share_tap ==='1'){
        this.setData({
          isShowBottomToastButton:true
        })
      }
    }
    if(is_hot != null && is_hot != undefined){
      if(is_hot === '1'){
        this.setData({
          isCollectFormId:true
        })
      }
    }
    if(from_sign_page!=null && from_sign_page!=undefined){
      this.setData({
        from_sign_page:from_sign_page
      })
    }
    
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollviewheight:res.windowHeight*2,
        })
      }
    })
    if(next_index!=null&&next_index!=undefined){
      console.log(next_index)
      var article_list =  wx.getStorageSync("article_list")
      this.setData({
        articleList:article_list,
        swiperCurrent:next_index
      })
    }
    if (is_end != null && is_end!= undefined ){
      this.setData({
        isPageEnd : true,
        swiperCircular : true
      })
    }
    this.loadData()
  },


  loadData: function() {
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/home/article_detail.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        id: this.data.id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          var data = res.data.data
          console.log(data)
          this.setData({
            author_portrait: data.author_portrait,
            pic: data.pic,
            title: data.title,
            author_username: data.author_username,
            order: data.order,
            isLike:data.is_favour,
            likeNumber: data.favours,
            isShowBanner:data.banner===1?true:false,
            bannerPic:data.banner===1?data.banner_pic:'',
            bannerUrl:data.banner===1?'/'+data.banner_href:'',
          })
          if(this.data.from_sign_page){
            this.setData({
              isShowBanner:false
            })
          }
          console.log(this.data.articleList)
          if(JSON.stringify(this.data.articleList)=="[]"){
            console.log("hhh")
            this.setData({
              articleList:data.recommendations
            })
          }
          // var data = res.data.data
          // var that = this
          // for (var i = 0; i < data.order.length-1;i++){
          //   wx.getImageInfo({
          //     src: data.order[i + 1].pic,
          //     success: function (res) {
          //       var scrollviewheight = that.data.scrollviewheight+res.height/1.5
          //       // console.log(res.height)
          //       that.setData({
          //         scrollviewheight:scrollviewheight
          //       })
          //       // console.log(scrollviewheight)
          //     }
          //   })
          // }
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
    var location = this.data.location
    if (location != null && location != undefined) {
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: location,
          duration: 500
        })
      }, 300)
    }
  },
  onSwiperChange: function (event) {
    // console.log(event.detail.current)
    let self = this;
    let current = event.detail.current
    let length = this.data.articleList.length
    console.log("current = " + current)
    console.log("length = " + length)

    //未刷新出全部文章时无法循环滚动item
    if (!this.data.isPageEnd) {
      this.setData({
        swiperCircular: false
      })
    } else {
      this.setData({
        swiperCircular: true
      })
    }

    if (current == length - 3 || current == length -2) {
      var page = parseInt(current / 5) + 2
      console.log(page)
      //到达倒数第二张卡片时加载更多
      if (!self.data.isPageEnd) {
        wx.request({
          url: app.globalData.HOST + '/home/nextRecommendations.do',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': app.globalData.token
          },
          data: {
            page: page
          },
          success(res) {
            console.log(res)
            console.log("ispageend:" +self.data.isPageEnd)
            if (res.data.status == 200) {
              var newList = res.data.data.recommendations
              if (JSON.stringify(newList) == '[]') {
                self.setData({
                  isPageEnd: true
                })
                console.log("null array")
              } else {
                self.mergeNewToOrigin(newList)
              }
            }
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    }
  },

  mergeNewToOrigin(newList) {
    var originList = this.data.articleList;
    for (var i = 0; i < newList.length; i++) {
      originList.push(newList[i])
    }
    this.setData({
      articleList: originList
    })
    var length = originList.length
    console.log(length)

  },

  on999ToastBtnTap(){
    wx.switchTab({
      url: '/page/tabBar/home/home',
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
  },

  onBannerImgTap(){
    console.log(this.data.bannerUrl)
    if(this.data.bannerUrl==='/page/tabBar/home/home'){
      wx.switchTab({
        url: this.data.bannerUrl,
        complete(res){
          console.log(res)
        }
      })
    }else{
      if (this.data.bannerUrl != null && this.data.bannerUrl != undefined){
        wx.navigateTo({
          url: this.data.bannerUrl,
          complete(res){
            console.log(res)
          }
        })
      }else{
        return
      }
    }
  },

  onBannerCloseTap(){
    this.setData({
      isShowBanner:false,
    })
    wx.request({
      url: app.globalData.HOST +'/home/noBanner.do',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
  },
  
  onHotArticleTap:function(event){
    console.log(event.currentTarget.dataset)
    var feed_id = event.currentTarget.dataset.article_id
    var article_index = event.currentTarget.dataset.article_index
    var is_end = this.data.isPageEnd
    wx.setStorageSync("article_list", this.data.articleList)
    if (this.data.isPageEnd && article_index == this.data.articleList.length-1){
      var next_index = 0
    }else{
      var next_index = parseInt(article_index) + 1
    }
    console.log("index :"+article_index)
    if(feed_id!=null&&feed_id!=undefined){
      wx.navigateTo({
        url: '/page/home/pages/feed/feed?id=' +feed_id +'&next_index='+next_index+'&is_end='+is_end+'&is_hot=1',
      })
    }
  },

  onLikeTap(){
    console.log(this.data.id)
    let that = this;

    //抖动动画
    var favourAnimation = wx.createAnimation({
      duration: 800
    })

    favourAnimation.rotate(10).step({
      duration: 160
    })
    favourAnimation.rotate(-10).step({
      duration: 160
    })
    favourAnimation.rotate(5).step({
      duration: 160
    })
    favourAnimation.rotate(-5).step({
      duration: 160
    })
    favourAnimation.rotate(0).step({
      duration: 160
    })
    this.setData({
      isLike:!this.data.isLike,
      likeNumber:this.data.isLike?this.data.likeNumber-1:this.data.likeNumber+1,
      favourAnimation:favourAnimation,
      isTapLikeBtn:true,
    })

    wx.request({
      url: app.globalData.HOST+'/home/favour_feeds.do',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      method:'POST',
      data:{
        'id':that.data.id
      },
      success(res){
        console.log(res)
      },
      fail(res){},

    })
  },

  loadMoreFeed() {
    this.setData({
      articleList: this.data.newList
    })
  },

  onPostChance: function (event) {
    if(!this.data.isCollectFormId){
      return
    }
    // console.log(event.detail.formId)
    let form_id = event.detail.formId
    var token = app.globalData.token
    var HOST = app.globalData.HOST
    wx.request({
      url: HOST + '/various/collect_form_id.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        form_id: form_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log("collect form_id success")
        }
      },
      fail: (res) => {
        console.log(res)
      }
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
    if(this.data.isTapLikeBtn){
      app.globalData.isBackHome = true
    }
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

  // 监听页面滑动
  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    var location = e.scrollTop
    this.setData({
      location: location,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var share_imgs = app.globalData.share_imgs
    var share_texts = app.globalData.share_texts
    var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    var share_img = share_imgs[choose_number]
    var share_text = share_texts[choose_number]
    return {
      title: this.data.title,
      path: 'page/tabBar/home/home?action=onFeedsTap'+'&feed_id=' + this.data.id + '&feed_location=' + this.data.location,
      // imageUrl: share_img,
    }

  }
})