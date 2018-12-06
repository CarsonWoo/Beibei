// pages/home/word/word_detail/word_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    note: false,
    isShowDialog: false,
    show_choice: false,
    edit_choice: '英文释义',
    edit_choices: ['英文释义', '中文释义', '语境句子', '其它例句', '其它'],
    isShowVideo: false,
    meaningList: [],
    isPassClick: false,
    video_info: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wrongCount = options.wrongCount
    var word_id = options.word_id
    this.setData({
      wrongCount: wrongCount,
      word_id: word_id
    })

    this.loadData(word_id)
  },

  getToken: function() {
    wx.login({
      success: (res) => {
        var code = res.code
        wx.getUserInfo({
          success: (res_user) => {
            // var token = null
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
                console.log(res.data)
                var token = res.data.data
                // console.log("token = " + token)
                // this.globalData.token = token
                wx.setStorageSync('token', token)
                app.globalData.token = token
                this.loadData(this.data.word_id)
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
                console.log("test point")
                var token = res.data.data
                // console.log(token)
                // console.log(this)
                // this.globalData.token = token
                wx.setStorageSync('token', token)
                app.globalData.token = token
                this.loadData(this.data.word_id)
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

  loadData: function(word_id) {
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    wx.request({
      url: HOST + '/home/word_card.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        word_id: word_id
      },
      success: (res) => {
        // console.log(res.data)
        if (res.data.status == 200) {
          var data = res.data.data
          var meaning_list = data.meaning.trim().split("；")
          var list = []
          var j = 0
          var reg = "^[a-zA-Z]+$"
          for (let s in meaning_list) {
            var start = meaning_list[s].trim().substring(0, 1)
            let b = meaning_list[s].trim().startsWith("a") || meaning_list[s].trim().startsWith("n") || meaning_list[s].trim().startsWith("p") || meaning_list[s].trim().startsWith("v") || meaning_list[s].trim().startsWith("c") || meaning_list[s].trim().startsWith("i")
            if (!b) {
              if (list.length > 0) {
                var tmp = list[j - 1]
                list.splice(j - 1, 1)
                list.push(tmp + "；" + meaning_list[s].trim())
              }
            } else {
              j++
              list.push(meaning_list[s].trim())
            }
          }
          this.loadState(HOST, token)
          this.setData({
            sentence: data.sentence,
            sentence_audio: data.sentence_audio,
            sentence_cn: data.sentence_cn,
            word_symbol: data.phonetic_symbol_us,
            pronunciation_us: data.pronunciation_us,
            pic: data.pic,
            phrase: data.phrase,
            meaning: data.meaning,
            word: data.word,
            video_info: data.video_info,
            paraphrase: data.paraphrase,
            meaningList: list,
            basic_meaning: list[0]
          })
          this.loadVideoInfo(data.video_info)
          this.playSound(data.pronunciation_us)
        } else {
          if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
            this.getToken()
          }
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  loadState: function(HOST, token) {
    wx.request({
      url: HOST + '/home/show_word_note.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        word_id: this.data.word_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          var data = res.data.data
          console.log(res)
          var b
          if (data != '暂时未添加笔记!') {
            b = true
          } else {
            b = false
          }
          this.setData({
            note: b
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  loadVideoInfo: function(videoInfo) {
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    for (let i = 0; i < videoInfo.length; i++) {
      var id = videoInfo[i].id
      wx.request({
        url: HOST + '/home/get_subtitles.do',
        method: 'POST',
        data: {
          'video_id': id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        success: (res) => {
          videoInfo[i]['subtitles'] = res.data.data
          this.data.video_info = videoInfo
        },
        fail: (res) => {

        }
      })
    }
  },
  
  onNoteTap: function(event) {
    wx.navigateTo({
      url: 'edit_note/edit_note?word=' + this.data.word + '&word_id=' + this.data.word_id + '&word_symbol=' + this.data.word_symbol
    })
  },

  bindTextAreaBlur: function(e) {
    this.setData({
      text_area_text: e.detail.value
    })
  },

  onSubmitTap: function(event) {
    var index = 0
    for (let i in this.data.edit_choices) {
      if (this.data.edit_choices[i] == this.data.edit_choice) {
        index = i
        break
      }
    }
    wx.request({
      url: app.globalData.HOST + '/home/error_correction.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      data: {
        type: index,
        text: this.data.text_area_text,
        word_id: this.data.word_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 500
          })
          this.onCloseDialog()
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
    console.log(this.data.text_area_text)
  },

  playSound: function (url) {
    // console.log("playSound")
    var ctx = this.audioCtx
    if (ctx) {
      ctx.stop()
      ctx.src = url
      // audioCtx.autoPlay = true
      ctx.play()
    }
    
  },

  onPronunciationTap: function (event) {
    this.playSound(this.data.pronunciation_us)
  },

  onSentenceAudioTap: function (event) {
    this.playSound(this.data.sentence_audio)
  },

  onSampleSentenceTap: function (event) {
    let id = event.currentTarget.id
    let audio_url = this.data.video_info[id].sentence_audio
    this.playSound(audio_url)
  },

  onVideoTap: function (event) {
    // console.log("onVideoTap")
    let id = event.currentTarget.id
    var video_url = this.data.video_info[id].video
    var video_poster = this.data.video_info[id].img

    var sub_titles = this.data.video_info[id].subtitles
    // console.log(this.data.video_info)
    if (!video_url || video_url == undefined) {
      wx.showToast({
        title: '视频地址有误...试试其他吧~',
        icon: 'loading',
        duration: 500
      })
      setTimeout(this.onVideoEnd, 1000)
    } else {
      if (!sub_titles || sub_titles == undefined || sub_titles[0] == undefined) {
        sub_titles = [{
          cn: '暂无字幕',
          en: ''
        }]
      }

      this.setData({
        isShowVideo: true,
        video_url: video_url,
        video_poster: video_poster,
        current_video_id: id,
        sub_titles: sub_titles,
        cn: sub_titles[0].cn,
        en: sub_titles[0].en
      })
    }
    
  },

  onVideoEnd: function (event) {
    var id = this.data.current_video_id
    id++
    console.log(id)
    if (id < this.data.video_info.length) {
      // console.log('id = ' + id)
      setTimeout(this.playNext, 1500)
    } else {
      setTimeout(this.onCloseVideo, 1500)
      // this.onCloseVideo()
    }
  },

  playNext: function () {
    let id = this.data.current_video_id
    console.log("id = " + id)
    id++
    let video_url = this.data.video_info[id].video
    let video_poster = this.data.video_info[id].img
    let sub_titles = this.data.video_info[id].subtitles
    
    if (!sub_titles || sub_titles == undefined || sub_titles[0] == undefined) {
      sub_titles = [{
        cn: '暂无字幕',
        en: ''
      }]
    }

    this.setData({
      current_video_id: id,
      video_url: video_url,
      video_poster: video_poster,
      sub_titles: sub_titles,
      cn: sub_titles[0].cn,
      en: sub_titles[0].en
    })
  },

  onCloseVideo: function (event) {
    this.setData({
      isShowVideo: false
    })
  },

  onVideoUpdate: function (event) {
    var current = event.detail.currentTime
    if (this.data.sub_titles.length > 0) {
      var endTime = this.data.sub_titles[0].et
      //转化成秒再比较
      current = Math.floor(current * 1000)
      if (current >= endTime) {
        var sub_titles = this.data.sub_titles
        sub_titles.splice(0, 1)
        if (sub_titles.length > 0) {
          this.setData({
            sub_titles: sub_titles,
            cn: sub_titles[0].cn,
            en: sub_titles[0].en
          })
        }
      }
    }
  },

  onNextTap: function (event) {
    wx.navigateBack({
      success: () => {
      }
    })
  },

  onPassTap: function (event) {
    this.setData({
      isPassClick: true
    })
    wx.navigateBack({
      success: () => {

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createInnerAudioContext()

    this.videoCtx = wx.createVideoContext('my_video')


    var canvasCtx = wx.createCanvasContext('selector_id')

    canvasCtx.setFillStyle("#5ee1c9")

    canvasCtx.beginPath()

    canvasCtx.moveTo(3, 6)

    canvasCtx.lineTo(10.5, 12)

    canvasCtx.lineTo(18, 6)

    canvasCtx.fill()

    canvasCtx.draw()

  },

  onShowDialog: function (event) {
    this.setData({
      isShowDialog: true,
    })
  },

  onShowChoice: function (event) {
    this.setData({
      show_choice: true,
    })
  },


  onCloseDialog: function (event) {
    this.setData({
      isShowDialog: false,
    })
  },

  onCloseChoice: function (event) {
    // console.log(event)
    this.setData({
      show_choice: false,
    })
  },

  onSelectText: function (event) {
    // console.log(event)
    var text = event.currentTarget.dataset.selected
    // console.log(text)
    this.setData({
      show_choice: false,
      edit_choice: text,
    })
  },

  onFullScreenChange: function (event) {
    console.log(event.detail)
    if (event.detail.orientation == 'horizontal') {
      this.setData({
        fullScreen: true
      })
    } else {
      this.setData({
        fullScreen: false
      })
    }
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
    var pages = getCurrentPages()
    var beforePage = pages[pages.length - 2]
    if (!this.data.isPassClick) {
      if (this.data.wrongCount > 0) {
        beforePage.onCurrentToLast()
      } else {
        beforePage.toRefresh()
      }
    } else {
      beforePage.onPassTap()
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

  }
})