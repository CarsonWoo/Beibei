// utils/components/popup/discover/disc-pop3.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vipContent:{
      type:String,
      value:'VIP限时特惠'
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup() {
      this.setData({
        flag: !this.data.flag,
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
    _openVip(){
      this.triggerEvent("openVip")
    }
  }
})
