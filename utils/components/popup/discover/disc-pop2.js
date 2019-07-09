// utils/components/popup/discover/disc-pop2.js 
const app = getApp()
Component({
  /** 
   * 组件的属性列表 
   */
  properties: {

  },

  /** 
   * 组件的初始数据 
   */
  data: {
    flag: true,
    toastContent: '',
    animationData: {},// 0：二维码下载中... 1：二维码已保存到手机
    img_couple: app.globalData.FTP_ICON_HOST + 'img_couple.png',
    btn_add_staff: app.globalData.FTP_ICON_HOST + 'btn_add_staff.png',
    bg_vip_grey: app.globalData.FTP_ICON_HOST + 'bg_vip_grey.png',
    img_lead: app.globalData.FTP_ICON_HOST + 'img_lead.png',
    
  },

  /** 
   * 组件的方法列表 
   */
  methods: {
    //展示弹框 
    showPopup() {
      this.setData({
        flag: !this.data.flag
      })
    },
    hidePopup() {
      this.setData({
        flag: !this.data.flag
      })
    },
    //底部toast展示
    showToast(val) {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.opacity(1).step()
      this.setData({
        animationData: animation.export(),
        toastContent: val
      })
      /**
       * 延时消失
       */
      setTimeout(function () {
        animation.opacity(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 2700)
    },

    //内部私有事件最好用下划线_开头 
    _hide() {
      this.triggerEvent("hide")
    },
    _addStaff(){
      this.triggerEvent("addStaff")
    }
  }
}) 