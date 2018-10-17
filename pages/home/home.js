// pages/home/home.js
const amapFile = require('../libs/amap-wx.js');
const WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveData:"",
    messData:"", // 寄语内容
    userInfo:'',
    topList:[
      { name: "身边事", index: 1 },
      { name: "好活动", index: 2 }
    ],
    chooseSize: false,
    inputValue:"",
    inputValueLenght:32,
    articleData:"",
    templateIndex:"1",
    top: 0,
    windowH:"",
    bannerData:"",
    page:3, // 文章获取数目
    isHideLoadMore:true,
  },

  /*scrollTopFun(e) {
    console.log(e.detail.scrollTop)
    let that = this;
    that.setData({
      top:e.detail.scrollTop
    })
  },*/

  chooseSezi: function (e) {
    if (app.globalData.userInfo){
      
      var that = this;
      that.setData({
        // 改变view里面的Wx：if
        chooseSize: true
      })
    }else {
      wx.showModal({
        title: '请登录再进行操作',
        showCancel:false,  
        success:res => {
          console.log(1)
        }
      })
    }
  },

  hideModal: function (e) {
    var that = this;
    that.setData({
      chooseSize: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.randData(); // 获取寄语
    this.getArticleList(); // 获取文章列表
    this.getBanner(); // 获取banner


    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowH: res.windowHeight - 44
        });
      }
    })

    // 获取地区温度
    var myAmapFun = new amapFile.AMapWX({ key: '733baa1f16554b74283d02774403cffb' });
    myAmapFun.getWeather({
      success: function (data) {
        //成功回调
        that.setData({
          liveData: data.liveData
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
    // ------------------
    // 获取
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },

  // 获取默认banner
  getBanner() {
    let that = this;
    wx.request({
      url: app.globalData.requestHttp + 'banner/wx_banner.php',
      header: app.globalData.requestHeader,
      method: "POST",
      success(res) {
        console.log(res);
        that.setData({
          bannerData: res.data.data
        })
      },
      fail() {

      }
    })
  },

  // 获取默认文章列表
  getArticleList(){
    let that = this;
    wx.request({
      url: app.globalData.requestHttp + 'article/wx_read_article.php',
      header: app.globalData.requestHeader,
      method: "POST",
      data:{
        page: that.data.page
      },
      success(res) {
        console.log(res);
        that.setData({
          articleData: res.data.data,
        })
      },
      fail() {

      }
    }) 
  },
  // 切换模板 
  topList(e){
    console.log(e)
    let index = e.currentTarget.dataset.index;
    this.setData({
      templateIndex:index
    })
  },
  

  bindKeyInput(e){
    this.inputValueLenght(e.detail.value.length)
    this.setData({
      inputValue: e.detail.value,
    })
  },

  inputValueLenght(val){
    if (val == 0){
      this.setData({
        inputValueLenght: 32,
      })
    } else if ( val == 32 ){
      this.setData({
        inputValueLenght: 0,
      })
    }else {
      if (this.data.inputValueLenght == 0){
        this.setData({
          inputValueLenght: 32 - 1,
        })
      }else {
        this.setData({
          inputValueLenght: this.data.inputValueLenght - 1,
        })
      }    
    }
  },
  // 发布寄语
  getMess(){
    let that = this;
    if (that.data.inputValue == ''){
      wx.showToast({
        title:"请输入内容",
        icon: "none"
      })
    }else {
      let avatarUrl = app.globalData.userInfo.avatarUrl;
      let nickName = app.globalData.userInfo.nickName;
      wx.request({
        url: app.globalData.requestHttp + 'message/wx_init_message.php',
        header: app.globalData.requestHeader,
        method: "POST",
        data: {
          uid: app.globalData.openid,
          content: that.data.inputValue,
          avatarUrl: avatarUrl,
          nickName: nickName
        },
        success(res) {
          if (res.data.success == 1){
            that.setData({
              chooseSize: false
            })
            wx.showToast({
              title: "发布成功",
              icon:"success"
            })
          }
        },
        fail() {

        }
      })
    }
  },
  // 查看寄语
  randData() {
    let that = this;
    wx.request({
      url: app.globalData.requestHttp + 'message/wx_read_message.php',
      header: app.globalData.requestHeader,
      method: "POST",
      success(res) {
        console.log(res)
        if (res.data.success == 1) {
          that.setData({
            messData: res.data.data
          })
        }
      },
      fail() {

      }
    })
  },
  // 跳转到文章详情
  getArticle(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../article/article?id='+id,
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
    let that = this;
    wx.showNavigationBarLoading();
    function renderAll() {
      return Promise.all([that.randData(), that.getArticleList(), that.getBanner()]);
    }
    renderAll().then(function (value) {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   let that = this;
    that.setData({
      page:that.data.page+=1
    })
    wx.showLoading({
      title:"正在加载"
    });
    let time = setTimeout(() => { 
      function renderRace() {
        return Promise.race([that.getArticleList()]);
      }
      renderRace().then(function (value) {
        wx.hideLoading()
      })
    },1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})