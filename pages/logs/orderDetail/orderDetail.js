var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.data.statusBarHeight,
    orderLists:[1,2,3],
    ajaxData:null,
    showLoad:false,
    expresscompany:"",
    expressnumber:"",
    options:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync("token")) {
      wx.reLaunch({
        url: '../../../pages/index/index'
      })
    }
    console.log(options)
    this.setData({
      options: options,
      expresscompany: JSON.parse(options.data).expresscompany,
      expressnumber: JSON.parse(options.data).expressnumber,
      deliveryMan: JSON.parse(options.data).deliveryman,
      deliverytime: JSON.parse(options.data).deliverytime,
      arrivedtime: JSON.parse(options.data).arrivedtime,
    })
    console.log(this.data.expressnumber)
    let _this=this;
    wx.request({
      url: app.data.hostAjax + '/api/Order/Detail',
      data: {
        orderNum: JSON.parse(options.data).id,
        companyCode: JSON.parse(options.data).code
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': "Bearer " + wx.getStorageSync("token")
      },
      success(res) {
        console.log(res.data.result.makeTime);
        if (res.data.success) {
          _this.setData({
            ajaxData: res.data.result,
            showLoad: true
          });
        }

      }
    })
  },
  return: function () {
    wx.navigateBack({
      delta: 1
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
  onShareAppMessage: function (res) {
   // console.log(this.data.options)+ _this.data.options.data
    let _this=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: '/pages/index/index?stop=1' 
    }
  }
})