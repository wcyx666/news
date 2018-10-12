// pages/my/my.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: "",
    messList:""
  },

  bindGetUserInfo: function (e) {
    this.setData({
      userInfo: e.detail.userInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getMessList();
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang:'zh_CN',
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  getMessList() {
    let that = this;
    wx.request({
      url: app.globalData.requestHttp + 'my/wx_my_message.php',
      header: app.globalData.requestHeader,
      method: "POST",
      data:{
        uid: app.globalData.openid
      },
      success(res) {
        that.setData({
          messList:res.data.data
        })
      },
      fail() {

      }
    })
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