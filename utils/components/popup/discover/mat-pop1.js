// utils/components/popup/discover/mat-pop1.js
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
    meetCode: 52520,
    img_girls2: app.globalData.FTP_ICON_HOST + 'img_girls2.png',
    
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
  }
})
