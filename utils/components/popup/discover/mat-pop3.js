// utils/components/popup/discover/mat-pop3.js
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
    img_couple: app.globalData.FTP_ICON_HOST + 'img_couple.png',
    inputRemindText:'快来和我一起背单词吧!'

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
    getRemindText(){
      return this.data.inputRemindText
    },

    //内部私有事件最好用下划线_开头
    _hide() {
      this.triggerEvent("hide")
    },
    _send(){
      this.triggerEvent('send')
    },
    _input:function(e){
      var text = e.detail.value
      this.setData({
        inputRemindText:text
      })
    }
  }
})
