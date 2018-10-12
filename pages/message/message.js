// pages/message/message.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:"",
    live:1, // 1为赞 2为取消
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    this.getMessList();
  },
  // 获取默认寄语数据
  getMessList() {
    let that = this;
    wx.request({
      url: app.globalData.requestHttp + 'message/wx_all_message.php',
      header: app.globalData.requestHeader,
      method: "POST",
      success(res) {
        that.setData({
          messageList: res.data.data
        })
      },
      fail() {

      }
    })
  },
  // 点赞
  getlive(e){
    console.log(e);
    let that = this;
    if (that.data.live == 1){
      wx.request({
        url: app.globalData.requestHttp + 'message/wx_live_message.php',
        header: app.globalData.requestHeader,
        method: "POST",
        data:{
          id: e.currentTarget.dataset.id,
        },
        success(res) {
          if (res.data.success){
            that.getMessList();
          }
        },
        fail() {

        }
      }) 
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})