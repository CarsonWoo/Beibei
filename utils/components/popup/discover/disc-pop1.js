// utils/components/popup/discover/disc-pop1.js
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
    img_vip_crown: app.globalData.FTP_ICON_HOST + 'img_vip_crown.png',
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
    hidePopup(){
      this.setData({
        flag:!this.data.flag
      })
    },

    //内部私有事件最好用下划线_开头
    _hide(){
      this.triggerEvent("hide")
    },
  }
})
