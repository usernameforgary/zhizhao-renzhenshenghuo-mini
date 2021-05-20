// pages/home/jingxuan/jingxuan.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    usertype: 0,
    ismaiduan: 0,
    data: {},
    statusType: ["全部商品", "销量榜",],
    hasRefund: false,
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: [],
    pageindex: 1,
    ajaxpageindex: 0,
    pagesize: 20,
    hideLoading: true, //隐藏底部加载
    loading: true,
    searchtxt: "",
   
    searchType: '', //searchType
    listtime: [], //商品列表
    originalprice: '', //商品原价
    discountprice: '', //商品折扣价
    distributor: '', //分销商佣金比例
    distributor1: '', //分销员佣金比例
    mydistributor: '', //我的佣金比例
    img: '',//商品图片
    name: '',//商品名字
    e_price: '',//商品名字
    price: '',//折扣价
    sellingtimes: '',//已售
    shopid: '',//商品id
    search: '',//搜索
  },
  statusTap: function (e) {
    console.log(e)
    const curType = e.currentTarget ? e.currentTarget.dataset.index : e;
    this.data.currentType = curType
    // if (curType == 0) {
    this.setData({
      searchType: e.currentTarget.dataset.index
    });
    // } else if (curType == 1) {
    //   this.setData({
    //     searchType: 0
    //   });
    // } else {
    //   this.setData({
    //     searchType: 3
    //   });
    // }


    this.setData({
      orderList: [],
      pageindex: 1,
      ajaxpageindex: 0,
      hideLoading: true, //隐藏底部加载
      loading: true,
      currentType: curType
    });

    this.onShow();


  },
  // 搜索
  shopsearch: function () {
    var that = this;
    util.request(app.data.hostAjax + '/api/user/v1/getallgoodslist', { //用户商品列表
      // userid: wx.getStorageSync('userid'),
      search: that.data.search

    }).then(function (res) {
      console.log(res)
      that.setData({
        listtime: res.Data.list,
        // listtime: lists
      })



    });
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // wx.request({
    //   url: app.data.hostAjax + '/api/user/v1/selectgoodstype', // 获取知识商品
    //   data: {

    //   },
    //   method: "get",
    //   header: {
    //     'content-type': 'application/json',
    //   },
    //   success(res) {
    //     console.log(res.data)
    //     _this.setData({
    //       statusType: res.data.Data
    //     })

    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //搜索功能
  search: function (e) {
    var originalprice = e.detail.value
    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },






 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    var that = this;
    util.request(app.data.hostAjax + '/api/user/v1/getallgoodslist', { //用户商品列表
      // user_id: wx.getStorageSync('userid'),
   

    }).then(function (res) {
      console.log(res)
      if (res.Code == 200) {
        that.setData({
          listtime: res.Data.list,
          // listtime: lists
        })
      } else {
        wx.showToast({
          title: "暂无数据",
          icon: "none",
        });
        that.setData({
          listtime: [],
          // listtime: lists
        })
      }




    });
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