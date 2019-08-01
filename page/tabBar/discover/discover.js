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

    showLikeToast: false,
    setLikeTimer:'', //关于偷偷喜欢你和超级曝光toast展示的两个定时器
    setLightenTimer:'',
    is_show_more_cards: false,
    is_show_time_reversal: false,
    is_vip: false,
    isInLove: false,
    // showLightenToast: true,
    ic_soundless_like_common: app.globalData.FTP_ICON_HOST + 'ic_soundless_like.png',
    ic_lighten_common: app.globalData.FTP_ICON_HOST + 'super_lighten.png',
    ic_gender_male: app.globalData.FTP_ICON_HOST + 'male.png',
    ic_gender_female: app.globalData.FTP_ICON_HOST + 'female.png',
    ic_like_common: app.globalData.FTP_ICON_HOST + 'like_unclick.png',
    ic_super_like_common: app.globalData.FTP_ICON_HOST + 'super_like_unclick.png',
    ic_time_reversal: app.globalData.FTP_ICON_HOST + 'time_reversal.png',
    ic_watch_more: app.globalData.FTP_ICON_HOST + 'watch_more_white.png',
    bg_lead_text: app.globalData.FTP_ICON_HOST + 'bg-match-lead.png',
    ic_next: app.globalData.FTP_ICON_HOST + 'ic-next.png',
    img_like_intro: app.globalData.FTP_ICON_HOST + 'img-like-intro.png',
    img_superlike_intro: app.globalData.FTP_ICON_HOST + 'img-superlike-intro.png',


    isShowSoundlessLikeCardList: false, //展示偷偷喜欢你的卡片列表
    isSuperLighten: false, //超级曝光是否开启
    isNeedChangePhoto: false, //已存在用户资料 但需要更换照片提升可能


    //用来设置vip与普通用户的图标
    ic_soundless_like: '',
    ic_soundless_like_check: '',
    ic_lighten: '',
    ic_lighten_check: '',
    ic_like: '',
    ic_like_check: '',
    ic_super_like: '',
    ic_super_like_check: '',

    //用来设置不同等级和类型的匹配关系 (男女，女女，*男男) 
    bg_partner_card: '',
    img_card_title: '',



    ic_soundless_like_common_check: app.globalData.FTP_ICON_HOST + "ic_soundless_like_check.png",
    ic_soundless_like_vip: app.globalData.FTP_ICON_HOST + "ic_soundless_like_vip_normal.png",
    ic_soundless_like_vip_check: app.globalData.FTP_ICON_HOST + "ic_soundless_like_vip_check.png",
    ic_like_common_check: app.globalData.FTP_ICON_HOST + "ic_like_check.png",
    ic_like_vip: app.globalData.FTP_ICON_HOST + "ic_like_vip_normal.png",
    ic_like_vip_check: app.globalData.FTP_ICON_HOST + "ic_like_vip_check.png",
    ic_super_like_common_check: app.globalData.FTP_ICON_HOST + "ic_super_like_check.png",
    ic_super_like_vip: app.globalData.FTP_ICON_HOST + "ic_super_like_vip_normal.png",
    ic_super_like_vip_check: app.globalData.FTP_ICON_HOST + "ic_super_like_vip_check.png",
    ic_lighten_common_check: app.globalData.FTP_ICON_HOST + "ic_lighten_check.png",
    ic_lighten_vip_check: app.globalData.FTP_ICON_HOST + "ic_lighten_vip_check.png",
    ic_lighten_vip: app.globalData.FTP_ICON_HOST + "ic_lighten_vip_normal.png",
    img_super_like_you: app.globalData.FTP_ICON_HOST + "img_super_like_you.png",
    bg_vip_crown: app.globalData.FTP_ICON_HOST + "bg_vip_crown.png",
    platform: '',
    vipContent: 'VIP限时特惠',
    isFirstTime: true,
    isShowLeadPage1: false,
    isShowLeadPage2: false,
    isTodayFirstTimeTapLiekOrSuperLike: false,
    userInfoStatus: 0, //用户基本信息的上传状态  0代表未上传，1代表资料审核中，2代表审核通过
    isShowInforPop: false, //是否展示完善资料弹窗
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


    bg_matchday: app.globalData.FTP_ICON_HOST + 'bg-matchday.png',
    btn_meetta: app.globalData.FTP_ICON_HOST + 'btn-meetta.png',
    btn_break: app.globalData.FTP_ICON_HOST + 'btn-break.png',
    btn_remindta: app.globalData.FTP_ICON_HOST + 'btn-remindta.png',
    img_stop1: app.globalData.FTP_ICON_HOST + 'img-stop1.png',
    img_stop2: app.globalData.FTP_ICON_HOST + 'img-stop2.png',
    ic_heart: app.globalData.FTP_ICON_HOST + 'ic_progress_heart.png',
    img_restart_text: app.globalData.FTP_ICON_HOST + 'img-restart-text.png',

    dating_card_list: [],
    like_you_list: [],
    super_like_list: [],
    common_card_list: [],
    more_card_list: [],
    time_reversal_list: [],
    partner_level: 1, //匹配卡片的等级 80单词进度完成一次提升一级  卡片更换一次  6次更换后 可以进行重温回忆
    match_type: 0, //  0代表男女，1女女，2男男
    studiedWordsTotalNumber: 0, //匹配成功后的总单词数  单词总数达到6X80 = 480时 进度条消失，重温回忆按钮出现
    wordMaxNumberInLevel: 80, //当前匹配等级的进度条上限
    isShowRestartBtn: false,
    img_my_photo: '',
    img_lover_photo: '',
    my_name: '',
    lover_name: '',
    lover_vip: 0,
    match_day_number: 999,
    
    //模拟虚拟用户列表
    timeReverseUserList:[{
      cover:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564214299363&di=e9102b012bc03040aa2de8b661e4309f&imgtype=0&src=http%3A%2F%2Fimg.9ku.com%2Fgeshoutuji%2Fsingertuji%2F3%2F33425%2F33425_1.jpg',
      name:'海龟',
    },{
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564808960&di=c4ca01856c4d84ac10434ff8d008dbb0&imgtype=jpg&er=1&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201507%2F06%2F20150706123803_4WcLm.thumb.700_0.png',
        name: '晒红脸',
    },{
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564213603907&di=394e713004b01a2d2f80535365670882&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201710%2F02%2F20171002103056_JseEA.thumb.700_0.jpeg',
        name: '嘿嘿嘿灰',
    },{
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564809057&di=6a74cdcdba5f87011fe6f6aec20a64ae&imgtype=jpg&er=1&src=http%3A%2F%2Fimg1.gtimg.com%2F9%2F940%2F94088%2F9408820_640x640_0.jpg',
        name: '洛城泡椒',
    },{
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564214338303&di=2dfffe04d797c5047045cd870a0d9d3a&imgtype=0&src=http%3A%2F%2Fpic3.zhimg.com%2F50%2Fv2-40135aa64c934769ec65e34621732c86_hd.jpg',
        name: '贝壳和你',
    },{
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564214338306&di=a0f1c87c616a15c2f2050c3afca44191&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F189fa850760d43ac493ac5d9bad472b02880cd93.jpg',
        name: '斯多贝利',
    }],

    moreCardUserList: [{
      cover: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=247709105,3771367742&fm=15&gp=0.jpg',
      name: '刺猬',
    }, {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564213603909&di=eb71db2acdb12cf87f72ff927dec14e8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201902%2F02%2F20190202232517_NQPUW.thumb.700_0.png',
        name: '乐乐乐了',
      }, {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564213603907&di=394e713004b01a2d2f80535365670882&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201710%2F02%2F20171002103056_JseEA.thumb.700_0.jpeg',
        name: '慢切斯特',
      }, {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564213603906&di=33175647b7ee659751b057ec5ae272c1&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201709%2F28%2F20170928040302_EQXki.jpeg',
        name: '虎皮波霸',
      }, {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564213727019&di=9c5551ac0d568f0e1ea3552eacc25735&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201711%2F05%2F20171105194003_L4XMt.thumb.700_0.jpeg',
        name: '2先生',
      }, {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1564213603903&di=3df405cf0d6f2fba0860c3d93e459b31&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201610%2F10%2F20161010141613_jQFwm.jpeg',
        name: '伯舒小姐',
      }],

    virtualUserCover:'',
    virtualUserName:'',
    moreUserCover:'',
    moreUserName:'',
    isShowTimeReversalToast:false,
    isShowMoreCardToast:false,

    isHideProgressBar:false,

    firstOffsetHeight:0,
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
    if (options != undefined ) {
      this.setData({
        options: options
      })

      //只有option存在时才能进行以下判断，不然重载页面时出错
      if (options.action != undefined) {
        this.setData({
          action: options.action
        })
      }

      //匹配成功通知
      if (options.isMatch === 1 || options.isMatch === '1') {
        this.showMatchSuccessPop()
      }

      //vip续费通知
      if (options.isNeedRemindContinue === 1 || options.isNeedRemindContinue === '1') {
        //当用户为vip时改变弹窗文字内容
        this.setData({
          vipContent: '立即续费VIP'
        })
        this.showVipIntroPop()
      }

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
    this.popOpenVipSuccess = this.selectComponent("#pop-openvip");
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
    this.cardToast = this.selectComponent("#card-toast");



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
      console.log("截取的照片路径：" + this.data.img_photo_example)
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
  getUserMatchData() {
    let self = this;
    wx.request({
      url: app.globalData.HOST + '/operation/foundPageShowDatingCare.do',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.status === 200) {
          console.log(res.data)
          let data = res.data.data
          let selfData = self.data;
          self.setData({
            dating_card_list:data.datingCards!=undefined ? data.datingCards:[],
            common_card_list: data.datingCards != undefined ? self.getCommonFromList(data.datingCards) : [],
            is_vip: data.datingVip === 1?true:false,
            is_show_more_cards: data.datingVip === 1?true:false,
            is_show_time_reversal: data.datingVip === 1?true:false,
            isInLove: data.isInLove === 1?true:false,
            isExistCompleteInfor: data.infoComplete === 1?true:false,
            isFirstTime: data.firstTime === 1?true:false,
            isTodayFirstTimeTapLiekOrSuperLike: data.todayFirstTime === '1' ? true : false,
            
            userInfoStatus: data.userStatus,
          });

          console.log("所有卡片列表：" + JSON.stringify(selfData.dating_card_list))
          console.log("普通卡片列表：" + JSON.stringify(selfData.common_card_list))
          

          
          //如果第一次进入并且没有报名语境阅读
          if (selfData.isFirstTime) {
            self.setScrollOffset()
            self.setData({
              isShowLeadPage1: true,
            })
          }

          if (selfData.isInLove) {
            let myInfo = data.myInfo
            let loverInfo = data.loverInfo
            var match_type;
            if (myInfo.gender === 0 && loverInfo.gender === 0) {
              match_type = 2
            } else if (myInfo.gender === 0 && loverInfo.gender === 1) {
              match_type = 0
            } else if (myInfo.gender === 1 && loverInfo.gender === 0) {
              match_type = 0
            } else if (myInfo.gender === 1 && loverInfo.gender === 1) {
              match_type = 1
            }

            self.setData({
              img_my_photo: myInfo.portrait,
              img_lover_photo: loverInfo.portrait,
              match_type: match_type,
              my_name: myInfo.username,
              lover_name: loverInfo.username,
              lover_vip: data.lover_vip,
              match_day_number: data.loveDays,
              studiedWordsTotalNumber: data.wordNumber
            })
            //canvas绘制匹配页面的进度条
            self.drawProgressBar();
            console.log(selfData.img_my_photo)
            self.setMatchLevel() //根据背单词总数设置匹配等级
            self.setCardStyle() //根据匹配双方性别和匹配等级来设置Card风格
            
            return
          }

          //如果是vip
          if (data.datingVip === 1) {    
            //vip获取倒流卡片
            self.getTimeReservalList();
            //vip关闭 偷偷喜欢你 曝光提示toast
            self.setData({
              showLikeToast: false,
              //展示更多卡片
              more_card_list: self.getMoreFromList(selfData.dating_card_list)
            })
            //获取更多卡片??
          }else{
            //非vip的情况下的时光倒流机和查看更多卡片轮播
            var randomTime = Math.random() *3000;
            setTimeout(function(){
              self.setTimeReversalToast()
            },randomTime)
            
          }
          //设置图标
          self.setIconStyle();

        } else {
          console.log(res.data)
        }
      },
      fail(res) {
        console.log('requestData fail')
      }
    })
  },
  //获取用户vip支付参数
  getVipPayInfo() {
    let self = this;
    wx.request({
      url: app.globalData.HOST + '/operation/datingVipPay.do',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.status === 200) {
          console.log(res.data)
          let data = res.data.data
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success(res) {
              console.log(res)
              self.popVipIntro.hidePopup()
              self.showOpenVipSuccessPop()
              wx.showTabBar({})
            },
            fail(res) {
              console.log(res)     
            }
          })
        } else {
          console.log(res.data)
        }
      },
      fail(res) {
        console.log('requestData fail')
      }
    })
  },
  getTimeReservalList() {
    let self = this;
    wx.request({
      url: app.globalData.HOST + '/operation/backInTime.do',
      method: 'POST',
      header: {
        'token': app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data)
        if (res.data.status === 200) {
          self.setData({
            time_reversal_list: res.data.data.datingCards
          })
        }
      },
      fail(res) {}
    })
  },

  //看看有谁偷偷喜欢你
  onShowSoundlessLikeYouTap: function(e) {
    console.log('点击看谁偷偷喜欢你')
    if (!this.data.is_vip) {
      wx.hideTabBar({})
      this.showVipIntroPop()
      return
    }

    if (this.data.userInfoStatus === 0) {
      console.log(this.data.userInfoStatus)
      //未上传基本资料（头像、性别、意愿） 或者资料审核失败
      this.setData({
        isShowInforPop: !this.data.isShowInforPop
      })
      return;
    }
    if (!this.data.isShowSoundlessLikeCardList) {
      let self = this;
      wx.request({
        url: app.globalData.HOST + '/operation/lookWhoLikeMe.do',
        method: 'POST',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log(res.data)
          if (res.data.status === 200) {
            //如果无人喜欢 则弹出更换照片提示
            if (JSON.stringify(res.data.data.likeMe) === '[]' && JSON.stringify(res.data.data.superLikeMe) === '[]') {
              if (self.data.userInfoStatus != 0) {
                self.setData({
                  topToastContent: '更换靓照，提升魅力',
                  isShowInforPop: !self.data.isShowInforPop,
                  sexFlag: 999,
                  wantFlag: 999, //此处设999用于顶部toast隐藏的条件判断
                  isNeedChangePhoto: true
                })

              } else {
                self.showCardToast("基本资料未完善")
              }
              return
            }
            self.showCardToast("查看有谁喜欢你")
            self.setData({
              like_you_list: res.data.data.likeMe,
              super_like_list: res.data.data.superLikeMe
            })
            self.deleteSuperLikeInLike(self.data.like_you_list, self.data.super_like_list)
            self.setData({
              isShowSoundlessLikeCardList: !self.data.isShowSoundlessLikeCardList,
              like_you_list: self.data.like_you_list //更新数据
            })
          }
        },
        fail(res) {}
      })
    } else {
      this.setData({
        isShowSoundlessLikeCardList: !this.data.isShowSoundlessLikeCardList
      })
      this.showCardToast("关闭喜欢你的卡片列表")
    }
  },

  //十倍曝光，超级匹配
  onSuperLightenTap: function(e) {
    let self = this
    console.log('点击超级曝光')
    if (this.data.is_vip) {

      wx.request({
        url: app.globalData.HOST + '/operation/superExposed.do',
        method: 'POST',
        header: {
          'token': app.globalData.token,
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log(res.data)
          if (res.data.status === 200) {
            self.setData({
              isSuperLighten: !self.data.isSuperLighten
            })
            self.showCardToast("超级曝光已开启")
          } else if (res.data.status === 400) {
            self.showCardToast("今天已使用过超级曝光,\r\n请明天再来！")
          }
        },
        fail(res) {}
      })
    } else {
      wx.hideTabBar({})
      this.showVipIntroPop()
    }
  },

  closeLikeToastTap: function(e) {
    let self = this;
    clearTimeout(self.data.setLikeTimer)
    self.setData({
      showLikeToast : false,
      showLightenToast : true,
    })
    self.data.setLightenTimer = setTimeout(function () {
      self.setData({
        showLightenToast: false,
      })
    }, 3000)
  },

  closeLightenToastTap: function(e) {
    clearTimeout(this.data.setLightenTimer)
    this.setData({
      showLightenToast : false
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
  onLikeTap: function(options) {
    let self = this;
    let dataset = options.currentTarget.dataset;
    if (this.data.userInfoStatus === 0) {
      //未上传基本资料（头像、性别、意愿） 或者资料审核失败
      this.setData({
        isShowInforPop: !this.data.isShowInforPop
      })
      return;
    }
    //没有添加小呗完善信息,并且当天第一次点击 展示弹窗
    if (this.data.isTodayFirstTimeTapLiekOrSuperLike) {
      //调用记录当天第一次点击喜欢和超级喜欢接口
      this.recordClickLikeBtn()

      if (!this.data.isExistCompleteInfor) {
        this.popBlueWxCode.showPopup();
        return;
      }
    }

    //喜欢按钮接口请求
    wx.request({
      url: app.globalData.HOST + '/operation/likeButton.do',
      method: 'POST',
      header: ({
        'token': app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'
      }),
      data: ({
        'targetId': dataset.userid
      }),
      success(res) {
        if (res.data.status === 200) {
          console.log(res.data)
          
          if (res.data.msg === '成功') {
            self.setArrayIsLikeData(dataset, 1,'1')
            self.showCardToast('你喜欢Ta')
            //判断对方是否也喜欢或者超级喜欢你  如果是 展示成功页面 ，进入旅程则重载页面
            if(dataset.type==="1"||dataset.type==="2"){
              self.popMatchSuccess.showPopup()
            }

          } else if (res.data.msg === '成功取消喜欢') {
            self.setArrayIsLikeData(dataset, 1, '0')
            self.showCardToast('已取消喜欢')
          }
        } else if (res.data.status === 400) {
          console.log(res.data)
          if (res.data.msg === "该用户已与人匹配") {
            self.showCardToast(res.data.msg)
            return
          }
          if (res.data.msg === "还未审核通过卡片") {
            self.showCardToast(res.data.msg)
            return
          }
          //非vip或者点击超过三次？
          self.showVipIntroPop()
          self.showCardToast(res.data.msg)
          wx.hideTabBar({})
        }
      },
    })
  },
  onSuperLikeTap: function(options) {
    let self = this;
    let dataset = options.currentTarget.dataset;
    console.log(dataset)
    if (!this.data.is_vip) {
      this.popVipIntro.showPopup();
      wx.hideTabBar({});
      return;
    }
    if (this.data.userInfoStatus === 0) {
      //未上传基本资料（头像、性别、意愿） 或者资料审核失败
      this.setData({
        isShowInforPop: !this.data.isShowInforPop
      })
      return;
    }

    //没有添加小呗完善信息,并且当天第一次点击 展示弹窗
    if (this.data.isTodayFirstTimeTapLiekOrSuperLike) {
      //调用记录当天第一次点击喜欢和超级喜欢接口
      this.recordClickLikeBtn()

      if (!this.data.isExistCompleteInfor) {
        this.popBlueWxCode.showPopup();
        return;
      }
    }

    //请求超级喜欢接口。
    wx.request({
      url: app.globalData.HOST + '/operation/superLike.do',
      method: 'POST',
      header: ({
        'token': app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'
      }),
      data: ({
        'targetId': dataset.userid
      }),
      success(res) {
        if (res.data.status === 200) {
          console.log(res.data)
          
          if (res.data.msg === '成功') {
            self.setArrayIsLikeData(dataset, 2,'1')
            self.showCardToast('你超级喜欢Ta')
            //判断对方是否也喜欢或者超级喜欢你  如果是 重载页面
            if (dataset.type === "1" || dataset.type === "2") {
              self.popMatchSuccess.showPopup()
            }
          } else if (res.data.msg === '成功取消超级喜欢') {
            self.setArrayIsLikeData(dataset, 2,'0')
            self.showCardToast('已取消超级喜欢')
          }
        } else {
          self.showCardToast(res.data.msg)
          console.log(res)
        }
      },
    })

  },
  //调用记录用户当天第一次喜欢或者超级喜欢按钮
  recordClickLikeBtn() {
    let self = this;

    wx.request({
      url: app.globalData.HOST + '/operation/recordUserClickButton.do',
      method: 'POST',
      header: ({
        'token': app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'
      }),
      success(res) {
        console.log("记录当天第一次点击喜欢按钮接口请求成功" + res.data)
        if (res.data.status === 200) {
          self.setData({
            //本地的数据也置0
            isTodayFirstTimeTapLiekOrSuperLike: false
          })
        }else{
          console.log(res.data.msg)
        }
      },
      fail(res) {
        console.log("记录当天第一次点击喜欢按钮接口请求失败" + res.data)
      }
    })
  },

  //监听选择boy、girl性别的按钮改变 boy 0/ girl 1
  onSexTap: function(event) {
    switch (event.currentTarget.id) {
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
    switch (event.currentTarget.id) {
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
    if (!(this.data.sexFlag < 0) && !(this.data.wantFlag < 0) && (this.data.photoFlag)) {
      this.setData({
        isShowTopToast: false
      })
    }
  },

  //完善资料或更换照片弹窗信息提交按钮事件
  onInforPostTap: function(event) {
    let self = this;
    if (this.data.isShowTopToast) {
      //顶部文字未消除，说明资料未填写完整
      this.setData({
        isShowBottomToast: true,
        bottomToastContent: '有未填写的信息噢!'
      })
      //三秒后消失
      setTimeout(function() {
        self.setData({
          isShowBottomToast: false
        })
      }, 3000)
      return
    }

    var photoUrl = app.globalData.cropPhotoSrc
    var gender = this.data.sexFlag
    var intention = this.data.wantFlag
    console.log("gender:"+gender)
    console.log("intent:" +intention)

    switch (event.currentTarget.id) {
      //上传信息
      case 'btn-post-infor':
        this.showCardToast("正在上传信息···")
        console.log('you post infor')
        //请求信息提交接口
        wx.uploadFile({
          url: app.globalData.HOST + '/operation/uploadDatingCard.do',
          header: ({
            'content-type': 'application/x-www-form-urlencoded',
            'token': app.globalData.token
          }),
          filePath: photoUrl,
          name: 'cover',
          method: 'POST',
          formData: ({
            'gender': gender,
            'intention': intention,
          }),
          success(res) {
            console.log(res.data)
            var jsonObj = JSON.parse(res.data)
            if (jsonObj.status === 200) {
              console.log(res.data)
              self.showCardToast("成功提交!页面数据刷新")
              self.hideInforPop()
              self.onLoad()
              // if (!self.data.isExistCompleteInfor) {
              //   self.hideInforPop()
              //   self.popBlueWxCode.showPopup();
              // }
            } else {
              console.log(res.data)
              self.showCardToast("提交失败!"+jsonObj.msg)
            }
          },
          fail(res) {
            console.log('failrequest')
            self.showCardToast("提交异常!" + res.data.msg)
          },
          complete(res){
            console.log(res.data)
          }
        })
        break
        // 如果不存在更多完善资料 弹出完善更多资料二维码窗 
        //上传更换的照片
      case 'btn-post-photo':
        //来自更换照片弹窗的提交
        this.showCardToast("正在上传照片···")
        //请求更换照片提交接口  成功回调后判断是否存在完善资料 否this.popBlueWxCode.showPopup();
        wx.uploadFile({
          url: app.globalData.HOST + '/lzy/update_cover.do',
          header: ({
            'content-type': 'application/x-www-form-urlencoded',
          }),
          filePath: photoUrl,
          name: 'cover',
          method: 'POST',
          formData: ({
            'id': app.globalData.MyUserId
          }),
          success(res) {
            console.log(res.data)
            var jsonObj = JSON.parse(res.data)
            if (jsonObj.status === 200) {
              self.showCardToast("成功提交!")
              if (!self.data.isExistCompleteInfor) {
                self.hideInforPop()
                self.popBlueWxCode.showPopup();
              }
            } else {
              console.log(res.data)
              self.showCardToast("提交失败!"+jsonObj.msg)
            }
          },
          fail(res) {
            console.log('failrequest')
            self.showCardToast("提交异常!" + res.data.msg)
          }
        })
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
  showOpenVipSuccessPop: function() {
    console.log('openvipSuccess');
    this.popOpenVipSuccess.showPopup();
    this.setData({
      isHideProgressBar: true
    })
  },
  showLeadPop: function() {
    this.popLead.showPopup();
    this.setData({
      isHideProgressBar: true
    })
  },
  showVipIntroPop: function() {
    this.popVipIntro.showPopup();
    wx.hideTabBar({
      aniamtion: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData({
      isHideProgressBar: true
    })
  },
  showPinkWxCodePop: function() {
    this.popPinkWxCode.showPopup();
  },
  showContactUsPop: function() {
    this.popContactUs.showPopup();
  },
  showMeetCodePop: function() {
    this.popMeetCode.showPopup();
    this.setData({
      isHideProgressBar: true
    })
  },
  showBreakPop: function() {
    this.popBreak.showPopup();
    this.setData({
      isHideProgressBar: true
    })
  },
  showRemindPop: function() {
    this.popRemind.showPopup();
    this.setData({
      isHideProgressBar: true
    })
  },
  showRestartPop: function() {
    this.popRestart.showPopup();
    this.setData({
      isHideProgressBar: true
    })
  },
  showMatchSuccessPop: function() {
    this.popMatchSuccess.showPopup();
    this.setData({
      isHideProgressBar: true
    })
  },
  hidePopup: function(event) {
    this.setData({
      isHideProgressBar: false
    })
    switch (event.currentTarget.id) {
      case 'pop-openvip':
        this.popOpenVipSuccess.hidePopup();
        this.onLoad()
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
        this.popBreak.hidePopup()
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
      //获取参数并进行支付
      this.getVipPayInfo();
    }
  },

  /*
   * 获取用户访问相册的权限如果成功下载二维码到相册
   */
  getAuthorizeAndDownLoadWXCode(pop) {
    let self = this;
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //没有访问相册权限时申请权限
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 下载二维码并toast提示
              pop.showToast("二维码开始下载");
              self.saveImgToAlbum(pop);
            },
            fail() {
              pop.showToast("访问相册权限被拒绝,用户需手动开启权限")
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
          pop.showToast("二维码开始下载");
          self.saveImgToAlbum(pop);
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /*
   *引导支付弹窗的添加小呗按钮事件
   */
  addStaff: function() {
    console.log('touch add staff button')
    this.getAuthorizeAndDownLoadWXCode(this.popLead);
  },

  /*
   *保存二维码到相册
   */
  saveImgToAlbum: function(pop) {
    let self = this;
    wx.downloadFile({
      //先将二维码下载至项目本地临时路径
      //小呗二维码下载路径
      url: app.globalData.FTP_ICON_HOST + 'img_save_wxcode.png',
      success: function(res) {
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success: function(res) {
              pop.showToast("小呗二维码已保存到手机")
            },
            fail: function(res) {
              pop.showToast("二维码保存失败,请稍后重试");
            }
          })
        }
      },
    })
  },

  //完善更多资料弹窗 下载二维码的点击事件
  onDownloadWxCodeTap: function() {
    this.getAuthorizeAndDownLoadWXCode(this.popBlueWxCode)
  },

  //将卡片组拆为普通卡片组和更多卡片组 
  getCommonFromList(arr) {
    if (JSON.stringify(arr) != '[]') {
      if (arr.length<6) {
        console.log("长度小于5的卡片列")
        return arr
      } else {
        var newArr = []
        for (var i = 0; i < 5; i++) {
          newArr[i] = arr[i]
        }
        console.log("长度大于5的卡片列")
        return newArr
      }
    } else {
      console.log("空的卡片列")
      return arr;
    }
  },
  getMoreFromList(arr) {
    if (JSON.stringify(arr) != '[]') {
      if (arr.length<6) {
        console.log("无更多卡片")
        return []
      } else {
        var newArr = []
        for (var i = 5; i < arr.length; i++) {
          newArr[i-5] = arr[i]
        }
        console.log("有更多的卡片列")
        return newArr
      }
    } else {
      console.log("空的卡片列")
      return arr;
    }
  },
  //删除喜欢数组中 在超级喜欢数组中的已存在用户
  deleteSuperLikeInLike(likeList, superList) {
    console.log("like length" + likeList.length + "super length" + superList.length)
    //遍历likeList
    for (var i = 0; i < likeList.length; i++) {
      console.log("i:" + i)
      for (var j = 0; j < superList.length; j++) {
        console.log("j:" + j)
        console.log("user_id:" + superList[j].user_id)
        if (superList[j].user_id === likeList[i].user_id) {
          var target = likeList.splice(i, 1)
          console.log("iii" + JSON.stringify(target))

          i--;
        }
      }
    }
    console.log("喜欢你的卡片优化" + JSON.stringify(this.data.like_you_list))
  },
  getStrLength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      //单字节加1 
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  },
  //给小于最长字符加上空格保持正确距离
  switchChooseNumberText(number) {
    var str = "总背" + number + "/" + this.data.wordMaxNumberInLevel
    var length = this.getStrLength(str)
    if (length < 13 && length > 0) {
      var k = 13 - length //当前字符距离最长字符长度的差值
      var tempStr = ''
      for (var i = 0; i < k; i++) {
        tempStr += '  '
      }
      str = tempStr + str
    }
    console.log("改变后的字符长度:" + this.getStrLength(str))
    return str

  },
  drawProgressBar() {
    var rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth / 375;
      },
    })

    var scale = this.data.studiedWordsTotalNumber / this.data.wordMaxNumberInLevel; //进度条比例
    var wordsNumberText = this.switchChooseNumberText(this.data.studiedWordsTotalNumber);
    console.log("字符长度:" + this.getStrLength(wordsNumberText))

    var borderHeight = 19 * rpx;
    var borderWidth = 156 * rpx;
    var strokeWidth = 1.5 * rpx; //外框的线条宽度
    var bgSolidWidth = 16 * rpx;
    var tl = strokeWidth / 2; //顶部和左边的缝隙
    var solidWidth = 12 * rpx; //填充条宽度
    var il = (borderHeight - solidWidth - strokeWidth * 2) / 2; //填充条与框边的padding值
    var ctx = wx.createCanvasContext('progressbar-canvas')
    var pi = Math.PI;

    wx.createAnimation({
      duration: 400,
      timingFunction: '"linear"',
      delay: 0,
    })

    //内部solid白色背景绘制
    ctx.beginPath()
    ctx.moveTo(borderHeight / 2, borderHeight / 2 + tl)
    ctx.setLineCap("round")
    ctx.setLineWidth(bgSolidWidth)
    ctx.setStrokeStyle("#ffffff")
    ctx.lineTo(borderWidth + tl, borderHeight / 2 + tl)
    ctx.stroke()

    //外框绘制
    ctx.beginPath()
    ctx.setStrokeStyle("#363e49")
    ctx.setFillStyle("#ffffff")
    ctx.moveTo(borderHeight / 2 + tl, tl)
    ctx.setLineWidth(strokeWidth)
    ctx.lineTo(borderWidth + tl, tl)
    ctx.arc(borderWidth + tl, borderHeight / 2 + tl, borderHeight / 2, 1.5 * pi, 0)
    ctx.arc(borderWidth + tl, borderHeight / 2 + tl, borderHeight / 2, 0, 0.5 * pi)
    ctx.lineTo(borderHeight / 2 + tl, borderHeight + tl);
    ctx.arc(borderHeight / 2 + tl, borderHeight / 2 + tl, borderHeight / 2, 0.5 * pi, 1 * pi)
    ctx.arc(borderHeight / 2 + tl, borderHeight / 2 + tl, borderHeight / 2, 1 * pi, 1.5 * pi)
    ctx.stroke()

    //填充条绘制
    if (scale > 0) {
      ctx.beginPath()
      ctx.moveTo(borderHeight / 2 + tl, borderHeight / 2 + tl)
      ctx.setLineCap("round")
      ctx.setLineWidth(solidWidth)
      ctx.setStrokeStyle("#8269ff")
      ctx.lineTo((borderWidth + tl) * scale, borderHeight / 2 + tl)
      ctx.stroke()
    }

    //文字绘制
    ctx.beginPath()
    ctx.setFontSize(11 * rpx)
    ctx.fillStyle = "#404751"
    ctx.fillText(wordsNumberText, 80 * rpx + tl, borderHeight / 2 + tl + 3.5 * rpx);

    ctx.draw()
  },

  //绘制进度条+20文字动画
  drawAnimationText() {
    var rpx;
    //获取屏幕宽度，获取自适应单位
    wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth / 375;
      },
    })

    var step = 0;
    var closeStep = 0;
    var fontSize = 15 * rpx
    var context = wx.createContext();
    var maxTime = 2000;
    var time = 0;

    wx.drawCanvas({
      canvasId: 'animation-canvas',
      actions: context.getActions()
    })

    let requestAnimFrame = (function() {
      return function(callback) {
        setTimeout(callback, 1000 / 5);
      };
    })();

    function loop() {
      time = time + 1000 / 5;
      if (time < maxTime) {
        if (step === 0) {
          drawText(0, 3 * fontSize, 0.38)
        } else if (step === 1) {
          drawText(0, 3 * fontSize, 0.38)
          drawText(5, 2 * fontSize, 1)
        } else {
          if (step % 2 == 0) {
            drawText(0, 3 * fontSize, 0.38)
            drawText(5, 2 * fontSize, 1)
            drawText(0, 1 * fontSize, 0.38)
          } else {
            drawText(0, 3 * fontSize, 1)
            drawText(5, 2 * fontSize, 0.38)
            drawText(0, 1 * fontSize, 1)
          }
        }
        step = step + 1;
      } else {
        //逐渐消失
        if (closeStep === 0) {
          drawText(5, 2 * fontSize, 1)
          drawText(0, 1 * fontSize, 0.38)
        } else if (closeStep === 1) {
          drawText(0, 1 * fontSize, 0.38)
        }
        closeStep++;
      }

      wx.drawCanvas({
        canvasId: 'animation-canvas',
        actions: context.getActions()
      })

      requestAnimFrame(loop);
    }

    /*
     * 根据坐标和透明度绘制文字
     */
    function drawText(x, y, transparencyValue) {

      context.globalAlpha = transparencyValue
      context.font = '' + parseInt(fontSize) + 'px Arial'
      context.setFillStyle('#ffffff')
      context.fillText("+20", x, y)
      context.setStrokeStyle("#8269ff")
      context.strokeText("+20", x, y)
      context.fill()
    }
    loop();
  },

  //设置icon的vip或是common风格
  setIconStyle() {
    if (this.data.is_vip) {
      this.setData({
        ic_soundless_like: this.data.ic_soundless_like_vip,
        ic_soundless_like_check: this.data.ic_soundless_like_vip_check,
        ic_lighten: this.data.ic_lighten_vip,
        ic_lighten_check: this.data.ic_lighten_vip_check,
        ic_like: this.data.ic_like_vip,
        ic_like_check: this.data.ic_like_vip_check,
        ic_super_like: this.data.ic_super_like_vip,
        ic_super_like_check: this.data.ic_super_like_vip_check,
      })
    } else {
      this.setData({
        ic_soundless_like_check: this.data.ic_soundless_like_common_check,
        ic_lighten: this.data.ic_lighten_common,
        ic_lighten_check: this.data.ic_lighten_common_check,
        ic_like: this.data.ic_like_common,
        ic_like_check: this.data.ic_like_common_check,
        ic_super_like: this.data.ic_super_like_common,
        ic_super_like_check: this.data.ic_super_like_common_check,
        ic_soundless_like: this.data.ic_soundless_like_common,
      })
      console.log("icon" + this.data.ic_soundless_like)
    }
  },

  //根据性别类型来设置卡片风格
  setCardStyle() {
    var type;
    switch (this.data.match_type) {
      case 0:
        type = '-bg' //男女匹配
        break;
      case 1:
        type = '-gg' //女女匹配
        break;
      case 2:
        type = '-bb' //男男匹配
        break;
    }
    var level = this.data.partner_level
    if (level === 7) { //第7级与第6级内容相同 只不过进度条消失 重温回忆按钮现身
      level = 6
      this.setData({
        isShowRestartBtn: true
      })
    }

    this.setData({
      bg_partner_card: app.globalData.FTP_ICON_HOST + 'bg-' + level + type + '.png',
      img_card_title: app.globalData.FTP_ICON_HOST + 'img-' + level + type + '.png'
    })

  },
  //根据背单词总数计算用户当前处于哪一匹配等级
  getLevel(number) {
    if (number < 80) {
      return 1
    } else if (number > 79 && number < 200) {
      return 2
    } else if (number > 199 && number < 380) {
      return 3
    } else if (number > 379 && number < 640) {
      return 4
    } else if (number > 639 && number < 1000) {
      return 5
    } else if (number > 999 & number < 1480) {
      return 6
    } else {
      return 7
    }

  },
  setMatchLevel() {
    var totalNumber = this.data.studiedWordsTotalNumber
    var level = this.getLevel(totalNumber)
    this.setData({
      partner_level: level,
      wordMaxNumberInLevel: level === 1 ? 80 : level === 2 ? 200 : level === 3 ? 380 : level === 4 ? 640 : level === 5 ? 1000 : level === 6 ? 1480 : 0
    })
  },


  //展示页面中间的toast组件
  showCardToast(content) {
    this.cardToast.setToastContent(content)
    this.cardToast.showToast(3000)
  },

  onMeetTaTap() {
    let self = this;
    //只有背单词总数到达80 or 双方其中一个是vip时才能获取相遇码
    if (this.data.studiedWordsTotalNumber > 79 || this.data.is_vip || this.data.lover_vip) {
      var meetCode;
      wx.request({
        url: app.globalData.HOST + '/operation/twoMeet.do',
        header: {
          "token": app.globalData.token,
          "content-type": 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          if (res.data.status === 200) {
            meetCode = res.data.data.meetCode
            self.popMeetCode.setMeetCode(meetCode)
            self.showMeetCodePop()
            wx.setClipboardData({
              data: meetCode,
              success() {
                self.popMeetCode.showToast('已复制相遇码')
              },
              fail() {
                self.popMeetCode.showToast('复制相遇码失败')
              }
            })
            //稍微延迟1秒再开始获取二维码
            setTimeout(function() {
              self.getAuthorizeAndDownLoadWXCode(self.popMeetCode)
            }, 1000)

          } else {
            self.showCardToast(res.data.msg + "!\r\n请求出错,请稍后重试")
          }
        },
        fail(res) {
          self.showCardToast("请求失败,请稍后重试")
        }
      })
    } else {
      wx.hideTabBar({})
      this.showVipIntroPop()
      
    }

  },
  onRemindTaTap() {
    this.showRemindPop()
  },
  onBreakTap() {
    this.showBreakPop()
  },
  onRestartTap() {
    this.showRestartPop()
  },

  //发送提醒
  onSendRemindTap() {
    let self = this;
    console.log(this.popRemind.getRemindText())
    wx.request({
      url: app.globalData.HOST + '/operation/remindPartnerToMemorizeWord.do',
      header: {
        "token": app.globalData.token,
        "content-type": 'application/x-www-form-urlencoded'
      },
      data: {
        'msg': self.popRemind.getRemindText()
      },
      method: 'POST',
      success(res) {
        console.log(res.data)
        if (res.data.status === 200) {
          self.popRemind.hidePopup()
          self.setData({
            isHideProgressBar: false
          })
          self.showCardToast("已提醒对方背单词")
        } else {
          self.popRemind.hidePopup()
          self.setData({
            isHideProgressBar: false
          })
          self.showCardToast(res.data.msg )
        }
      },
      fail(res) {
        self.popRemind.hidePopup()
        self.setData({
          isHideProgressBar: false
        })
        self.showCardToast("请求失败,请稍后重试")
      }
    })
    console.log("do some")
  },
  onBreakEnsureTap() {
    //确认解除关系
    let self = this
    console.log("ensure break")
    wx.request({
      url: app.globalData.HOST + '/operation/datingBrakeUp.do',
      header: {
        "token": app.globalData.token,
        "content-type": 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success(res) {
        if (res.data.status === 200) {
          self.popBreak.hidePopup()
          self.setData({
            isHideProgressBar: false
          })
          self.showCardToast("解除关系成功")
          self.onLoad() //刷新当前页面重新获取用户信息 

        } else {
          self.popBreak.hidePopup()
          self.setData({
            isHideProgressBar: false
          })
          self.showCardToast("解除关系请求出错,\r\n请您再三考虑")
        }
      },
      fail(res) {
        self.popBreak.hidePopup()
        self.setData({
          isHideProgressBar: false
        })
        self.showCardToast("解除关系请求失败,\r\n请您再三考虑")
      }
    })
  },
  onBreakCancelTap() {
    console.log("cancel break")
    this.popBreak.hidePopup()
    this.setData({
      isHideProgressBar: false
    })
  },
  onRestartEnsureTap() {
    console.log("ensure restart")
    let self = this;
    wx.request({
      url: app.globalData.HOST + '/operation/reliveMemories.do',
      header: {
        "token": app.globalData.token,
        "content-type": 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success(res) {
        if (res.data.status === 200) {
          self.popRestart.hidePopup()
          self.setData({
            isHideProgressBar: false
          })
          self.showCardToast("重温回忆已提交,\r\n等待对方响应")

        } else {
          self.popRestart.hidePopup()
          self.setData({
            isHideProgressBar: false
          })
          self.showCardToast("请求出错,请稍后重试")
        }
      },
      fail(res) {
        self.popRestart.hidePopup()
        self.setData({
          isHideProgressBar: false
        })
        self.showCardToast("请求失败,请检查网络")
      }
    })
  },
  onRestartCancelTap() {
    console.log("cancel restart")
    this.popRestart.hidePopup()
    self.setData({
      isHideProgressBar: false
    })
  },
  
  //第一次进入发现页活动的引导
  onNextBtnTap: function(event) {
    let self = this;
    console.log(event)
    switch (event.currentTarget.id) {
      case 'btn-next-page1':
        this.setData({
          isShowLeadPage1: false,
          isShowLeadPage2: true,
        })
        break
      case 'btn-next-page2':
        this.setData({
          isShowLeadPage2: false,
          showLikeToast:true,
        })
        self.data.setLikeTimer = setTimeout(function(){
          self.setData({
            showLikeToast:false,
            showLightenToast : true,
          })
          self.data.setLightenTimer = setTimeout(function(){
            self.setData({
              showLightenToast: false,
            })
          },3000)
        },3000)
        break
    }
  },
  onWordProgressBarTap() {
    let self = this;
    //用户为vip并且当天还未使用加速功能
    if (this.data.is_vip) {
      wx.request({
        url: app.globalData.HOST + '/operation/datingVipAddWordNumber.do',
        header: {
          "token": app.globalData.token,
          "content-type": 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success(res) {
          if (res.data.status === 200) {
            self.setData({
              studiedWordsTotalNumber: self.data.studiedWordsTotalNumber + 20
            })
            self.setMatchLevel() //根据背单词总数设置匹配等级
            self.drawAnimationText()
            self.drawProgressBar()
            self.setCardStyle() //根据匹配双方性别和匹配等级来设置Card风格

          } else if (res.data.status === 400) {
            self.showCardToast("一天只能加速一次哦！")
          }
        },
        fail(res) {
          self.popRestart.hidePopup()
          self.setData({
            isHideProgressBar: false
          })
          self.showCardToast("请求失败,请稍后重试")
        }
      })

    } else {
      this.showVipIntroPop()
      wx.hideTabBar({})
      
    }
  },

  onGoToFollowTap() {
    this.popContactUs.showPopup()
  },

  onContactUsTap() {
    console.log("you click contact us")
  },
  onContactBackHandle: function(event) {
    console.log("back event：" + JSON.stringify(event))
  },

  setArrayIsLikeData(dataset, likeType,isLikeCheck) {//likeType 1为喜欢  2为超级喜欢
    let self = this;
    switch (likeType) {
      case 1:
        //三个数组的索引"cml_index" "mrl_index" "trl_index"
        //该索引用来 确定哪个卡片点击喜欢或者超级喜欢按钮后的本地check状态，在下一次载入数据后 check状态则由后台数据来决定
        if (dataset.hasOwnProperty('cml_index')) { //判断数组中是否存在该键
          //临时字符串组成-用来设置数组对象属性
          var temp_str = 'common_card_list[' + dataset.cml_index + '].isMyLike'
          self.setData({
            [temp_str]: isLikeCheck
          })
        }
        if (dataset.hasOwnProperty('mrl_index')) {
          var temp_str = 'more_card_list[' + dataset.mrl_index + '].isMyLike'
          self.setData({
            [temp_str]: isLikeCheck
          })
        }
        if (dataset.hasOwnProperty('trl_index')) {
          var temp_str = 'time_reversal_list[' + dataset.trl_index + '].isMyLike'
          self.setData({
            [temp_str]: isLikeCheck
          })
        }
        break
      case 2:
        if (dataset.hasOwnProperty('cml_index')) {
          var temp_str = 'common_card_list[' + dataset.cml_index + '].isMySuperLike'
          self.setData({
            [temp_str]: isLikeCheck
          })
        }
        if (dataset.hasOwnProperty('mrl_index')) {
          var temp_str = 'more_card_list[' + dataset.mrl_index + '].isMySuperLike'
          self.setData({
            [temp_str]: isLikeCheck
          })
        }
        if (dataset.hasOwnProperty('trl_index')) {
          var temp_str = 'time_reversal_list[' + dataset.trl_index + '].isMySuperLike'
          self.setData({
            [temp_str]: isLikeCheck
          })
        }
        break
    }
  },
  
  /*
  *  通过设置间隔2分钟时间的定时器,定时切换虚拟用户列展示toast
  */
  setTimeReversalToast(){
    //获取一个0-5随机整数
    var i = Math.floor(Math.random() * 6 );
    var j = Math.floor(Math.random() * 6);
    let self = this;
    self.setData({
      virtualUserCover:self.data.timeReverseUserList[i].cover,
      virtualUserName: self.data.timeReverseUserList[i].name,
      isShowTimeReversalToast:true
    })
    setTimeout(function(){
      self.setData({
        isShowTimeReversalToast: false,
      })
      setTimeout(function(){
        self.setData({
          moreUserCover: self.data.moreCardUserList[j].cover,
          moreUserName: self.data.moreCardUserList[j].name,
          isShowMoreCardToast: true
        })
        setTimeout(function(){
          self.setData({
            isShowMoreCardToast: false,
          })
        },10000)
      },5000)
    },10000)

    setInterval(function(){
      if(i<5){
        i=i+1
      }else if(i===5){
        i=0
      }
      if(j<5){
        j=j+1
      }else if(j===5){
        j=0
      }
      self.setData({
        isShowTimeReversalToast:true,
        virtualUserCover:self.data.timeReverseUserList[i].cover,
        virtualUserName:self.data.timeReverseUserList[i].name
      })
      setTimeout(function () {
        self.setData({
          isShowTimeReversalToast: false,
        })
        setTimeout(function () {
          self.setData({
            moreUserCover: self.data.moreCardUserList[j].cover,
            moreUserName: self.data.moreCardUserList[j].name,
            isShowMoreCardToast: true
          })
          setTimeout(function () {
            self.setData({
              isShowMoreCardToast: false,
            })
          }, 10000)
        }, 5000)
      }, 10000)
    },120000)
  },

  onEnterMatchSuccessPageTap(){
    this.onLoad()
  },
   

  /*
  * 根据laber栏的高度 滑动到label距顶部75px处
  */
  setScrollOffset(){
    var offset = 0 ;
    let query = wx.createSelectorQuery();
    query.select('#partnership_label').boundingClientRect(rect => {
       var y= rect.top;
      console.log("标签的y坐标" + y);
      if(y>75){
        offset=y-75
      }
      wx.pageScrollTo({
        scrollTop: offset,
        aniamtion:500
      })
    }).exec();
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