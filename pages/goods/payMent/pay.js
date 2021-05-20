
const util = require('../../../utils/util.js');
import Toast from '../../../dist/toast/toast';
import drawQrcode from '../../../utils/weapp.qrcode.esm.js'
var app = getApp();
Page({
  returnGoodsList() {
    wx.reLaunch({
      url: '/pages/goods/index/index?'
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    readybuy: false,//支付成功禁止调立即购买接口
    consultant: true,//默认没有专属顾问
    ifchoose: false,//默认是没有优惠券的
    windowHeight: null,//可用窗口的高度
    value1: 1,//购买数量
    discount: '',//优惠券
    ajaxData: {
      id: "2471",
      title: "snow+",//标题
      desc: "",//描述
      img: "",
      price: "39.00",//单价
      num: 2,//数量
      taste: "甜甜的口味",//口味
      tasteId: 17,//口味id
      totle: 3900,//总金额
    },
    isIphoneX: app.data.isIphoneX,
    loading: false,
    show: false,//支付结束弹框
    checked: 1,//
    address: {},//获取默认地址’

    useridsaleman: '',//商品分享人id
    shopid: '',

    saoma: false
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checked: parseInt(e.detail.value)
    })
    console.log(this.data.checked)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.reLaunch({//重定向到登录页面
    //   url: '/pages/index/index'
    // })
    let _this = this;
    try {
      console.log(options.ajaxData)
      this.setData({
        ajaxData: JSON.parse(options.ajaxData),
        totleprice: JSON.parse(options.ajaxData).totle,
        useridsaleman: JSON.parse(options.ajaxData).useridsaleman,
        shopid: JSON.parse(options.ajaxData).shopid,
      })
    } catch (e) {

    }

    this.setData({
      windowHeight: app.data.windowHeight,
      scroolHeight: app.data.isIphoneX ? app.data.windowHeight - 59 - 68 : app.data.windowHeight - 59 - 51
    })
    this.getAddress();
    util.request(app.data.hostAjax + '/api/dester/v1/getmyadviser', { userid: wx.getStorageSync("userIdBuyGood") }).then(function (res) {
      if (res.Code == "200" && wx.getStorageSync("usertype") == 1) {//专属顾问，没有就不能自提--仅仅对普通用户限制
        _this.setData({
          consultant: true
        });
      } else if (wx.getStorageSync("usertype") != 1) {
        _this.setData({
          consultant: true
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getAddress() {
    let _this = this, ajaxData = {
      user_id: wx.getStorageSync("userIdBuyGood"),
      id: 0,//state为2时收货地址id传0查询默认地址
      state: 2
    };
    //获取默认地址，如果没有默认地址就
    if (wx.getStorageSync("addressid")) {
      ajaxData = {
        user_id: wx.getStorageSync("userIdBuyGood"),
        id: wx.getStorageSync("addressid")
      };
    }
    wx.request({
      url: app.data.hostAjax + '/api/my/v1/selectreceivingaddress',
      data: ajaxData,
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        if (res.data.Data.list.length) {
          _this.setData({
            address: res.data.Data.list[0]
          })
        } else {
          _this.setData({
            address: {}
          })
          console.log("111111111111111111111-------------", _this.data.checked)
          // if (_this.data.checked==2){
          //   wx.showToast({
          //     title: '请选择收货地址11',
          //     icon: 'none'
          //   })
          //   return
          // }

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    let _this = this;
    this.setData({
      ifchoose: wx.getStorageSync("couponid") ? true : false,
      couponprice: wx.getStorageSync("couponprice")
    })
    // 扫码进来只能自提--只对用户做限制
    // if (wx.getStorageSync("saoma") && wx.getStorageSync("usertype") == 1) {
    //   this.setData({
    //     checked: 1,
    //     saoma: true
    //   })
    // }

    this.getAddress()
    wx.hideShareMenu({
      success: function () {
        console.log("禁止了分享按钮的现实！")
      }
    })
    util.request(app.data.hostAjax + '/api/my/v1/getmycoupon', {//我的券
      userid: wx.getStorageSync("userIdBuyGood"),
      types: 1
    }).then(function (res) {
      if (res.Code == "200") {
        _this.setData({
          hascoupon: true
        })
      } else {
        _this.setData({
          hascoupon: false
        })
      }
    });
    if (this.data.readybuy) { return }
    console.log(this.data.readybuy)
    console.log("扫码的shopid是：", this.data.useridsaleman || wx.getStorageSync("fenxiaoshangid") || 0)
    console.log(this.data.useridsaleman)
    wx.request({
      url: app.data.hostAjax + "/api/transaction/v1/buynow",
      data: {
        userid: wx.getStorageSync("userIdBuyGood"),
        goodsid: _this.data.ajaxData.id,
        salapersonid: this.data.useridsaleman || wx.getStorageSync("fenxiaoshangid") || 0,//分销商的id分销员id//分销商的id推广大使id
        shopid: this.data.shopid || wx.getStorageSync("shopid") || 0,//店铺id--每个人都有一个店铺
        num: this.data.ajaxData.num,
        tasteid: this.data.ajaxData.tasteId,//商品口味
      },
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success(res) {
        console.log(res)
        if (res.data.Success) {
          //订单确认
          wx.request({
            url: app.data.hostAjax + '/api/transaction/v1/confirmationorder',
            data: {
              user_id: wx.getStorageSync("userIdBuyGood"),
            },
            method: "get",
            header: {
              'content-type': 'application/json',
            },
            success(res) {
              wx.setStorageSync("oid", res.data.Data.orderid)
              util.request(app.data.hostAjax + '/api/my/v1/getusercoupon', {//我的券

                userid: wx.getStorageSync("userIdBuyGood"),
                orderid: wx.getStorageSync("oid"),

              }).then(function (res) {
                console.log(res)
                console.log(wx.getStorageSync("oid"))
                if (res.Code == "200") {
                  _this.setData({
                    hascoupon: true,
                    discount: res.Data.list
                  })
                } else {
                  _this.setData({
                    hascoupon: false
                  })
                }
              });


              if (res.data.Success) {
                //调取提交订单接口
                _this.setData({
                  ajaxData1: res.data.Data,
                  orderid: res.data.Data.orderid,
                  sumprice: res.data.Data.sumprice,
                })
                console.log("优惠金额：", _this.data.couponprice)
                console.log(_this.data)
                if (wx.getStorageSync("couponprice")) {
                  let price = res.data.Data.sumprice - _this.data.couponprice
                  _this.setData({
                    newprice: price.toFixed(2),
                    newprice1: price.toFixed(2) * 100
                  })
                }
              } else {
                wx.showToast({
                  title: res.data.Msg,
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none'
          })
        }
      }
    })
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
    wx.removeStorageSync('couponid');
    wx.removeStorageSync('couponprice');
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
  },
  onSearch(e) {
    console.log(e.detail)
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
      setTimeout(function () {
        _this.setData({
          loading: true

        })
      }, 1000)
      console.log("在我这里调取加载数据")
    }

  },
  onClose() {
    this.setData({ show: !this.data.show });
  },
  onClickButton() {//提交订单--吊起支付
    let _this = this;
    console.log("wx.getStorageSync(shopid)", wx.getStorageSync("shopid"))
    console.log("wx.getStorageSync(useridsaleman)", wx.getStorageSync("fenxiaoshangid"))
    if (_this.data.checked == 1 && !_this.data.address.id) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    this.setData({ loading: true });
    if (this.data.orderid) {//当有订单号的时候
      //调取提交订单接口

      wx.request({
        url: app.data.hostAjax + '/api/transaction/v1/orderpayinfo',
        data: {
          userid: wx.getStorageSync("userIdBuyGood"),
          orderid: this.data.orderid,
          total_fee: _this.data.newprice || this.data.sumprice,//res.data.Data.sumprice,
          addressid: _this.data.checked == 1 ? _this.data.address.id : 0,//收货地址id 自提传0
          couponid: wx.getStorageSync("couponid") || 0
        },
        method: "get",
        header: {
          'content-type': 'application/json',
        },
        success(res) {

          if (res.data.Success) {
            try {
              console.log(JSON.parse(res.data.Data));
              wx.requestPayment({
                timeStamp: JSON.parse(res.data.Data).timeStamp,
                nonceStr: JSON.parse(res.data.Data).nonceStr,
                package: JSON.parse(res.data.Data).package,
                signType: 'MD5',
                paySign: JSON.parse(res.data.Data).paySign,
                success(res) {//支付成功
                  //展示支付成功的界面
                  _this.setData({
                    readybuy: true
                  })
                  wx.removeStorageSync('useridsaleman');
                  wx.removeStorageSync('salemanshopid');
                  wx.removeStorageSync('couponid');
                  wx.removeStorageSync('couponprice');
                  wx.redirectTo({
                    url: '/pages/person/order/order',
                  })
                  return
                  // _this.onClose();
                },
                fail(res) {
                  console.log(res)
                  if (res.errMsg == "requestPayment:fail cancel") {
                    wx.showToast({
                      title: "支付已取消",
                      icon: 'none'
                    })
                    wx.redirectTo({
                      url: '/pages/person/order/order',
                    })
                    return
                  }
                }
              })
              _this.setData({ loading: false });
            } catch (e) {
              _this.setData({ loading: false });
            }

          } else {
            wx.showToast({
              title: res.data.Msg,
              icon: 'none'
            })
          }
        }
      })
      return
    }

    wx.request({
      url: app.data.hostAjax + "/api/transaction/v1/buynow",
      data: {
        userid: wx.getStorageSync("userIdBuyGood"),
        goodsid: _this.data.ajaxData.id,
        salapersonid: this.data.useridsaleman || wx.getStorageSync("fenxiaoshangid") || 0,//分销商的id推广大使id
        shopid: this.data.shopid || wx.getStorageSync("shopid") || 0,//店铺id--每个人都有一个店铺
        num: this.data.ajaxData.num,
        tasteid: this.data.ajaxData.tasteId,//商品口味
      },
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success(res) {
        console.log(res)
        if (res.data.Success) {
          //订单确认
          wx.request({
            url: app.data.hostAjax + '/api/transaction/v1/confirmationorder',
            data: {
              user_id: wx.getStorageSync("userIdBuyGood"),
            },
            method: "get",
            header: {
              'content-type': 'application/json',
            },
            success(res) {
              if (res.data.Success) {
                console.log(res)
                //调取提交订单接口
                wx.request({
                  url: app.data.hostAjax + '/api/transaction/v1/orderpayinfo',
                  data: {
                    userid: wx.getStorageSync("userIdBuyGood"),
                    orderid: res.data.Data.orderid,
                    total_fee: _this.data.newprice || res.data.Data.sumprice,//res.data.Data.sumprice,
                    addressid: _this.data.checked == 1 ? _this.data.address.id : 0,//收货地址id 自提传0
                    couponid: wx.getStorageSync("couponid") || 0
                  },
                  method: "get",
                  header: {
                    'content-type': 'application/json',
                  },
                  success(res) {

                    if (res.data.Success) {
                      try {
                        console.log(JSON.parse(res.data.Data));
                        wx.requestPayment({
                          timeStamp: JSON.parse(res.data.Data).timeStamp,
                          nonceStr: JSON.parse(res.data.Data).nonceStr,
                          package: JSON.parse(res.data.Data).package,
                          signType: 'MD5',
                          paySign: JSON.parse(res.data.Data).paySign,
                          success(res) {//支付成功
                            //展示支付成功的界面
                            _this.setData({
                              readybuy: true
                            })
                            wx.removeStorageSync('useridsaleman');
                            wx.removeStorageSync('salemanshopid');
                            wx.removeStorageSync('couponid');
                            wx.removeStorageSync('couponprice');
                            wx.redirectTo({
                              url: '/pages/person/order/order',
                            })
                            return
                            // _this.onClose();
                          },
                          fail(res) {
                            console.log(res)
                            if (res.errMsg == "requestPayment:fail cancel") {
                              wx.showToast({
                                title: "支付已取消",
                                icon: 'none'
                              })
                              wx.redirectTo({
                                url: '/pages/person/order/order',
                              })
                              return
                            }
                          }
                        })
                        _this.setData({ loading: false });
                      } catch (e) {
                        _this.setData({ loading: false });
                      }

                    } else {
                      wx.showToast({
                        title: res.data.Msg,
                        icon: 'none'
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.Msg,
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})