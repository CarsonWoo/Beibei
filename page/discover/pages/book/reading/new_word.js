// pages/discover/book/reading/new_word.js
const app = getApp()
// const audioCtx = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty_image: 'https://file.ourbeibei.com/l_e/static/mini_program_icons/ic_loading_new_word.png',
    empty_text: '听说，新单词大军即将出现！\nloading...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = options.page
    let isCurrentChapter = options.isCurrentChapter
    this.audioCtx = wx.createInnerAudioContext()
    if (page != undefined) {
      var book_id = options.bookId
      var chapter_id = options.chapterId
      var chapter_order = options.chapter
      var end_chapter_id = options.end_chapter_id
      //点击发现页或阅读页的阅读下一章和开始阅读新章节可以点进来
      this.setData({
        fromPage: page,
        isCurrentChapter: isCurrentChapter,
        chapter_order: chapter_order,
        book_id: book_id,
        chapter_id: chapter_id,
        end_chapter_id: end_chapter_id
      })
      this.loadChapterData(book_id, chapter_id)
    } else {
      //从我的书单点进来 获取全部新单词信息
      var book_id = options.book_id
      // console.log(book_id)
      this.loadData(book_id)
    }
  },

  loadData: function(book_id) {
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    wx.request({
      url: HOST + '/various/getBookNewWord.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        book_id: book_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res)
          var chapter_list = res.data.data
          if (chapter_list != undefined) {
            chapter_list = chapter_list.reverse()
          }
          this.setData({
            chapter_list: chapter_list
          })
          let empty_text = this.data.empty_text

          if (chapter_list.length == 1 && chapter_list[0].length == 0) {
            empty_text = '所读章节没有新单词噢~'
          } else {
            empty_text = '你还没有读过这本书噢，去读吧~'
          }

          this.setData({
            empty_text: empty_text
          })
          
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken(book_id)
        }
      },
      fail: (res) => {
        console.log("请求失败：\n" + res)
      }
    })
  },

  loadChapterData: function(book_id, chapter_id) {
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    console.log("book_id = " + book_id + " chapter_id = " + chapter_id)
    wx.request({
      url: HOST + '/various/getBookChapterNewWord.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        book_id: book_id,
        chapter_id: chapter_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res)
          var chapter_list = []
          var word_list = res.data.data
          console.log(word_list)
          if (word_list != undefined && word_list.length != 0) {
            word_list[0]['order'] = this.data.chapter_order
          }
          chapter_list.push(word_list)
          this.setData({
            chapter_list: chapter_list
          })
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken(book_id, chapter_id)
        }
      },
      fail: (res) => {
        console.log("失败：\n" +res)
      }
    })
  },

  getToken: function (book_id, chapter_id) {
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
                  if (chapter_id != undefined) {
                    this.loadChapterData(book_id, chapter_id)
                  } else {
                    this.loadData(book_id)
                  }
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
                if (chapter_id != undefined) {
                  this.loadChapterData(book_id, chapter_id)
                } else {
                  this.loadData(book_id)
                }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  onReading: function(e) {
    console.log(this.data.book_id)
    
    wx.redirectTo({
      url: 'reading?page=new_word&bookId=' + this.data.book_id + '&chapterId=' + this.data.chapter_id + '&isCurrentChapter=' + this.data.isCurrentChapter + '&end_chapter_id=' + this.data.end_chapter_id
    })
  },

  onAudioTap: function(e) {
    // let audioCtx = this.audioCtx
    let url = e.currentTarget.dataset.audio
    console.log(url)
    this.audioCtx.src = url
    this.audioCtx.play()
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
    if (this.audioCtx) {
      this.audioCtx.destroy()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '【语境阅读】每天五分钟，名著收囊中',
      path: 'page/tabBar/discover/discover',
      imageUrl: 'https://file.ourbeibei.com/l_e/share_pic/share_img_book_sign.jpg'
    }
  }
})