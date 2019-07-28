// utils/components/popup/discover/mat-pop5.js
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
    img_match_success: app.globalData.FTP_ICON_HOST + 'img_match_success.png',
    ic_progress_heart: app.globalData.FTP_ICON_HOST + 'ic_progress_heart.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    //内部私有事件最好用下划线_开头
    _hide() {
      this.triggerEvent("hide")
    },
    _enter(){
      this.triggerEvent("enter")
    }
  }
})
