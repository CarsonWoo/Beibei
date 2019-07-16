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
    partner_level: 1,
    showLikeToast: true,
    is_show_more_cards: false,
    is_show_time_reversal: false,
    is_vip: false,
    isInLove: false,
    // showLightenToast: true,
    ic_soundless_like: app.globalData.FTP_ICON_HOST + "secret_like.png",
    ic_lighten: app.globalData.FTP_ICON_HOST + 'super_lighten.png',
    ic_gender: app.globalData.FTP_ICON_HOST + 'male.png',
    ic_like: app.globalData.FTP_ICON_HOST + 'like_unclick.png',
    ic_super_like: app.globalData.FTP_ICON_HOST + 'super_like_unclick.png',
    ic_time_reversal: app.globalData.FTP_ICON_HOST + 'time_reversal.png',
    ic_watch_more: app.globalData.FTP_ICON_HOST + 'watch_more_white.png',

    platform: '',
    vipContent: 'VIP限时特惠',


    isShowInforPop: false, //是否展示完善资料弹窗
    isExistInfor: false, //用户资料(包括照片、性别、意向)是否已存在后台
    isNeedChangePhoto: false, //已上传过基本资料的用户是否需要更换照片
    topToastContent: '完善资料，闪电匹配',
    isShowTopToast: true,
    currentItem: 0,
    swiperCurrent: 0,
    isFinishInfor: false, //完善资料窗口是否填写完三类信息，填完后顶部toast隐藏
    photoFlag: false, //是否已保存新的照片（打开弹窗后剪裁后显示但还未提交的图片）
    sexFlag: -1, //性别标志 0,1,2  -1代表未选择，0代表选中boy，1代表选中girl
    wantFlag: -1, //意向标志 0123 -1代表未选择，012分别对应三选项
    btn_boy_check: app.globalData.FTP_ICON_HOST + 'btn_boy_check.png',
    btn_boy_normal: app.globalData.FTP_ICON_HOST + 'btn_boy_normal.png',
    btn_girl_check: app.globalData.FTP_ICON_HOST + 'btn_girl_check.png',
    btn_girl_normal: app.globalData.FTP_ICON_HOST + 'btn_girl_normal.png',
    btn_upload_photo: app.globalData.FTP_ICON_HOST + 'btn_upload_photo.png',
    btn_change_photo: app.globalData.FTP_ICON_HOST + 'btn_change_photo.png',

    isExistCompleteInfor: false, //是否后台存在完整信息（年龄、学校、个性签名）,

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

    //获取用户手机系统类型
    let platform = wx.getSystemInfoSync().platform
    console.log('platform' + platform)
    if (platform == 'ios') {
      this.setData({
        platform: 'ios'
      })
    } else if (platform == 'android') {
      this.setData({
        platform: 'android'
      })
    } else if (platform == 'devtools') {
      this.setData({
        //pc端跟ios相同處理
        platform: 'ios'
      })
    }

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
          //--------------------------------1.1-top------------------------------ 
          //------为了统一 只有拿到真的token以后才进行请求 避免无效操作 下同------------------
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



// ------------------------------------ 运营0.3-top-------------------------------------

          // 获取顶部label的高度 在这里拿因为onShow就需要用在canvas中
          var query = wx.createSelectorQuery()
          query.select('#partnership_label').boundingClientRect()
          query.selectViewport().scrollOffset()
          query.exec((res) => {
            console.log(res[0].top)
            this.setData({
              label_origin_height: res[0].top
            })
          })

          // 具体信息
          this.loadLoveInfo()

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

    this.getUserMatchData();


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

  loadLoveInfo: function() {
    wx.request({
      url: app.globalData.HOST + '/operation/foundPageShowDatingCare.do',
      method: 'POST',
      header: {
        'token': app.globalData.token
      },
      success: (res) => {
        console.log(res)
      },
      fail: (er) => {
        console.log("fail response = " + er)
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
    //绑定弹窗组件id
    this.popOpenVip = this.selectComponent("#pop-openvip");
    this.popLead = this.selectComponent("#pop-lead");
    this.popVipIntro = this.selectComponent("#pop-vipintro");
    this.popBlueWxCode = this.selectComponent("#pop-bluewxcode");
    this.popPinkWxCode = this.selectComponent("#pop-pinkwxcode");
    this.popContactUs = this.selectComponent("#pop-contactus");
    this.popMeetCode = this.selectComponent("#pop-meetcode");
    this.popBreak = this.selectComponent("#pop-break");
    this.popRemind = this.selectComponent("#pop-remind");
    this.popRestart = this.selectComponent("#pop-restart");
    this.popMatchSuccess = this.selectComponent("#pop-matchsuccess");

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

    var toastLike = wx.createCanvasContext('partnership_toast_like')
    toastLike.beginPath()
    toastLike.setFillStyle("rgba(0, 0, 0, 0.5)")
    // toast.setStrokeStyle("#000000")
    toastLike.moveTo(130, 1)
    toastLike.lineTo(125, 5)
    toastLike.lineTo(3, 5)
    toastLike.quadraticCurveTo(1, 5, 1, 7)
    toastLike.lineTo(1, 27)
    toastLike.quadraticCurveTo(1, 29, 3, 29)
    toastLike.lineTo(147, 29)
    toastLike.quadraticCurveTo(149, 29, 149, 27)
    toastLike.lineTo(149, 7)
    toastLike.quadraticCurveTo(149, 3, 147, 5)
    toastLike.lineTo(135, 5)
    toastLike.lineTo(130, 1)
    toastLike.fill()
    toastLike.beginPath()
    toastLike.setFillStyle("white")
    toastLike.setFontSize(12)

    toastLike.fillText("看看有谁偷偷喜欢你", 20, 21)

    // toast.stroke()
    toastLike.draw()

    var toastLighten = wx.createCanvasContext('partnership_toast_lighten')
    toastLighten.beginPath()
    toastLighten.setFillStyle("rgba(0, 0, 0, 0.5)")
    // toast.setStrokeStyle("#000000")
    toastLighten.moveTo(130, 1)
    toastLighten.lineTo(125, 5)
    toastLighten.lineTo(3, 5)
    toastLighten.quadraticCurveTo(1, 5, 1, 7)
    toastLighten.lineTo(1, 27)
    toastLighten.quadraticCurveTo(1, 29, 3, 29)
    toastLighten.lineTo(147, 29)
    toastLighten.quadraticCurveTo(149, 29, 149, 27)
    toastLighten.lineTo(149, 7)
    toastLighten.quadraticCurveTo(149, 3, 147, 5)
    toastLighten.lineTo(135, 5)
    toastLighten.lineTo(130, 1)
    toastLighten.fill()

    toastLighten.beginPath()
    toastLighten.setFillStyle("white")
    toastLighten.setFontSize(12)

    toastLighten.fillText("10倍曝光，匹配飙升", 20, 21)

    // toast.stroke()
    toastLighten.draw()

    //从截取页面传回的截取头像文件路径 并展示
    if (app.globalData.cropPhotoSrc) {
      this.setData({
        photoFlag: true,
        img_photo_example: app.globalData.cropPhotoSrc
      })
      this.hideTopToast()
    }


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

  // 运营0.3

  //请求0.3用户信息接口
  getUserMatchData(){
    wx.request({
      url: app.globalData.HOST +'/operation/foundPageShowDatingCare.do',
      method:'POST',
      header:{
        'token':app.globalData.token,
        'content-type':'application/x-www-form-urlencoded'
      },
      success(res){
        if(res.status==='200'){
          console.log(res.data)
        }else{
          console.log(res.data)
        }
      },
      fail(res){
        console.log('requestData fail')
      }
    })
  },

  closeLikeToastTap: function(e) {
    this.setData({
      showLikeToast: false,
      showLightenToast: true
    })
  },

  closeLightenToastTap: function(e) {
    this.setData({
      showLightenToast: false
    })
  },

  onPageScroll: function(e) {
    if (e.scrollTop >= this.data.label_origin_height + 5) {
      this.setData({
        label_should_fixed: true
      })
    } else {
      this.setData({
        label_should_fixed: false
      })
    }
  },

  onTimeReversalTap: function(e) {
    if (!this.data.is_vip) {
      this.popVipIntro.showPopup();
      wx.hideTabBar({
        aniamtion: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return;
    }
    this.setData({
      is_show_time_reversal: true
    })
  },

  onMoreCardsTap: function(e) {
    if (!this.data.is_vip) {
      //vip功能 非vip用户点击弹出vip介绍弹窗
      this.popVipIntro.showPopup();
      wx.hideTabBar({
        aniamtion: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return;
    }
    this.setData({
      is_show_more_cards: true
    })
  },
  onLikeTap: function() {
    var isExistPhoto = false
    var isCompleteInfor = false;
    if (!this.data.isExistInfor) {
      //没有填写基本资料（头像、性别、意愿）
      this.setData({
        isShowInforPop: !this.data.isShowInforPop
      })
      return;
    }
    if (this.data.isExistInfor) {
      if (this.data.isNeedChangePhoto) {
        //后台存在基本资料需要该用户更换照片
        this.setData({
          topToastContent: '更换靓照，提升魅力',
          isShowInforPop: !this.data.isShowInforPop,
          sexFlag: 999,
          wantFlag: 999, //此处设999用于顶部toast隐藏的条件判断
        })
      }
    }

    if (!this.data.isExistCompleteInfor) {
      //没有添加小呗完善信息,
      this.ifNotExistShowBlueWxCodePop();
      return;
    }
    // if (this.data.likeTapNumber > 3 && !this.data.is_vip) {
    //   //非vip用户点击喜欢次数大于三次
    //   this.popVipIntro.showPopup();
    //   wx.hideTabBar({
    //     aniamtion: true,
    //     success: function(res) {},
    //     fail: function(res) {},
    //     complete: function(res) {},
    //   })
    //   return;
    // }
    console.log('you tap like')
  },
  onSuperLikeTap: function() {
    if (!is_vip) {
      this.popVipIntro.showPopup();
      wx.hideTabBar({
        aniamtion: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
    }
  },

  //监听选择boy、girl性别的按钮改变 boy 0/ girl 1
  onSexTap: function(event) {
    switch (event.target.id) {
      case 'btn-boy':
        this.setData({
          sexFlag: 0
        })
        break;
      case 'btn-girl':
        this.setData({
          sexFlag: 1
        })
        break;
    }
    this.hideTopToast();
    let self = this;
    //设置延时切换swiper item
    setTimeout(function() {
      self.setData({
        currentItem: 1
      })
    }, 300)
  },
  //点击事件绑定匹配意向的flag变动 girl 1,boy 0 ,all 2
  onWantTap: function(event) {
    switch (event.target.id) {
      case 'btn-want-girl':
        this.setData({
          wantFlag: 1
        })
        break;
      case 'btn-want-boy':
        this.setData({
          wantFlag: 0
        })
        break;
      case 'btn-want-all':
        this.setData({
          wantFlag: 2
        })
        break;
    }
    this.hideTopToast();
  },

  onUploadPhotoTap: function(event) {
    let self = this;
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.navigateTo({
                url: '../../../utils/components/image-cropper/croppertest',
              })
            },
            fail() {
              console.log('authorize fali')
            }
          });
        } else {
          console.log('had scope to album')
          wx.navigateTo({
            url: '../../../utils/components/image-cropper/croppertest',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  //隐藏顶部文字 通常在最后一个填写事件完成后触发
  hideTopToast: function() {
    if (!(this.data.sexFlag < 0) &&!(this.data.wantFlag < 0 )&& (this.data.photoFlag) ){
      this.setData({
        isShowTopToast: false
      })
    }
  },

  //完善资料或更换照片弹窗信息提交按钮事件
  onInforPostTap: function(event) {
    if (this.data.isShowTopToast) {
      //顶部文字未消除，说明资料未填写完整
      this.setData({
        isShowBottomToast: true,
        bottomToastContent: '有未填写的信息噢!'
      })
      //三秒后消失
      let self = this;
      setTimeout(function() {
        self.setData({
          isShowBottomToast: false
        })
      }, 3000)
    }

    var photoUrl = app.globalData.cropPhotoSrc
    var gender = this.sexFlag
    var intention = this.wantFlag

    switch (event.target.id) {
      //上传信息
      case 'btn-post-infor':
        console.log('you post infor')
        //请求信息提交接口
        wx.request({
          url: app.globalData.HOST + '/operation/uploadDatingCard.do',
          header: ({
            'content-type': 'application/x-www-form-urlencoded',
            'token': app.globalData.token
          }),
          method: 'POST',
          data: ({
            'gender': gender,
            'intention': intention,
            'cover': photoUrl
          }),
          success(res){
            console.log(res.data)
          },
          fail(res){
            console.log('failrequest')
          }
        })
        //请求成功回调后底部toast显示'上传成功'3秒  
        //基本资料弹窗消失 --- 如果用户没有完善更多信息，弹出完善更多信息窗口
        //下面为请求成功后的代码
        // this.setData({
        //   isShowBottomToast: true,
        //   bottomToastContent: '有未填写的信息噢!'
        // })
        // //三秒后消失
        // let self = this;
        // setTimeout(function () {
        //   self.setData({
        //     isShowBottomToast: false
        //   })
        // }, 3000)
        // break;
        //this.ifNotExistShowBlueWxCodePop();
        //上传更换的照片
      case 'btn-post-photo':
        console.log('you post photo')
        //请求更换照片提交接口  成功回调后执行ifNotExistShowBlueWxCodePop()方法。
        break;
    }
  },





  //完善资料弹窗中自定义swiper圆点指示器 绑定swiper切换事件来改变圆点的active状态
  swiperChange: function(e) {
    console.log('current item:' + this.data.currentItem)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //多个自定义组件弹窗的弹起与隐藏
  showOpenVipPop: function() {
    console.log('openvip');
    this.popOpenVip.showPopup();
  },
  showLeadPop: function() {
    this.popLead.showPopup();
  },
  showVipIntroPop: function() {
    this.popVipIntro.showPopup();
    wx.hideTabBar({
      aniamtion: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  ifNotExistShowBlueWxCodePop: function() {
    //判断用户没有通过小呗登记完整资料时展示二维码弹窗
    if (!this.data.isExistCompleteInfor) {
      this.popBlueWxCode.showPopup();
    }
  },
  showPinkWxCodePop: function() {
    this.popPinkWxCode.showPopup();
  },
  showContactUsPop: function() {
    this.popContactUs.showPopup();
  },
  showMeetCodePop: function() {
    this.popMeetCode.showPopup();
  },
  showBreakPop: function() {
    this.popBreak.showPopup();
  },
  showRemindPop: function() {
    this.popRemind.showPopup();
  },
  showBreakPop: function() {
    this.popRestart.showPopup();
  },
  showMatchSuccessPop: function() {
    this.popMatchSuccess.showPopup();
  },
  hidePopup: function(event) {
    switch (event.target.id) {
      case 'pop-openvip':
        this.popOpenVip.hidePopup();
        break;
      case 'pop-lead':
        this.popLead.hidePopup();
        break;
      case 'pop-vipintro':
        this.popVipIntro.hidePopup();
        wx.showTabBar({
          aniamtion: true
        });
        break;
      case 'pop-bluewxcode':
        this.popBlueWxCode.hidePopup();
        break;
      case 'pop-pinkwxcode':
        this.popPinkWxCode.hidePopup();
        break;
      case 'pop-contactus':
        this.popContactUs.hidePopup();
        break;
      case 'pop-meetcode':
        this.popMeetCode.hidePopup();
        break;
      case 'pop-break':
        this.popBreak.hidePopup();
        break;
      case 'pop-remind':
        this.popRemind.hidePopup();
        break;
      case 'pop-restart':
        this.popRestart.hidePopup();
        break;
      case 'pop-matchsuccess':
        this.popMatchSuccess.hidePopup();
        break;
    }
  },
  hideInforPop() {
    this.setData({
      isShowInforPop: false
    })
  },

  /*
   * vip介绍弹窗触发条件
   *非vip用户点击vip功能时弹出（超级喜欢，查看谁喜欢我，超级曝光，时光倒流机，查看更多卡片）
   *vip用户在倒数3天内过期 每天12点30分由后台发送通知，前端接收在用户打开小程序时推送续费弹窗
   */
  openVip: function() {
    //判断安卓用户与ios用户
    //安卓：调用微信支付接口进行支付，支付成功回调：vip介绍窗口消失， 成功开通vip弹窗显示3秒消失
    //安卓支付失败回调： 回到vip介绍弹窗
    //ios：弹出支付指导窗口
    console.log('you touch open-vip button');
    if (this.data.is_vip) {
      //当用户为vip时改变弹窗文字内容
      this.setData({
        vipContent: '立即续费VIP'
      })
    }
    if (this.data.platform == 'ios') {
      this.popVipIntro.hidePopup();
      this.popLead.showPopup();
      wx.showTabBar({
        aniamtion: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
    } else {
      //安卓用户调用支付接口
    }
  },

  /*
   *引导支付弹窗的添加小呗按钮事件
   */
  addStaff: function() {
    // 判断是否已授权访问相册
    //已授权:自动下载二维码（toast二维码下载中；二维码已保存至手机）
    //未授权：点击下载二维码button - 申请访问相册授权 - 授权成功：执行已授权的步骤，授权失败：留在支付引导页
    console.log('touch add staff button')
    let self = this;
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //没有访问相册权限时申请权限
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 下载二维码并toast提示
              self.popLead.showToast("二维码开始下载");
              self.saveImgToAlbum('popLead');
            },
            fail() {
              //申请被拒绝toast提示
              console.log('authorize fali')
              //被用户拒绝后 接下来每次申请权限都会被默认拒绝。
              //firstFlag：true 判断用户是否为第一次申请权限，第一次则将firstFlag置为false
              //非第一次申请权限 则通过open-type="getsetting"的button(待添加)由用户手动开启访问权限        
            }
          });
        } else {
          //已获取相册权限
          // 下载二维码并toast提示
          console.log('had scope to album')
          self.popLead.showToast("二维码开始下载");
          self.saveImgToAlbum();
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /*
   *保存二维码到相册
   */
  saveImgToAlbum: function(popType) {
    let self = this;
    var pop = popType;
    wx.downloadFile({
      //先将二维码下载至项目本地临时路径
      //小呗二维码下载路径
      url: app.globalData.FTP_ICON_HOST + 'img_wxcode_staff.jpg',
      success: function(res) {
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success: function(res) {
              switch (pop) {
                case 'popLead':
                  self.popLead.showToast("二维码已保存至手机相册");
                  break;
                case 'popBlueWxCode':
                  self.popBlueWxCode.showToast("二维码已保存至手机相册");
                  break;
              }
            },
            fail: function(res) {
              switch (pop) {
                case 'popLead':
                  self.popLead.showToast("二维码保存失败");
                  break;
                case 'popBlueWxCode':
                  self.popBlueWxCode.showToast("二维码保存失败");
                  break;
              }
            },
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //完善更多资料弹窗 下载二维码的点击事件
  onDownloadWxCodeTap: function() {
    // 判断是否已授权访问相册
    //已授权:自动下载二维码（toast二维码下载中；二维码已保存至手机）
    //未授权：点击下载二维码button - 申请访问相册授权 - 授权成功：执行已授权的步骤，授权失败：留在支付引导页
    console.log('touch add staff button')
    let self = this;
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //没有访问相册权限时申请权限
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 下载二维码并toast提示
              self.popBlueWxCode.showToast("二维码开始下载");
              self.saveImgToAlbum('popBlueWxCode');
            },
            fail() {
              //申请被拒绝toast提示
              console.log('authorize fali')
              //被用户拒绝后 接下来每次申请权限都会被默认拒绝。
              //firstFlag：true 判断用户是否为第一次申请权限，第一次则将firstFlag置为false
              //非第一次申请权限 则通过open-type="getsetting"的button(待添加)由用户手动开启访问权限        
            }
          });
        } else {
          //已获取相册权限
          // 下载二维码并toast提示
          console.log('had scope to album')
          self.popBlueWxCode.showToast("二维码开始下载");
          self.saveImgToAlbum('popBlueWxCode');
        }
      },
      fail: function(res) {},
      complete: function(res) {},
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