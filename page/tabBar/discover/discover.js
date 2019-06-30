// pages/discover/discover.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    vertical: false,
    autoplay: false,
    circular: true,
    previousMargin: 30,
    nextMargin: 30,
    card_list: [],
    currentPos: 0,
    isShowDialog: false,
    page: 2,
    currentUrl: '',
    have_book_list: true,
    showDownloadImage: false,
    // is_sign_current: false,
    // is_current_start: false,
    // level: 0,
    // need_reading_tips: false,
    // isPacked: true,
    // showRedPacket: true,
    // isShowDialog: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData()
    console.log(options)
    // this.setData({
    //   is_today_book_finished: wx.getStorageSync('is_today_book_finished')
    // })
    if (options != undefined) {
      this.setData({
        options: options
      })
    }

    if (options.action != undefined) {
      this.setData({
        action: options.action
      })
    }
  },

  loadData: function() {
    // wx.showLoading({
    //   title: '加载中',
    //   duration: 1500
    // })
    wx.showLoading({
      title: '加载中...',
    })
    var currentDate = new Date().getMonth() + 1 + '月' + new Date().getDate() + '日'
    console.log(currentDate)
    //判断是否为当天
    var lastDate = wx.getStorageSync('lastDate')
    if (lastDate != currentDate) {
      wx.setStorageSync('lastDate', currentDate)
      wx.setStorageSync('is_today_book_finished', false)
      wx.setStorageSync('is_today_sign_book_finished', false)
    }

    this.setData({
      is_today_book_finished: wx.getStorageSync('is_today_book_finished'),
      is_today_sign_book_finished: wx.getStorageSync('is_today_sign_book_finished')
    })

    var token = app.globalData.token
    console.log("token = " + token)
    var host = app.globalData.HOST
    wx.request({
      url: host + "/various/found_page.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          var data = res.data.data
          var list = data.daily_pic
          var is_reading = data.is_reading
          if (is_reading != undefined) {
            let storage = wx.getStorageSync('is_reading')
            if (is_reading != storage) {
              wx.setStorageSync('is_reading', is_reading)
            }
          }
          if (data.series_id != undefined) {
            let series_id = data.series_id
            if (wx.getStorageSync('book_series_id')) {
              //存在这样的缓存
              if (wx.getStorageSync('book_series_id') != series_id) {
                wx.setStorage({
                  key: 'book_series_id',
                  data: series_id,
                })
              }
            } else {
              //不存在这样的缓存
              wx.setStorageSync('book_series_id', series_id, )
            }
          }
          if (data.rest_day != undefined) {
            this.setData({
              rest_day: data.rest_day
            })
          }

          //别人帮你助力才会有
          if (this.data.options != undefined) {
            let options = this.data.options
            if (options.user_id != undefined) {
              console.log(options.user_id)
              console.log(options.series_id)
              this.onAssist(options.user_id, options.series_id)
            }
          }

          if (data.level == 1) {
            wx.setStorageSync('is_today_sign_book_finished', true)
            this.setData({
              is_today_sign_book_finished: true
            })
          }
          if (data.is_help_pay != undefined) {
            console.log('in')
            let storage = wx.getStorageSync('is_help_pay')
            if (data.is_help_pay != storage) {
              wx.setStorageSync('is_help_pay', data.is_help_pay)
            }
            this.setData({
              is_help_pay: data.is_help_pay == 'yes'
            })
          }
          if (data.is_reserved != undefined) {
            let storage = wx.getStorageSync('is_reserved')
            if (data.is_reserved != storage) {
              wx.setStorageSync('is_reserved', data.is_reserved)
            }
            this.setData({
              is_reserved: data.is_reserved == 'yes'
            })
          }
          if (data.is_reading == 3 && data.user_id != undefined) {
            wx.setStorageSync('book_user_id', data.user_id)
          } else {
            wx.removeStorageSync('book_user_id')
          }
          if (data.is_reading == 2) {
            if (wx.getStorageSync('book_user_id') != undefined) {
              wx.removeStorageSync('book_user_id')
            }
            if (data.readBookInfo != undefined && data.readBookInfo != null) {
              this.setData({
                readBookInfo: data.readBookInfo,
              })
            }
            wx.setStorageSync('user_read_chapter', data.user_read_chapter)
            this.setData({
              read_class_day: data.read_class_day,
              user_read_chapter: data.user_read_chapter,
              need_to_read_book: data.need_to_read_book,
              // readBookInfo: data.readBookInfo,
              reading_progress: parseInt(data.user_read_chapter * 100 / data.need_to_read_chapter),
              need_to_read_chapter: data.need_to_read_chapter,
              level: data.level,
              // showRedPacket: data.read_class_red_packet != '0',
              // isShowDialog: data.read_class_red_packet != '0',
              // read_class_red_packet: data.read_class_red_packet,
              //begin_day是阅读活动开始到现在一共多少天
              begin_day: data.begin_day,
              nextChapterInfo: data.nextChapterInfo
            })
          }
          this.setData({
            card_list: list,
            page: 2,
            currentUrl: list[0].daily_pic,
            is_reading: is_reading,

            enrollment: data.enrollment,

            //is_today_finished要先判断是否是当天 （若是当天 不更新缓存 old_chapter_id与book_id仍是当天第一次loadData时放入 判断readBookInfo.chapter_id和readBookInfo.book_id对应是否相等 不等为true 否则为false；若非当天则更新old_chapter_id和book_id 并其值false ）
          })
          if (data.clock_day != undefined) {
            if (wx.getStorageSync('book_read_day') != data.clock_day) {
              wx.setStorageSync('book_read_day', data.clock_day)
            }
          }
          if (this.data.action != undefined) {
            if (this.data.action == 'onNextTap') {
              let e = new Object()
              e['currentTarget'] = new Object()
              e['currentTarget']['dataset'] = new Object()
              e['currentTarget']['dataset']['level'] = 0
              this.onStartReading(e)
            }
          }
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }

      },
      fail: (res) => {
        console.log("fail")
        console.log(res)
      },
      complete: () => {
        wx.hideLoading()
      }
    })

    //----------------------------------------1.1-top------------------------------------ //------------------------------------------------------------------------------------
    //拿到首页中用户挑战状态参数
    wx.request({
      url: app.globalData.HOST + "/home/home_page_info.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        var data = res.data
        if (data.status == 200) {
          let homeData = data.data
          let word_challenge_status = homeData.word_challenge_status
          // let use_medallion = homeData.use_medallion
          console.log("当前挑战状态为：" + word_challenge_status)

          this.setData({
            word_challenge_status: homeData.word_challenge_status
            // use_medallion:homeData.use_medallion
          })

        } else {
          if (data.status == 400 && data.msg == '身份认证错误！') {
            this.getToken()
          }
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
    //------------------------------------------------------------------------------------
    //----------------------------------------1.1-btm-----------------------------------


  },

  getToken: function() {
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

  onDownloadTap: function(event) {
    // var url = event.currentTarget.dataset.url
    // console.log(url)
    // console.log(this.data.currentUrl)
    var url = this.data.currentUrl
    if (url.indexOf('http://47.107.62.22') != -1) {
      console.log(url)
      url = url.replace('http://47.107.62.22', 'https://file.ourbeibei.com')
      console.log(url)
    }

    wx.downloadFile({
      url: url,
      success: function(res) {

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(result) {
            console.log(result)
            wx.showToast({
              title: '下载成功',
              duration: 800
            })
          }
        })
      }
    })
  },

  toWebView: function(event) {
    this.onCloseDialog()
    wx.navigateTo({
      url: '../../discover/pages/web/web',
    })
  },

  onSwiperChange: function(event) {
    // console.log(event.detail.current)
    let current = event.detail.current
    let length = this.data.card_list.length
    console.log("current = " + current)
    console.log("length = " + length)
    this.data.currentUrl = this.data.card_list[current].daily_pic
    if (current == length - 1) {
      this.loadMorePics()
    }
  },

  loadMorePics: function() {
    var token = app.globalData.token
    // console.log("token = " + token)
    var host = app.globalData.HOST
    wx.request({
      url: host + "/various/daily_pic.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        page: this.data.page,
        size: 6
      },
      success: (res) => {
        console.log(res)
        var list = res.data.data
        let origin_list = this.data.card_list
        for (let i = 0; i < list.length; i++) {
          origin_list.splice(origin_list.length, 0, list[i])
        }
        // origin_list.splice(origin_list.length, 0, list)
        console.log(origin_list)
        this.setData({
          card_list: origin_list,
          page: this.data.page + 1
        })
      },
      fail: (res) => {
        console.log("fail")
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.showTabBar({})

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //画点击报名的canvas
    var canvas = wx.createCanvasContext('ic_sign_up')
    canvas.beginPath()

    canvas.setFillStyle("#313131")

    canvas.moveTo(2, 2)
    canvas.lineTo(8, 5)
    canvas.lineTo(2, 8)
    canvas.lineTo(2, 2)
    canvas.fill()
    canvas.draw()
  },

  // onShowDialog: function(event) {
  //   let id = event.currentTarget.id
  //   if (id == 1) {
  //     this.setData({
  //       isShowDialog: true,
  //       alert_type: 1,
  //       isMiddleClick: false
  //     })
  //   } else {
  //     this.setData({
  //       isShowDialog: true,
  //       alert_type: 2,
  //       isMiddleClick: false
  //     })
  //   }
  // },

  onCloseDialog: function(event) {
    this.setData({
      isShowDialog: false,
      // alert_type: 0
    })
  },




  //应对ios支付举报
  onMiddleClick: function(event) {
    if (this.data.word_challenge_status == 0) {
      let that = this
      wx.getSystemInfo({
        success: function(res) {
          that.setData({
            systemInfo: res,
          })
          if (res.platform == "ios") {

            wx.showToast({
              title: '该模块正在整改中~~',
              duration: 2000,
              mask: true,
              icon: 'none',
            })

          } else if (res.platform == "android") {
            wx.navigateTo({
              url: '../../discover/pages/WordChallenge/SignUp/SignUp',
            })
          }
        }
      })
    } else if (this.data.word_challenge_status == 1) {
      wx.navigateTo({
        url: '../../discover/pages/WordChallenge/WaitingChallenge/WaitingChallenge',
      })
    } else if (this.data.word_challenge_status == 2) {
      wx.navigateTo({
        url: '../../discover/pages/WordChallenge/PunchRank/PunchRank',
      })
    }
  },



  //原先的方法
  //   onMiddleClick: function(event) {
  //     // this.setData({
  //     //   isMiddleClick: true,
  //     //   isShowDialog: true
  //     // })
  //     // setTimeout(this.onCloseDialog, 1300)


  //     //----------------------------------------1.1-top-------------------------------------
  // //------------------------------------------------------------------------------------

  //     if (this.data.word_challenge_status == 0) {
  //       wx.navigateTo({
  //         url: '../discover/WordChallenge/SignUp/SignUp',
  //       })
  //     }
  //     else if (this.data.word_challenge_status == 1) {
  //       wx.navigateTo({
  //         url: '../discover/WordChallenge/WaitingChallenge/WaitingChallenge',
  //       })
  //     }
  //     else if (this.data.word_challenge_status == 2) {
  //       wx.navigateTo({
  //         url: '../discover/WordChallenge/PunchRank/PunchRank',
  //       })
  //     }
  // //----------------------------------------1.1-btm-------------------------------------
  // //------------------------------------------------------------------------------------


  //   },

  //1.2
  onStartReading: function(e) {
    //到时记得刷新 不然章节id可能出错
    console.log(e)
    var level = parseInt(e.currentTarget.dataset.level)
    if (level == 0) {
      var isCurrentChapter = (this.data.nextChapterInfo.book_id == this.data.need_to_read_book.book_id && this.data.nextChapterInfo.chapter_id == this.data.need_to_read_book.chapter_id) ? 'true' : 'false'
      if (this.data.action != undefined) {
        this.setData({
          action: ''
        })
      }
      // console.log('book_id=' + this.data.nextChapterInfo.book_id)
      let chapter = this.data.readBookInfo.chapter_order != null ? (parseInt(this.data.readBookInfo.chapter_order) + 1).toString() : '1'
      wx.navigateTo({
        url: '../../discover/pages/book/reading/new_word?page=discover&isCurrentChapter=' + isCurrentChapter + '&bookId=' + this.data.nextChapterInfo.book_id + "&chapterId=" + this.data.nextChapterInfo.chapter_id + "&chapter=" + chapter + '&end_chapter_id=' + this.data.need_to_read_book.chapter_id
      })
    } else if (level == 2) {
      var isCurrentChapter = (this.data.readBookInfo.book_id == this.data.need_to_read_book.book_id && this.data.readBookInfo.chapter_id == this.data.need_to_read_book.chapter_id) ? 'true' : 'false'
      //因为当前已经刷新了
      // let chapter_order = parseInt(this.data.readBookInfo.chapter_order)
      wx.navigateTo({
        url: '../../discover/pages/book/reading/reading?page=discover&isCurrentChapter=' + isCurrentChapter + '&bookId=' + this.data.readBookInfo.book_id + "&chapterId=" + this.data.readBookInfo.chapter_id,
      })
    }
  },

  showPicture: function(e) {
    // let that = this;
    this.setData({
      isShowDialog: true,
      showDownloadImage: true
    })
    let m_download_img = 'https://file.ourbeibei.com/l_e/static/images/book_sign_day_' + this.data.begin_day + '.jpg'
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
                      this.onSignChapter()
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
                  this.onSignChapter()
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

  //点击红包立即打开按钮
  onPacketOn: function(e) {
    var HOST = app.globalData.HOST
    var token = app.globalData.token
    wx.request({
      url: HOST + '/various/getReadClassRedPacket.do',
      method: 'POST',
      header: {
        'token': token,
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          this.setData({
            isPacked: true
          })
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }
      },
      fail: (res) => {

      }
    })
  },

  stopPageScroll: function(e) {

  },

  onMoneyTap: function(e) {
    wx.navigateTo({
      url: '../../user/pages/wallet/wallet',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // console.log("refresh")
    this.setData({
      currentPos: 0
    })
    this.loadData()
    setTimeout(this.stopRefresh, 500)
  },

  stopRefresh: function() {
    wx.stopPullDownRefresh()
  },

  onBookListTap: function(e) {
    wx.navigateTo({
      url: '../../discover/pages/book_list/book_list',
    })
  },

  onConsultTap: function(e) {
    wx.navigateTo({
      url: '../../discover/pages/teacher/teacher',
    })
  },

  showBookInfo: function(e) {
    let HOST = app.globalData.HOST
    let token = app.globalData.token
    wx.request({
      url: HOST + '/various/showReadClassBookIntroduction.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        book_id: this.data.readBookInfo.book_id
      },
      success: (res) => {
        // console.log(res)
        if (res.data.status == 200) {
          var data = res.data.data
          this.setData({
            book_info_author: data.author,
            book_info_name: data.name,
            book_info_pic: data.pic,
            book_info_introduction: data.introduction,
            isShowDialog: true,
            showInfo: true,
          })
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }
      },
      fail: (res) => {
        console.log("失败：" + res)
      }
    })
  },


  onSignUpTap: function(e) {
    //应对ios支付举报
    // wx.getSystemInfo({
    //   success: (res) => {
    //     this.setData({
    //       systemInfo: res,
    //     })
    // if (res.platform == "ios") {
    //   wx.showToast({
    //     title: '技术小哥正在连夜开发，尽请期待吧~',
    //     duration: 1500,
    //     mask: true,
    //     icon: 'none',
    //   })
    // } else /*if (res.platform == "android")*/ {
    //   // let is_series_signed = wx.getStorageSync('is_series_signed')
    if ( /* this.data.is_help_pay != undefined && this.data.is_help_pay == true &&  */ this.data.is_reading == 3) {
      let user_id = wx.getStorageSync('book_user_id')
      let series_id = wx.getStorageSync('book_series_id')
      wx.navigateTo({
        url: '../../discover/pages/book/book_sign_assist?user_id=' + user_id + '&series_id=' + series_id,
      })
    } else {
      if (this.data.is_reserved != undefined && this.data.is_reserved == true) {
        wx.navigateTo({
          url: '../../discover/pages/book/book_sign_up?enrollment=' + this.data.enrollment + "&is_reserved=true",
        })
      } else {
        wx.navigateTo({
          url: '../../discover/pages/book/book_sign_up?enrollment=' + this.data.enrollment,
        })
      }
    }
    // }
    // }
    // })
  },

  onAssist: function(user_id, series_id) {
    console.log('onAssist')

    let HOST = app.globalData.HOST
    let token = app.globalData.token
    console.log(token)
    wx.request({
      url: HOST + '/various/helpReadClass.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        series_id: series_id,
        user_id: user_id
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 200) {
          let options = this.data.options
          console.log('success')
          //这样子loadData就不会进入助力了
          options['user_id'] = undefined
          options.user_id = undefined
          this.setData({
            showAssistSuccess: true,
            isShowDialog: true,
            options: options
          })
          setTimeout(() => {
            this.setData({
              isShowDialog: false
            })
          }, 2000)
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
          setTimeout(() => {
            this.onAssist(user_id, series_id)
          }, 1500)
        } else if (res.data.status == 400 && res.data.msg.indexOf('助力已结束') != -1) {
          let options = this.data.options
          options['user_id'] = undefined
          options.user_id = undefined
          this.setData({
            options: options
          })
          console.log(res)
          wx.showModal({
            title: '助力失败',
            content: res.data.msg,
            confirmText: '重试',
            success: (res) => {
              if (res.confirm) {
                //点击了重试
                // let user_id = wx.getStorageSync('book_user_id')
                // let series_id = wx.getStorageSync('book_series_id')
                this.onAssist(user_id, series_id)
              } else {
                //点击了取消
                let options = this.data.options
                options['user_id'] = undefined
                options.user_id = undefined
                this.setData({
                  options: options
                })
              }
            }
          })
        }
      },
      fail: (res) => {
        console.log("访问助力失败\n" + res)
        wx.showModal({
          title: '助力失败',
          content: '助力失败了...请检查网络状况',
          confirmText: '重试',
          success: (res) => {
            if (res.confirm) {
              //点击了重试
              // let user_id = wx.getStorageSync('book_user_id')
              // let series_id = wx.getStorageSync('book_series_id')
              this.onAssist(user_id, series_id)
            }
          }
        })
      }
    })
  },

  onSignChapter: function() {
    let HOST = app.globalData.HOST
    let token = app.globalData.token
    let series_id = wx.getStorageSync('book_series_id')
    let book_id = this.data.need_to_read_book.book_id
    let chapter_id = this.data.need_to_read_book.chapter_id
    wx.request({
      url: HOST + '/various/readClassClockIn.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      data: {
        series_id: series_id,
        book_id: book_id,
        chapter_id: chapter_id
      },
      success: (res) => {
        if (res.data.status == 200) {
          console.log(res)
          setTimeout(() => {
            // wx.showToast({
            //   title: '打卡成功',
            // })
            // this.loadData()
            this.setData({
              level: 1
            })
          }, 1000)
        } else if (res.data.status == 400 && res.data.msg == '身份认证错误！') {
          this.getToken()
        }
      },
      fail: (res) => {
        console.log("打卡访问失败\n" + res)
      }
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let days = wx.getStorageSync('book_read_day')
    if (this.data.level == 0 && this.data.is_today_sign_book_finished == true) {
      // this.onSignChapter()
      return {
        title: '【原著免费读】我已经在语境阅读了' + days + '天啦~~',
        path: 'page/tabBar/discover/discover',
        imageUrl: 'https://file.ourbeibei.com/l_e/share_pic/share_img_book_sign.jpg',
        success: (res) => {
          console.log('success')
        }
      }
    }
    var share_imgs = app.globalData.share_imgs
    var share_texts = app.globalData.share_texts
    var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    var share_img = share_imgs[choose_number]
    var share_text = share_texts[choose_number]

    return {

      title: share_text,
      path: 'page/tabBar/home/home',
      imageUrl: share_img,

    }

  }
})