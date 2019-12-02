// pages/home/sign/sign.js
const app = getApp()
const monthStr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
Page({

  /**
   * 页面的初始数据
   */
  data: {

    is_sign: false,
    total_days:0,
    disabled: true,
    raw_QRUrl: '',
    QRUrl: '',
    portrait_image: '',
    articleList: [],
    feedInfo: [],
    bannerInfo: [],
    userStudyInfo: [],
    swiperCircular: false,
    isPageEnd: false,
    screenWidth: 0,
    screenHeight: 0,
    ic_share: app.globalData.FTP_ICON_HOST + 'ic_share.png',
    btn_share_study: app.globalData.FTP_ICON_HOST + 'btn_share_study.png',
    img_muchbook: app.globalData.FTP_ICON_HOST + 'img_muchbook.png',
    img_lead_contact: app.globalData.FTP_ICON_HOST + 'img_lead_contact.png',
    isShowSharePop: true,
    sign_card_num: 1,
    img_share_sign_card: '',
    date_string: "1975.00.00",
    isShowDownSuccessPop: false,
    isShowFootBanner: true,
    isShowLeadContactPop: false,
    insist_day_num:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.showShareMenu({
      withShareTicket: true
    })

    // this.getCalendar(clock_list)

    // console.log(weekList)

    this.loadData(wx.getStorageSync('token'))
    
    // this.getToken()
  },

  getCalendar(clock_list) {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth()
    //获取当前月份总天数
    var days = new Date(year, month + 1, 0).getDate();
    //获取当前月份第一日开始在周几
    var startDay = new Date(year, month, 1).getDay();
    if(startDay == 0){
      startDay = 7
    }
    // console.log(year)
    // console.log(month)
    // console.log(days)
    // console.log(startDay)

    //计算行数
    let rows = parseInt((days + startDay) / 7);
    // console.log(rows)
    if ((days + startDay) % 7 != 0) {
      //还有余
      rows = rows + 1
    }

    var weekList = []

    for (let i = 0, dayNum = 1; i < rows; i++) {
      var list = []
      if (i == 0) {
        for (let j = 1; j <= 7; j++) {
          if (j >= startDay) {
            if (clock_list.indexOf(dayNum) != -1) {
              //表示已打卡
              list[j - 1] = '*'
            } else {
              list[j - 1] = dayNum
            }
            dayNum = dayNum + 1
          } else {
            list[j - 1] = ''
          }
        }
      } else {
        for (let j = 0; j < 7; j++) {
          if (dayNum <= days) {
            if (clock_list.indexOf(dayNum) != -1) {
              list[j] = '*'
            } else {
              list[j] = dayNum
            }
            dayNum = dayNum + 1
          } else {
            list[j] = ''
          }

        }
      }
      weekList.push(list)
    }

    this.setData({
      year: year,
      month: monthStr[month],
      weekList: weekList,
    })
  },

  loadData: function(token) {

    //获取当期挑战状态
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
          let word_challenge_status = data.data.word_challenge_status
          let whether_clock_in = data.data.whether_clock_in
          let level = data.data.level
          let insist_day = data.data.insist_days + 1 
          let word_number = data.data.learned_word
          if (level == 2 || level == 3){
              this.setData({
                is_sign: true,
              })
          }
          this.setData({
            word_challenge_status: word_challenge_status,
            whether_clock_in: whether_clock_in,
            insist_day: insist_day,
            word_number: word_number,
            disabled:false,
          })

          if (whether_clock_in == 1) {
            wx.reLaunch({
              url: '../../../tabBar/home/home',
            })
          }

          if(word_challenge_status == 2 ){
            //邀请链接参数
            var token = app.globalData.token
            wx.request({
              url: app.globalData.HOST + "/various/show_invite_link_inner.do",
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': token
              },
              success: (res) => {
                var that = this;
                console.log(res.data)
                var data = res.data
                if (data.status == 200) {
                  var challenge_insist_day = data.data.insist_day
                  if (challenge_insist_day != undefined) {
                    that.setData({
                      challenge_insist_day: challenge_insist_day,
                    })
                  }
                } else {
                  if (data.status == 400 && data.msg == '身份认证错误！') {
                    that.getToken()
                  }
                }
              },
              fail: (res) => {
                console.log(res)
              }
            }) 
          }
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })


    wx.request({
      url: app.globalData.HOST + "/home/clock_history.do",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success: (res) => {
        console.log(res.data)
        var data = res.data
        if (data.status == 400 && data.msg == '身份认证错误！') {
          this.getToken()
        } else if (data.status == 200) {

          let clock_list = data.data[0]

          var total_days = 0

          for (var key in data.data) {
            total_days = total_days + data.data[key].length
            }

          if(total_days!= undefined &&total_days!=0){
            this.setData({
              total_days: total_days
            })
          }
         
          console.log(clock_list)

          if(clock_list == undefined){
            clock_list = []
          }
          this.setData({
            clock_list: clock_list
          })
          this.getCalendar(clock_list)
        }
      },
      fail: (res) => {

      }
    })

    let self = this;
    //获取热门推荐文章
    wx.request({
      url: app.globalData.HOST + '/home/nextRecommendations.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      data: {
        page: 1
      },
      success(res) {
        console.log(res)
        if (res.data.status == 200) {
          var newList = res.data.data.recommendations
          self.setData({
            articleList: newList
          })
        }
      },
      fail(res) {
        console.log(res)
      }
    })

    //获取用户打卡结果页信息
    wx.request({
      url: app.globalData.HOST + '/home/getResultInfo.do',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      success(res) {
        console.log(res)
        if (res.data.status == 200) {
          var data = res.data.data
          self.setData({
            userStudyInfo: data.user,
            insist_day_num: parseInt(data.user.insist_day) + 1,
            bannerInfo: data.banner,
            feedInfo: data.feeds,
            sign_card_num: parseInt(data.user.insist_day) % 28  +1,
            isShowFootBanner: data.banner.foot_control == 1 ? true : false
          })
          self.getDate()
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  getToken: function() {
    wx.login({
      success: (res) => {
        var code = res.code
        console.log(res)
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

                if(res.data.status == 200){
                  console.log(res.data)
                  var token = res.data.data
                  // console.log("token = " + token)
                  // this.globalData.token = token
                  // wx.setStorage({
                  //   key: 'token',
                  //   data: token,
                  // })
                  // app.globalData.token = token
                  this.loadData(token)
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
                console.log("test point")
                var token = res.data.data
                // console.log(token)
                // console.log(this)
                // this.globalData.token = token
                // wx.setStorage({
                //   key: 'token',
                //   data: token,
                // })
                // app.globalData.token = token
                this.loadData(token)
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

  // onSignTap: function(event) {
  //   console.log(event.detail.formId)
  //   let form_id = event.detail.formId
  //   var token = app.globalData.token
  //   var HOST = app.globalData.HOST
  //   wx.request({
  //     url: HOST + '/various/collect_form_id.do',
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       'token': token
  //     },
  //     data: {
  //       form_id: form_id
  //     },
  //     success: (res) => {
  //       if (res.data.status == 200) {
  //         console.log("success")
  //       } else {
  //         console.log(res)
  //       }
  //     },
  //     fail: (res) => {
  //       console.log(res)
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.myToast = this.selectComponent("#my-toast");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    // if (this.data.requestToSign) {
    //   var pages = getCurrentPages()
    //   let beforePage = pages[0]
    //   beforePage.loadData(app.globalData.token)
    //   beforePage.doSignWork()
    // }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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

    if (this.data.insist_day != undefined && this.data.word_number != undefined) {
    
    // var share_imgs = app.globalData.share_imgs
    // var share_texts = app.globalData.share_texts
    // var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    // var share_img = share_imgs[choose_number]
    // var share_text = share_texts[choose_number]


    //打卡分享图 
    var num_share_imgs = 60
    var share_imgs = new Array()
    for(var i=0;i<num_share_imgs;i++){
      var share_img = "https://file.ourbeibei.com/l_e/share_pic/sign_share_img" + String(i+1) + ".png"
      share_imgs[i] = share_img
    }

    var choose_number = parseInt(Math.random() * share_imgs.length, 10)
    var share_img = share_imgs[choose_number]

    let share_insist_day = this.data.insist_day
    let share_word_number = this.data.word_number
    var share_text = '我在背呗已经学习了' + String(share_insist_day) + '天，掌握' + String(share_word_number) + '个单词'

    if (this.data.is_sign == false) {
      console.log("今日未打卡，正在打卡中...")
      this.doSignWork()
    }

    return {

      title: share_text,
      path: 'page/tabBar/home/home',
      imageUrl: share_img,


      // success: (res) => {
      //   console.log('--- 转发成功回调 ---', res);
      //   console.log('--- shareTickets ---', res.shareTickets);
      //   if (this.data.is_sign == false) {
      //     this.doSignWork()
      //   }
      // },
      // fail: (res) => {
      //   if (this.data.is_sign == false) {
      //     wx.showModal({
      //       title: '提示',
      //       content: '分享失败了噢...成功分享赢奖品~',
      //     })
      //   }
      // }

      // success: (res) => {
      //   //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
      //   //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
      //   //获取用户设备信息
      //   wx.getSystemInfo({
      //     success: (d) => {
      //       console.log(d)
      //       //判断是Android还是IOS
      //       if (d.platform == 'android') {
      //         wx.getShareInfo({
      //           shareTicket: res.shareTickets,
      //           success: (info) => {
      //             //记录打卡
      //             // this.doSignWork()
      //             this.setData({
      //               requestToSign: true
      //             })
      //             wx.navigateBack({

      //             })
      //           },
      //           fail: (info) => {
      //             wx.showModal({
      //               title: '提示',
      //               content: '分享到好友无效噢',
      //               showCancel: false
      //             })
      //           }
      //         })
      //       }
      //       if (d.platform == 'ios') {
      //         if (res.shareTickets != undefined) {
      //           console.log("分享到群")
      //           wx.getShareInfo({
      //             shareTicket: res.shareTickets,
      //             success: (info) => {
      //               //打卡
      //               // this.doSignWork()
      //               this.setData({
      //                 requestToSign: true
      //               })
      //               wx.navigateBack({

      //               })
      //             }
      //           })
      //         } else {
      //           //分享到个人
      //           wx.showModal({
      //             title: '提示',
      //             content: '分享到好友无效噢',
      //             showCancel: false
      //           })
      //         }
      //       }
      //     },
      //   })
      // },
      // fail: (res) => {
      //   console.log(res)
      // }
    }
    }
  },

  onFeedScroll: function() {
    wx.reLaunch({
      url: '../../../tabBar/home/home?action=onFeedScroll' + '&isHide=' + 100,
    })
  },


  onPostChance: function (event) {
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
          console.log("success")
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  doSignWork: function() {
    console.log("开始打卡")
    var token = app.globalData.token
    var HOST = app.globalData.HOST
      wx.request({
        url: HOST + '/home/clock_in.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token
        },
        success: (res) => {
          if (res.data.status == 200) {
            console.log("打卡成功")
            setTimeout(function () {
              this.change_is_sign
            }, 350)
            this.loadData(token)
            var beforePage = getCurrentPages()[0]
            beforePage.loadData(app.globalData.token)
          }
          else {
            console.log("打卡失败")
            console.log(res.data.msg)
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2400,
            })
          }

        },
        fail: (res) => {
          console.log(res)
        }
      })
  },


  change_is_sign:function(){
    this.setData({
      is_sign: true
    })
  },
  onFeedSwiperChange: function (event) {
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

    if (current == length - 2) {
      var page = parseInt((length - 2) / 5) + 2
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
            if (res.data.status == 200) {
              var newList = res.data.data.recommendations
              if (JSON.stringify(newList) == '[]') {
                self.setData({
                  isPageEnd: true
                })
                return
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

  onHotArticleTap: function (event) {
    console.log(event.currentTarget.dataset)
    var feed_id = event.currentTarget.dataset.article_id
    if (feed_id != null && feed_id != undefined) {
      wx.navigateTo({
        url: '/page/home/pages/feed/feed?id=' + feed_id,
      })
    }
  },
  onOriginFeedTap() {
    var feed_id = this.data.feedInfo.id
    if (feed_id != null && feed_id != undefined) {
      wx.navigateTo({
        url: '/page/home/pages/feed/feed?id=' + feed_id+'&from_sign_page=true',
      })
    }
  },

  //新结果页相关

  getDate() {
    var date = new Date;
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    this.setData({
      date_string: y + "." + m + "." + d
    })
  },
  fadeInDialog: function (e) {
    this.setData({
      isShowDownSuccessPop: !this.data.isShowDownSuccessPop,
    })

    var anim = wx.createAnimation({
      duration: 0,
      timingFunction: 'step-start'
    })

    anim.scale(0.5, 0.5).step()
    this.setData({
      scopeAnimation: anim.export()
    })

    anim = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    })

    anim.scale(1, 1).step()
    this.setData({
      scopeAnimation: anim.export()
    })
  },
  onFootBannerTap() {
    console.log(this.data.bannerInfo.foot_href)
    if (this.data.bannerInfo.foot_href === 'page/tabBar/home/home') {
      wx.switchTab({
        url: "/page/tabBar/home/home",
        complete(res) {
          console.log(res)
        }
      })
    } else {
      if (this.data.bannerInfo.foot_href != null && this.data.bannerInfo.foot_href != undefined) {
        wx.navigateTo({
          url: "/" + this.data.bannerInfo.foot_href,
          complete(res) {
            console.log(res)
          }
        })
      } else {
        return
      }
    }
  },
  onFootBannerCloseTap() {
    this.setData({
      isShowFootBanner: false
    })
    wx.request({
      url: app.globalData.HOST + '/zbh/noFootBanner.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': app.globalData.token
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  onGetBookTap: function () {
    let that = this
    if (this.data.bannerInfo.middle_activity == 0) {
      this.setData({
        isShowLeadContactPop: true
      })
      wx.setClipboardData({
        data: "Bbbdc676",
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
            }
          })
        }
      })
    } else {
      if (this.data.bannerInfo.middle_href === 'page/tabBar/home/home') {
        wx.switchTab({
          url: "/page/tabBar/home/home",
          complete(res) {
            console.log(res)
          }
        })
      } else {
        if (this.data.bannerInfo.middle_href != null && this.data.bannerInfo.middle_href != undefined) {
          wx.navigateTo({
            url: "/" + this.data.bannerInfo.foot_href,
            complete(res) {
              console.log(res)
            }
          })
        } else {
          return
        }
      }
    }
  },
  hideLeadContactPop() {
    this.setData({
      isShowLeadContactPop: false
    })
  },
  drawImg: function () {
    wx.showLoading({
      title: '图片保存中',
    })
    let that = this;
    var rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function (res) {
        rpx = res.windowWidth / 375;
        that.setData({
          screenWidth: res.windowWidth
        })
      },
    })
    var scale = 1334 / 750; //背景图片的高与宽之比
    console.log(scale)
    let studyTime = that.data.userStudyInfo.learned_time
    let insist_day = parseInt(that.data.userStudyInfo.insist_day)+1
    let word_number = that.data.userStudyInfo.learned
    let user_name = that.data.userStudyInfo.username
    let portrait_image = that.data.userStudyInfo.portrait
    let background_image = "https://file.ourbeibei.com/l_e/static/mini_program_icons/img_sign_card_share_" + that.data.sign_card_num + ".jpg"
    let scWidth = that.data.screenWidth
    let scHeight = that.data.screenWidth * scale


    const ctx = wx.createCanvasContext('myCanvas');
    ctx.width = scWidth * 2
    ctx.height = scHeight * 2

    //绘制背景图
    wx.getImageInfo({
      src: background_image,
      fail(res) {
        wx.hideLoading()
        that.showMyToast("图片保存失败,请重试")
      },
      success(res1) {
        ctx.drawImage(res1.path, 0, 0, scWidth, scHeight)
        console.log("背景绘制完成")
        let todayText = that.data.date_string
        var ts1 = 0.01424 * scHeight
        ctx.font = ts1 + 'px Times, Times New Roman, Georgia, serif';
        //绘制日期文字
        ctx.textAlign = "left";
        ctx.setFillStyle('#ffffff');
        ctx.setFontSize(ts1)
        ctx.fillText(todayText, scWidth * 0.071, scHeight * 0.076)


        let ts9 = parseInt(12 * rpx)
        var rectY = 0.1057 * scHeight
        let txtY = rectY + ts9 * 1.36
        ctx.beginPath()
        let ts10 = parseInt(45 * rpx)
        let numY = txtY + 0.065 * scHeight
        ctx.setFillStyle("#fff")
        ctx.font = 'bold ' + ts10 + 'px "Times New Roman",Georgia,Serif'
        let studyNumW = ctx.measureText(studyTime).width
        ctx.textAlign = "left";
        if (studyTime.length >= 3) {
          ctx.setFontSize(parseInt(40 * rpx))
          ctx.fillText(studyTime, 0.1073 * scWidth, numY)
        } else {
          ctx.fillText(studyTime, 0.1373 * scWidth, numY)
        }
        wx.getImageInfo({
          src: portrait_image,
          fail(res) {
            wx.hideLoading()
            that.showMyToast("图片保存失败,请重试")
          },
          success(res2) {
            ctx.save()
            //绘制用户信息：头像，名称
            let circleR = 0.061 * scWidth / 2
            let circleX = 0.076 * scWidth
            let circleY = 0.244 * scHeight
            ctx.beginPath()
            ctx.arc(circleX + circleR, circleY + circleR, circleR, 0, 2 * Math.PI)
            ctx.clip()
            ctx.drawImage(res2.path, circleX, circleY, circleR * 2, circleR * 2)
            ctx.restore()


            let ts2 = 10 * rpx
            ctx.setFontSize(ts2)
            ctx.setFillStyle("#fff")
            ctx.textAlign = "left";
            ctx.fillText(user_name, 0.1547 * scWidth, circleY + circleR + (ts2 / 2))

            //绘制数字
            ctx.beginPath()
            let text1Y = 0.948 * scHeight;
            let text1X = 0.67 * scWidth;
            let ts7 = 24 * rpx
            let wordNum = word_number
            ctx.font = 'bold ' + parseInt(ts7) + 'px sans-serif'
            var wordNumW = ctx.measureText(wordNum).width
            //渐变色
            let grd2 = ctx.createLinearGradient(text1X - wordNumW, text1Y, text1X, text1Y)
            grd2.addColorStop(0, '#1ae8c8')
            grd2.addColorStop(1, '#4a8aff')
            ctx.setFillStyle(grd2)
            ctx.textAlign = "right";
            ctx.fillText(wordNum, text1X, text1Y)

            ctx.beginPath()
            let dayNum = insist_day
            var dayNumW = ctx.measureText(dayNum).width
            let text2X = 0.9 * scWidth
            let grd3 = ctx.createLinearGradient(text2X - dayNumW, 0, text2X, 0)
            grd3.addColorStop(0, '#1ae8c8')
            grd3.addColorStop(1, '#4a8aff')
            ctx.setFillStyle(grd3)
            ctx.fillText(dayNum, text2X, text1Y)

            ctx.draw(false, function () {
              setTimeout(function(){
                console.log("绘制完成")
                wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: scWidth,
                  height: scHeight,
                  destWidth: scWidth * 4,
                  destHeight: scHeight * 4,
                  canvasId: 'myCanvas',
                  success: function (res) {
                    console.log('朋友圈分享图生成成功:' + res.tempFilePath);
                    that.saveImg(res.tempFilePath)
                  },
                  fail(res) {
                    console.log(res)
                    wx.hideLoading()
                    that.showMyToast("图片保存失败,请重试")
                  },
                  complete(res) {
                    console.log(res)
                  }
                })
              },200)
            })
          }
        })
      }
    })


  },


  // 保存图片
  saveImg: function (image_path) {
    let that = this;
    // console.log("开始保存图片")
    //图片保存到本地
    wx.saveImageToPhotosAlbum({
      filePath: image_path,
      success: function (data) {
        wx.hideLoading()
        that.setData({
          isShowSharePop: false,
        })
        that.fadeInDialog();
      },
      fail: function (err) {
        wx.hideLoading()
        that.showMyToast("图片保存失败,请重试")
        // console.log("保存失败")
        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          // 微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: modalSuccess => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
              })
            }
          })
        } else {
          console.log(err.errMsg)
        }
      },
    })
  },

 //关闭分享卡片弹窗
  onSignPopTap(){
    this.setData({
      isShowSharePop:false
    })
  },
  //展示页面中间的toast组件
  showMyToast(content) {
    this.myToast.setToastContent(content)
    this.myToast.showToast(3000)
  },
})