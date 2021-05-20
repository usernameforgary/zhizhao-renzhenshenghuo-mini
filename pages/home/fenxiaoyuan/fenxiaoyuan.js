// pages/money/index/index.js
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
var app = getApp();
Page({
  skipNextPage(e) {
    //点击图片跳转到详情
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    ismaiduan:0,
    TabCur: 0,
    scrollLeft: 0,
    true: true,
    ajaxData: [],
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    loading: true,
    hideLoading: true,//隐藏底部加载
    hideBotom: true,//隐藏底部导航
    show: false,
    pageindex: 1,
    pagesize: 10,//每页的商品数量
    tab_bur: [],
    shoptype:1,
  },
  changeIndex(e) {
    console.log(e)
    this.setData({
      acticeInxex: e.currentTarget.dataset.index
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    console.log(this.data.TabCur)
    if (this.data.TabCur==0){
      this.setData({
        shoptype: 1,
      })
      this.onLoad()
    } else if (this.data.TabCur == 1){
      this.setData({
        shoptype: 3,
      })
      this.onLoad()
    }else{//客户

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ismaiduan: wx.getStorageSync("isoverpay") == 1 ? 1 : 0
    })
    console.log(app.data.windowHeight)
    this.setData({
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 74 : app.data.windowHeight -40
    })
    let _this = this;
    util.request(app.data.hostAjax + '/api/dester/v1/getsalapersonlist', {
      userid: wx.getStorageSync("userid"),
      shoptype: wx.getStorageSync("isoverpay") == 1 ? 3 : 1,//1为经销推广大使 3为买断推广大使
      pageindex: this.data.pageindex,
      pagesize: 30,
    }).then(function (res) {
      if (res.Code == "200") {
        let arr = _this.data.ajaxData;
        try {
          if (res.Data.list) {
            arr = arr.concat(res.Data.list)
          }

        } catch (e) {
          console.log("出错了");
        }

        _this.setData({
          ajaxData: arr
        })
        if (res.Data.list.length < 10) {
          _this.setData({
            hideLoading: false
          })
        }
      } else {
        _this.setData({
          ajaxData: [],
          hideLoading: false
        })
      }
    });
    return
    
  },
  see() {
    wx.showToast({
      title: '',
      icon: "none"
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
    wx.hideLoading()
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
  onChange(event) {
    console.warn(`change: ${event.detail}`);
    this.setData({
      value1: event.detail
    })
  },
  onSearch(e) {
    this.setData({
      ajaxData: [],
      hideLoading: true,
      goodsValue: e.detail
    })
    this.onLoad();
  },
  onCancel() {//取消搜索搜索时触发

  },
  scroll() {//滚动时触发

  },
  onPullDownRefresh: function () {

    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载

    setTimeout(function () {

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
  },
  scrolltolower() {
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false

      })
      // setTimeout(function () {
      //   _this.setData({
      //     loading: true
      //   })
      // }, 1000)
      console.log("在我这里调取加载数据")
      if (!this.data.hideLoading) {
        return
      }
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      this.onLoad();
    }

  },
  onGotUserInfo: function (e) {//点击下一步
    wx.showLoading({
      title: '稍等',
    })
    console.log(e)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    console.log("登录信息获取，然后跳转到详情页面--调起支付")
    //判断口味是否选择
    console.log("口味：", this.data.acticeInxex)
    console.log(this.data.value1 * this.data.ajaxGood.e_price)
    if (this.data.acticeInxex != null) {
      //提交到订单确认
      wx.navigateTo({
        url: '../payMent/pay?ajaxData=' + JSON.stringify({
          id: this.data.firstId,//商品id
          title: this.data.ajaxGood.englishname + this.data.ajaxData.name,//标题
          desc: this.data.ajaxGood.synopsis,//描述
          img: this.data.ajaxGood.smallimg,
          price: this.data.ajaxGood.e_price,//单价
          num: this.data.value1,//数量
          taste: this.data.ajaxGood.tastename[this.data.acticeInxex].names,//口味名字
          tasteId: this.data.ajaxGood.tastename[this.data.acticeInxex].id,//口味id
          totle: this.data.value1 * this.data.ajaxGood.e_price * 100,//总金额=数量乘以单价==单位是分
        }),
      })
    } else {
      //提示选择口味
      wx.showToast({
        title: '请选择口味',
        icon: "none"
      })
      if (this.data.show) {
        return false
      }
      this.setData({ show: !this.data.show });
    }

  },
  onClose() {
    this.setData({ show: !this.data.show });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})