// pages/goods/fxyindex/fxyindex.js
const util = require('../../../utils/util.js');
import drawQrcode from "../../../utils/weapp.qrcode.esm.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:'',//商家id
    warplist: [],//店铺列表
    reslst:'',
    ajaxData:null,
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    widthCord: (195 / 750) * wx.getSystemInfoSync().windowWidth, //二维码的px值（转换之后的）
  },

  togglePopupclose(){
    app.checkauthorization(() => {
      this.setData({ show1: !this.data.show1 });
    });
  },
  saveImgBtn() {
    let _this = this;
    wx.getSetting({
      success: function (res) {
        // console.log(res.authSetting['scope.writePhotosAlbum'])
        if (res.authSetting["scope.writePhotosAlbum"]) {
          _this.setData({
            openset: false,
          });
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    });
    if (this.data.openset) {
      wx.openSetting({
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return;
    }
    if (this.data.loading) {
      return;
    }
    this.setData({
      loading: true,
    });

    wx.getSetting({
      success(res) {
        // console.log(res.authSetting["scope.writePhotosAlbum"]);
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              wx.canvasToTempFilePath(
                {
                  canvasId: "myQrcode",
                  success: (res) => {
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: (res) => {
                        // console.log(res);
                        _this.setData({
                          show1: false,
                          loading: false,
                        });
                      },
                      fail: (err) => {
                        _this.setData({
                          loading: false,
                        });
                      },
                    });
                  },
                  fail: (err) => {
                    wx.openSetting();
                    _this.setData({
                      loading: false,
                    });
                  },
                },
                this
              );
            },
            fail: (err) => {
              _this.setData({
                loading: false,
                openset: true,
              });
              // console.log("我进来额");
              wx.openSetting();
            },
          });
        } else {
          wx.canvasToTempFilePath(
            {
              canvasId: "myQrcode",
              success: (res) => {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: (res) => {
                    // console.log(res);
                    _this.setData({
                      show1: false,
                      loading: false,
                    });
                  },
                  fail: (err) => {
                    _this.setData({
                      loading: false,
                    });
                  },
                });
              },
              fail: (err) => {
                _this.setData({
                  loading: false,
                });
              },
            },
            this
          );
        }
      },
    });
  },

  togglePopup(e) {
    var that = this;
    var shopid = e.currentTarget.dataset.id

    var indexs = parseInt(e.currentTarget.dataset.index);

    console.log(that.data.warplist);

    that.setData({
      ajaxData:that.data.warplist[indexs],
    });
    that.drawImg(shopid);

    app.checkauthorization(() => {
      this.setData({ show1: !this.data.show1 });
    });
  },

  drawImg(goodsId) {
    
    let _this = this;
    //禁止页面分享
    var w = (451 / 750) * wx.getSystemInfoSync().windowWidth;
    var h = (753 / 750) * wx.getSystemInfoSync().windowWidth;
    var a = (43 / 750) * wx.getSystemInfoSync().windowWidth;
    var b = (625 / 750) * wx.getSystemInfoSync().windowWidth;
    var c = (45 / 750) * wx.getSystemInfoSync().windowWidth;
    var d = (360 / 750) * wx.getSystemInfoSync().windowWidth;
    var e = (45 / 750) * wx.getSystemInfoSync().windowWidth;
    var f = (443 / 750) * wx.getSystemInfoSync().windowWidth;
    var ss = (22 / 750) * wx.getSystemInfoSync().windowWidth;
    var s = (30 / 750) * wx.getSystemInfoSync().windowWidth;
    const ctx = wx.createCanvasContext("myQrcode");
    //画板的背景
    var shareImg = _this.data.ajaxData.imgurl
      .split("|")[0]
      .replace("http://212.129.137.111:8088", "https://renzhenshenghuo.cn");
    ctx.setFillStyle("white");
    ctx.fillRect(0, 0, w, h);
    ctx.setFillStyle("#000");
    //加入图片到canvas中
    var imgUrl;
    if (wx.getStorageSync("usertype") == 1) {

      imgUrl =
        "https://renzhenshenghuo.cn/good/detail/?goodsid=" +
        goodsId ;
    } else {

      imgUrl =
        "https://renzhenshenghuo.cn/good/detail/?useridsaleman=" +
        wx.getStorageSync("fenxiaoshangid") +
        "&goodsid=" +
        goodsId +
        "&shopid=" +
        wx.getStorageSync("shopid") ;
    }

    console.log(imgUrl);
    wx.downloadFile({
      url: shareImg,
      success: (res) => {
        shareImg = res.tempFilePath;
        ctx.drawImage(
          shareImg,
          c,
          (38 / 750) * wx.getSystemInfoSync().windowWidth,
          d,
          d
        );
        //加入商品名字到canvas中
        ctx.setFontSize(s);
        if (_this.data.ajaxData.name.length > 11) {
          var str = _this.data.ajaxData.name.substr(0, 11);
          ctx.fillText(str + "...", e, f);
        } else {
          ctx.fillText(_this.data.ajaxData.name, e, f);
        }

        //加入价钱到canvas中
        ctx.setFontSize(ss);
        ctx.fillText("￥", a, b);
        ctx.setFontSize(s);
        ctx.fillText(parseFloat(_this.data.ajaxData.e_price).toFixed(2), a + 15, b);
        // 绘制图片到canvas中
        drawQrcode({
          x: (211 / 750) * wx.getSystemInfoSync().windowWidth,
          y: (479 / 750) * wx.getSystemInfoSync().windowWidth,
          width: _this.data.widthCord,
          height: _this.data.widthCord,
          canvasId: "myQrcode",
          ctx: ctx,
          text: imgUrl,
        });
      },
    });
  },


  getQueryString: function (url, name) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = url.substr(1).match(reg)
    if (r != null) {
        // console.log("r = " + r)
        // console.log("r[2] = " + r[2])
        return r[2]
    }
    return null;
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var thist =this
    console.log(options.id)
    thist.setData({
      id: options.id
    })
    // 我的店铺

    var shopid = '';
    var netstr = decodeURIComponent(options.q);
    if(netstr.length>10)
    {
      var searchParams = thist.getQueryString(netstr,'shopid');
      console.log('12333456'+searchParams);
      thist.setData({
        id: searchParams
      })
    }

    wx.request({
      url: app.data.hostAjax + '/api/user/v1/getallgoodslist', 
      data: {
        id: thist.data.id,
        
      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res)
        if(res.data.Code==200){
          thist.setData({
            warplist: res.data.Data.list,
            warplists: res.data.Data.distributormanager,
            reslst: res.data.Data.record,
          })
        }else{
          wx.showToast({
            title: "暂无数据",
            icon: "none",
          });
        }
       
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