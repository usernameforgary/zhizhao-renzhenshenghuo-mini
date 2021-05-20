var util = require('../../../utils/util.js');
const app = getApp()
// const WXAPI = require('../../wxapi/main')
Page({
  data: {
    usertype: 0,
    ismaiduan: 0,
    data: {},
    statusType: ["全部", "待付款", "已完成",],
    hasRefund: false,
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: [],
    pageindex: 1,
    ajaxpageindex: 0,
    pagesize: 20,
    hideLoading: true,//隐藏底部加载
    loading: true,
    searchtxt: "",
    search:''//搜索输入框
  },

  search: function (e) {
    var originalprice = e.detail.value
    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },
  // 搜索
  shopsearch: function () {
    var that = this;
    util.request(app.data.hostAjax + '/api/dstributor/v1/getyoupengorderlist', { //用户商品列表
      distributorid: wx.getStorageSync('distributorid'),
      search: that.data.search

    }).then(function (res) {
      console.log(res)
      that.setData({
        orderList: res.Data.list,
        // listtime: lists
      })



    });
  },


//刷新
  refresh:function(){
    wx.request({
      url: app.data.hostAjax +'/api/transaction/v1/getyoupenorder',
      method: "POST",
      data: {
        
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res.data);
        if(res.data.Code==200){
          wx.showToast({
            title: '已完成同步',
            icon: 'none'
          })
        }
        this.onShow()
      }
    })
  },

 


  scrolltolower() {
    if (this.data.loading) {
      let _this = this
      this.setData({
        loading: false
      })
      setTimeout(function(){
        _this.setData({
          loading: true

        })
      },1000)
      console.log("在我这里调取加载数据")
      if (!this.data.hideLoading) {
        return
      }
      this.setData({
        pageindex: this.data.pageindex + 1
      })
      this.onShow();
    }
  },
  onLoad: function (options) {
    this.setData({
      usertype: wx.getStorageSync("usertype"),
      ismaiduan: wx.getStorageSync("isoverpay") == 1 ? 1 : 0,
      scroolHeight: app.data.windowHeight - 40
    })
    if (options && options.type) {

      if (options.type == 100) {
        this.setData({
          hasRefund: false,
          currentType: options.type,
          searchType: parseInt(options.type)
        });
      } else {
        this.setData({
          hasRefund: false,
          currentType: options.type,
          searchType: parseInt(options.type) - 1
        });
      }
    } else {
      this.setData({
        hasRefund: false,
        currentType: 0,
        searchType: 100
      });
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getOrderStatistics: function () {
    var that = this;
    WXAPI.orderStatistics(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        var tabClass = that.data.tabClass;
        if (res.data.count_id_no_pay > 0) {
          tabClass[0] = "red-dot"
        } else {
          tabClass[0] = ""
        }
        if (res.data.count_id_no_transfer > 0) {
          tabClass[1] = "red-dot"
        } else {
          tabClass[1] = ""
        }
        if (res.data.count_id_no_confirm > 0) {
          tabClass[2] = "red-dot"
        } else {
          tabClass[2] = ""
        }
        if (res.data.count_id_no_reputation > 0) {
          tabClass[3] = "red-dot"
        } else {
          tabClass[3] = ""
        }
        if (res.data.count_id_success > 0) {
          //tabClass[4] = "red-dot"
        } else {
          //tabClass[4] = ""
        }

        that.setData({
          tabClass: tabClass,
        });
      }
    })
  },
  searchText(e) {
    this.setData({
      searchtxt: e.detail.value
    })
  },
  onShow: function () {
    // 获取订单列表
    
    var that = this;
    util.request(app.data.hostAjax + '/api/dstributor/v1/getyoupengorderlist', {//售货机订单列表
      distributorid:wx.getStorageSync("distributorid"),
      pagesize: that.data.pageindex * 10
     
    }).then(function (res) {
      console.log(res)
      if (res.Code == "200") {
        //刷掉经销商的买断订单
        for (var i = 0; i < res.Data.list.length; i++) {
          if (wx.getStorageSync("usertype") == 2 && res.Data.list[i].ispayover == '买断') {
            return
          }
          that.data.orderList.push(res.Data.list[i])
        }
       
        console.log("that.data.pageindex=", that.data.pageindex*10)
        console.log(that.data.pageindex == that.data.ajaxpageindex)
        if (that.data.pageindex == that.data.ajaxpageindex) {
          that.getOrder(that.data.orderList.length)
          return;
        }
        that.setData({
          orderList: res.Data.list,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 10) {
          that.setData({
            hideLoading: false
          })
        }

      } else {
        that.setData({
          hideLoading: false
        })
      }
    });
  },
  getOrder: function (pagesize) {
    // 获取订单列表
    var that = this;
    util.request(app.data.hostAjax + '/api/dstributor/v1/getyoupengorderlist', {//用户订单列表
      distributorid: wx.getStorageSync("distributorid"),
      ordertype: this.data.searchType,
      pagesize: pagesize,
      pageindex: 1,
      searchtxt: this.data.searchtxt
    }).then(function (res) {
      console.log()
      if (res.Code == "200") {
        that.setData({
          orderList: res.Data.list,
          loading: true,
          ajaxpageindex: that.data.pageindex
        });
        if (res.Data.list.length < 10) {
          that.setData({
            hideLoading: false
          })
        }

      } else {
        that.setData({
          hideLoading: false
        })
      }
    });

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  }
})