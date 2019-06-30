// pages/discover/book/reading/reading.js
const app = getApp()
const util = require('../../../../../utils/util.js')
// const audioCtx = wx.createInnerAudioContext()
// audioCtx.autoplay = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_playing: false,
    is_big_size: false,
    is_night_on: false,
    is_translate: false,
    // is_sign_current: false,
    is_current_chapter_sign: false,
    is_next_tap: false,
    is_signing: false,
    showDownloadImage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.audioCtx = wx.createInnerAudioContext()
    var page = options.page
    var book_id = options.bookId
    var chapter_id = options.chapterId
    console.log('book_id = ' + book_id)
    console.log('chapter_id = ' + chapter_id)
    var chapter_name = options.chapter_name //第几章 只有从书单里点击进入或者点击下一章button才有显示
    var end_chapter_id = options.end_chapter_id
    var start_chapter_id = options.start_chapter_id
    console.log('end id = ' + end_chapter_id)
    console.log('start id = ' + start_chapter_id)
    this.setData({
      book_id: book_id,
      chapter_id: chapter_id,
      is_sign_current: wx.getStorageSync('is_today_sign_book_finished')
    })
    if (chapter_name != undefined) {
      wx.setNavigationBarTitle({
        title: chapter_name,
      })
      this.setData({
        chapter_name: chapter_name
      })
    }
    if (end_chapter_id != undefined) {
      this.setData({
        end_chapter_id: end_chapter_id
      })
    }
    if (start_chapter_id != undefined) {
      this.setData({
        start_chapter_id: start_chapter_id
      })
    }
    // console.log(page)
    // console.log(chapter_id)
    let isCurrentChapter = options.isCurrentChapter
    let isFirstChapter = options.isFirstChapter
    // console.log(isFirstChapter)
    if (isCurrentChapter != undefined) {
      this.setData({
        isCurrentChapter: isCurrentChapter
      })
    }
    if (isFirstChapter != undefined) {
      this.setData({
        isFirstChapter: isFirstChapter
      })
    }
    if (page != undefined) {
      if (page == 'new_word') {
        //从发现页的开始阅读或阅读下一章点击进入新学单词再进入
        this.setData({
          fromPage: 'new_word'
        })
      } else if (page == 'discover') {
        //从发现页的再次阅读进入
        this.setData({
          fromPage: 'discover'
        })
      }
    } else {
      //从我的书单进入
      this.setData({
        fromPage: 'book_list'
      })
    }
    this.loadData(book_id, chapter_id)
  },

  loadData: function(book_id, chapter_id) {
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    console.log(book_id)
    console.log(chapter_id)
    wx.request({
      url: HOST + '/various/getBookChapterInner.do',
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
        console.log(res)
        if (res.data.status == 200) {
          console.log(res.data.data)
          var data = res.data.data
          var audio = data.chapterMP3
          var book_content = data.chapterInner
          this.setData({
            book_content: book_content,
            audio: audio
          })
          if (audio) {

            this.setData({
              is_playing: true
            })

            // console.log(this.audioCtx)

            this.audioCtx.src = audio
            if (wx.getStorageSync('reading_radio') != null && wx.getStorageSync('reading_radio') != undefined) {
              let radio = wx.getStorageSync('reading_radio')
              if (radio.audio_url == audio && radio.currentTime > 0) {
                if (this.data.fromPage == 'discover' || this.data.fromPage == 'new_word') {
                  console.log('seek')
                  this.audioCtx.seek(radio.currentTime)
                }
              }
            }
            this.audioCtx.play()
            console.log(this.audioCtx.duration)

            this.audioCtx.onStop(() => {
              console.log('onStop')
              //录音清除
              wx.removeStorageSync('reading_radio')
              this.setData({
                is_playing: false,
                currentTime: '00:00',
                slider_value: 0
              })
            })

            this.audioCtx.onEnded(() => {
              console.log('audio end')
              //录音清除
              wx.removeStorageSync('reading_radio')
              this.setData({
                is_playing: false,
                currentTime: '00:00',
                slider_value: 0
              })
            })

            this.audioCtx.onPlay(() => {
              console.log(this.audioCtx.duration)
              this.audioCtx.onTimeUpdate(() => {
                // console.log('in')
                this.audioCtx.currentTime
                this.audioCtx.duration

                // console.log(this.audioCtx.currentTime)
                if (this.data.duration == undefined) {
                  console.log(this.audioCtx.duration)
                  var duration = this.audioCtx.duration
                  duration = parseInt(duration)
                  //拿到的duration是秒数
                  var minutes = parseInt(duration / 60)
                  var seconds = duration % 60
                  if (minutes < 10) {
                    minutes = '0' + minutes
                  }
                  if (seconds < 10) {
                    seconds = '0' + seconds
                  }
                  duration = minutes + ':' + seconds
                  this.setData({
                    duration: duration
                  })
                }
                var currentTime = this.audioCtx.currentTime
                currentTime = parseInt(currentTime)
                var curMinutes = parseInt(currentTime / 60)
                var curSeconds = parseInt(currentTime % 60)
                if (curMinutes < 10) {
                  curMinutes = '0' + curMinutes
                }
                if (curSeconds < 10) {
                  curSeconds = '0' + curSeconds
                }
                currentTime = curMinutes + ':' + curSeconds
                this.setData({
                  currentTime: currentTime,
                  slider_value: this.audioCtx.currentTime * 100 / this.audioCtx.duration
                })
                // console.log(this.audioCtx.duration)
              })
            })



          }
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken('loadData')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.audioCtx = wx.createInnerAudioContext()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.is_playing == false && this.data.is_audio_pause == true) {
      this.audioCtx.play()
      this.setData({
        is_audio_pause: false,
        is_playing: true
      })
    }
  },

  onPlayTap: function(e) {
    this.setData({
      is_playing: !this.data.is_playing
    })
    if (this.audioCtx) {
      console.log('audioCtx != null')
      if (this.data.is_playing == true) {
        console.log('is_playing:true')
        this.audioCtx.play()
      } else {
        this.audioCtx.pause()
      }
    }
  },

  onSizeTap: function(e) {
    this.setData({
      is_big_size: !this.data.is_big_size
    })
  },

  onNightTap: function(e) {
    this.setData({
      is_night_on: !this.data.is_night_on
    })
    if (this.data.is_night_on == true) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#3d4049',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#bff4ea',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    }
  },

  onTranslationTap: function(e) {
    this.setData({
      is_translate: !this.data.is_translate
    })
  },

  onSliderChange: function(e) {
    var slider_value = e.detail.value
    console.log(slider_value)
    var currentTime = slider_value / 100 * this.audioCtx.duration
    console.log(currentTime)
    this.audioCtx.seek(currentTime)
  },

  changeReading: util.throttle(function(e) {
    var tapType = e.currentTarget.dataset.type
    var book_id = this.data.book_id
    var chapter_name = this.data.chapter_name.replace("第", "").replace("章", "")
    chapter_name = parseInt(chapter_name)
    if (tapType == 'former') {
      //点击上一章
      wx.request({
        url: app.globalData.HOST + '/various/getChapterIdByOrderBook.do',
        method: 'POST',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          bookId: book_id,
          order: chapter_name - 1
        },
        success: (res) => {
          console.log(res)
          if (res.data.status == 200) {
            var chapter_id = res.data.data
            var start_chapter_id = this.data.start_chapter_id
            console.log(start_chapter_id)
            console.log(chapter_id)
            chapter_name = '第' + (chapter_name - 1) + '章'
            let isFirstChapter = start_chapter_id == chapter_id ? "true" : "false"
            wx.redirectTo({
              url: 'reading?chapter_name=' + chapter_name + "&chapterId=" + chapter_id + "&bookId=" + book_id + "&end_chapter_id=" + this.data.end_chapter_id + "&start_chapter_id=" + start_chapter_id + "&isCurrentChapter=false" + "&isFirstChapter=" + isFirstChapter,
            })
          }
        }
      })

    } else {
      //点击下一章
      wx.request({
        url: app.globalData.HOST + '/various/getChapterIdByOrderBook.do',
        method: 'POST',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          bookId: book_id,
          order: chapter_name + 1
        },
        success: (res) => {
          console.log(res)
          if (res.data.status == 200) {
            var chapter_id = res.data.data
            var end_chapter_id = this.data.end_chapter_id
            chapter_name = '第' + (chapter_name + 1) + '章'
            let isCurrentChapter = end_chapter_id == chapter_id ? 'true' : 'false'
            wx.redirectTo({
              url: 'reading?chapter_name=' + chapter_name + "&chapterId=" + chapter_id + "&bookId=" + book_id + "&end_chapter_id=" + end_chapter_id + "&start_chapter_id=" + this.data.start_chapter_id + "&isCurrentChapter=" + isCurrentChapter + "&isFirstChapter=false",
            })
          }
        }
      })

    }
  }, 800),

  onReadNext: function(e) {
    // var chapter_id = (parseInt(this.data.chapter_id) + 1).toString()
    // var end_chapter_id = this.data.end_chapter_id
    // let isCurrentChapter = end_chapter_id == chapter_id ? 'true' : 'false'
    // //book_id有可能会变？？
    // wx.redirectTo({
    //   url: 'reading?bookId=' + this.data.book_id,
    // })
    this.setData({
      is_next_tap: true
    })
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (this.data.fromPage == 'discover' || this.data.fromPage == 'new_word') {
      console.log('onHide => ' + this.audioCtx.currentTime)
      if (this.data.is_playing == true) {}
    }
    this.setData({
      is_playing: false,
      is_audio_pause: true
    })
    this.audioCtx.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var audioObj = new Object()
    if (this.data.fromPage == 'new_word') {
      //录音保存
      if (this.audioCtx.currentTime > 0) {
        audioObj.audio_url = this.data.audio
        audioObj.currentTime = this.audioCtx.currentTime
        wx.setStorageSync('reading_radio', audioObj)
      }

      if (this.data.is_next_tap == true) {
        wx.reLaunch({
          url: 'discover?action=onNextTap',
        })
      } else {
        wx.reLaunch({
          url: 'discover',
        })
      }

    } else if (this.data.fromPage == 'discover') {
      //录音保存
      if (this.audioCtx.currentTime > 0) {
        audioObj.audio_url = this.data.audio
        audioObj.currentTime = this.audioCtx.currentTime
        wx.setStorageSync('reading_radio', audioObj)
      }

      if (this.data.is_next_tap == true) {
        wx.reLaunch({
          url: 'discover?action=onNextTap',
        })
      } else {
        wx.reLaunch({
          url: 'discover',
        })
      }
    }

    if (this.audioCtx) {
      this.audioCtx.destroy()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  onPageScroll: function(e) {
    var scrollTop = e.scrollTop

    var query = wx.createSelectorQuery()

    query.select('#content').boundingClientRect()
    query.exec((res) => {
      // console.log(res)

      // 获取到当前控件的高度
      var contentHeight = res[0].height

      // 获取滑动百分比
      var pct = scrollTop / contentHeight

      if (this.data.contentHeight != contentHeight) {
        let currentScrollTop = contentHeight * pct
        wx.pageScrollTo({
          scrollTop: currentScrollTop,
        })
        this.setData({
          contentHeight: contentHeight
        })
      }

    })

    // console.log(e);
  },

  showPicture: function(e) {
    let imgType = e.currentTarget.dataset.imgtype
    let needSign = e.currentTarget.dataset.needsign == 'true'
    let days = wx.getStorageSync('user_read_chapter')
    if (imgType == '1') {
      // 需要加1
      console.log(days)
      days = parseInt(days) + 1
    } 
    let m_download_img = 'https://file.ourbeibei.com/l_e/static/images/book_sign_day_' + days + '.jpg'
    this.setData({
      m_download_img: m_download_img,
      showDownloadImage: true,
      download_success: false
    })
    console.log(m_download_img)
    // 获取用户是否开启用户授权相册
    wx.getSetting({
      success: (res) => {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {

              //下载保存网络图片
              wx.downloadFile({
                url: m_download_img,
                success: (res) => {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                      this.setData({
                        download_success: true
                      })
                      if (needSign) {
                        console.log('needSign')
                        this.onChapterSign()
                      }
                      setTimeout(() => {
                        this.setData({
                          isShowDialog: false,
                          showDownloadImage: false,
                          download_success: false
                        })
                      }, 2000)
                    },
                    fail: () => {
                      wx.showToast({
                        title: '保存失败',
                        icon: 'none'
                      })
                      setTimeout(() => {
                        this.setData({
                          isShowDialog: false,
                          showDownloadImage: false,
                          download_success: false
                        })
                      }, 2000)
                    }
                  })
                }
              })
            },
            fail: () => {
              setTimeout(() => {
                this.setData({
                  isShowDialog: false,
                  showDownloadImage: false,
                  download_success: false
                })
              }, 2000)
            }
          })
        } else {
          // 有则直接保存
          //下载保存网络图片
          wx.downloadFile({
            url: m_download_img,
            success: (res) => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  if (needSign) {
                    console.log('need sign')
                    this.onChapterSign()
                  }
                  this.setData({
                    download_success: true
                  })
                  setTimeout(() => {
                    this.setData({
                      isShowDialog: false,
                      showDownloadImage: false,
                      download_success: false
                    })
                  }, 2000)
                },
                fail: () => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 2000
                  })
                  setTimeout(() => {
                    this.setData({
                      isShowDialog: false,
                      showDownloadImage: false,
                      download_success: false
                    })
                  }, 2000)
                }
              })
            }
          })
        }
      }
    })

  },

  stopPageScroll: function(e) {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.is_current_chapter_sign) {
      if (this.data.fromPage == 'new_word') {
        var HOST = app.globalData.HOST
        var token = app.globalData.token
        var series_id = wx.getStorageSync('book_series_id')
        //只有从new_word或者book_list进来才会进行打卡
        if (this.data.isCurrentChapter) {
          if (this.data.isCurrentChapter == 'true') {
            //从new_word进来则进行当天打卡
            // console.log("不进行打卡，要点击button才是打卡")
            //设置一个缓存 在发现页更改 这里负责设置 判断当天是否阅读完成即可
            //这里的状态只是告诉用户今天读完了 但打卡需要用button
            if (wx.getStorageSync('is_today_sign_book_finished') != true) {
              // this.setData({
              //   isShowDialog: true
              // })
              // setTimeout(() => {
              //   this.setData({
              //     isShowDialog: false
              //   })
              // }, 2500)
              wx.setStorageSync('is_today_sign_book_finished', true)
            }
          } else {
            wx.showLoading({
              title: '正在打卡...',
              duration: 1000
            })
            //进行非领红包的打卡
            console.log(series_id)
            console.log(this.data.book_id)
            console.log(this.data.chapter_id)
            wx.request({
              url: HOST + '/various/readClassClockInWithOutRedPacket.do',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': token
              },
              data: {
                series_id: series_id,
                book_id: this.data.book_id,
                chapter_id: this.data.chapter_id
              },
              success: (res) => {
                console.log(res)
                if (res.data.status == 200) {
                  this.setData({
                    is_current_chapter_sign: true
                  })
                  console.log("打卡就行 返回成功信息弹窗 不需要分享")
                  wx.showToast({
                    title: '打卡成功',
                    icon: 'success'
                  })
                  //设置当天阅读完成
                  wx.setStorageSync('is_today_book_finished', true)
                } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
                  this.getToken('onReachBottom')
                }
              },
              fail: (res) => {
                console.log("打卡失败：\n" + res)
              }
            })
          }
        }
      }
    }

  },

  getToken: function(methodName) {
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
                  // this.loadData()
                  if (methodName == 'loadData') {
                    this.loadData()
                  } else if (methodName == 'onReachBottom') {
                    this.onReachBottom()
                  } else if (methodName == 'onChapterSign') {
                    this.onChapterSign()
                  }

                } else {
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
                // this.loadData()

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

  onChapterSign: function() {
    let HOST = app.globalData.HOST
    let token = app.globalData.token
    let series_id = wx.getStorageSync('book_series_id')
    wx.request({
      url: HOST + '/various/readClassClockIn.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        series_id: series_id,
        book_id: this.data.book_id,
        chapter_id: this.data.chapter_id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          this.setData({
            is_signing: true
          })

          if (wx.getSystemInfoSync().platform == 'ios') {
            //ios系统
            wx.reLaunch({
              url: '../../../../tabBar/discover/discover',
            })
          } else {
            //安卓则直接返回就好
            wx.navigateBack({

            })
          }

        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken('onChapterSign')
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let days = wx.getStorageSync('book_read_day')
    // if (this.data.fromPage == 'new_word') {
    //   if (this.data.isCurrentChapter == 'true') {
    //     //是当前需要打卡的章节且是从button点击的
    //     if (this.data.is_signing == false) {
    //       console.log('需要打卡')
    //       this.onChapterSign()
    //     }

    //   } else {
    //     //存在分享和阅读下一章
    //     if (res.from == 'button') {

    //       // wx.reLaunch({
    //       //   url: '../../../../tabBar/discover/discover',
    //       // })

    //     }
    //   }
    // } else {
    //   if (res.from == 'button' && this.data.fromPage == 'discover') {

    //     wx.reLaunch({
    //       url: '../../../../tabBar/discover/discover',
    //     })

    //   }
    // }

    return {
      title: '【原著免费读】我已经在语境阅读了' + days + '天啦~~',
      path: 'page/tabBar/discover/discover',
      imageUrl: 'https://file.ourbeibei.com/l_e/share_pic/share_img_book_sign.jpg',
      success: (res) => {
        console.log('success')
      }
    }

  }
})