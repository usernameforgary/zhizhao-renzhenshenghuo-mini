// pages/goods/fxyindex/fxyindex.js
const util = require('../../../utils/util.js');
import drawQrcode from "../../../utils/weapp.qrcode.esm.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//商家id
    warplist: [],//店铺列表
    reslst: '',
    ajaxData: null,
    isIphoneX: app.data.isIphoneX,
    scroolHeight: 200,
    widthCord: (195 / 750) * wx.getSystemInfoSync().windowWidth, //二维码的px值（转换之后的）
    btnloading: false, //保存按钮的加载动画
    show2 : false,
  },

  topaction: function(){
    var that = this;
    
    console.log(that.data.ajaxData);
  
    // that.setData({
    //   ajaxData: that.data.warplist[indexs],
    // });
    that.drawImgtwo();
  
    app.checkauthorization(() => {
      this.setData({ show2: !this.data.show2 });
    });
  },

  drawImgtwo: function () {

    var that = this;
    //禁止页面分享
    const ctx = wx.createCanvasContext("myQrcodetwo");
    ctx.setFillStyle("white");
  
    that.roundRectfunction(ctx, 0, 0, that.getOBJvalue(600), that.getOBJvalue(800), that.getOBJvalue(18))
  
    // ctx.fillRect(0, 0, that.getOBJvalue(600), that.getOBJvalue(800));
    ctx.setFillStyle("#000");

    var nstr = that.data.warplist[0].corporatename;
    if (nstr.length > 7) {
      nstr = nstr.substring(0, 7) + '...';
    }
  
    ctx.setFontSize(that.getOBJvalue(30));
    ctx.fillText('店铺名称：' + nstr, that.getOBJvalue(180), that.getOBJvalue(110));
  
    ctx.setFontSize(that.getOBJvalue(22));
    ctx.fillText('长按识别或扫码进入', that.getOBJvalue(340), that.getOBJvalue(760));
  
    ctx.setFontSize(that.getOBJvalue(22));
    ctx.fillText(wx.getStorageSync("username"), that.getOBJvalue(40), that.getOBJvalue(700));
  
    var imgUrl;
    imgUrl =
      "https://renzhenshenghuo.cn/shop/detail/?shopid=" +
      that.data.warplist[0].id +
      "&shareid=" +
      wx.getStorageSync("userIdBuyGood");
  
  
  
    // if (wx.getStorageSync("usertype") == 1) {
  
    //   imgUrl =
    //     "https://renzhenshenghuo.cn/good/detail/?shopid=" +
    //     goodsId +
    //     "&shareid=" +
    //     wx.getStorageSync("userIdBuyGood");
    // } else {
  
    //   imgUrl =
    //     "https://renzhenshenghuo.cn/good/detail/?useridsaleman=" +
    //     wx.getStorageSync("fenxiaoshangid") +
    //     "&goodsid=" +
    //     goodsId +
    //     "&shopid=" +
    //     wx.getStorageSync("shopid") +
    //     "&shareid=" +
    //     wx.getStorageSync("userIdBuyGood");
    // }
  
    var shareImg = that.data.warplist[0].logimg.replace("http://212.129.137.111:8088", "https://renzhenshenghuo.cn");
  
    console.log('图片地址:' + shareImg);
  
    wx.downloadFile({
      url: shareImg,
      success: (res) => {
  
        console.log('下载成功:' + shareImg);
  
        shareImg = res.tempFilePath;
        ctx.drawImage(
          shareImg,
          that.getOBJvalue(30),
          that.getOBJvalue(30),
          that.getOBJvalue(100),
          that.getOBJvalue(100)
        );
  
        var contentimg = that.data.warplist[0].replylist[0].smallimg.replace("http://212.129.137.111:8088", "https://renzhenshenghuo.cn");
        wx.downloadFile({
          url: contentimg,
          success: (res) => {
            console.log('下载成功:' + shareImg);
            contentimg = res.tempFilePath;
            ctx.drawImage(
              contentimg,
              that.getOBJvalue(150),
              that.getOBJvalue(200),
              that.getOBJvalue(300),
              that.getOBJvalue(300)
            );
  
            var userimg = wx.getStorageSync("userimg").replace("http://212.129.137.111:8088", "https://renzhenshenghuo.cn");
  
            console.log('用户头像地址' + userimg);
  
            wx.downloadFile({
              url: userimg,
              success: (res) => {
                console.log('下载成功:' + shareImg);
                userimg = res.tempFilePath;
                ctx.drawImage(
                  userimg,
                  that.getOBJvalue(40),
                  that.getOBJvalue(550),
                  that.getOBJvalue(100),
                  that.getOBJvalue(100)
                );
                drawQrcode({
                  x: that.getOBJvalue(360),
                  y: that.getOBJvalue(550),
                  width: that.getOBJvalue(160),
                  height: that.getOBJvalue(160),
                  canvasId: "myQrcode",
                  ctx: ctx,
                  text: imgUrl,
                });
  
                that.setData({
                  btnloading: false,
                });
  
              },
              fail: function (res) {
                // wx.showToast({
                //   title: '请前往个人中心登陆后再试',
                //   icon: 'none',
                // });
                // that.togglePopupclose();
  
                drawQrcode({
                  x: that.getOBJvalue(360),
                  y: that.getOBJvalue(550),
                  width: that.getOBJvalue(160),
                  height: that.getOBJvalue(160),
                  canvasId: "myQrcode",
                  ctx: ctx,
                  text: imgUrl,
                });
  
                that.setData({
                  btnloading: false,
                });
  
              }
            });
  
          },
        });
      },
    });
  },

  saveImgBtntwo() {
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
    if (this.data.btnloading) {
      return;
    }
    this.setData({
      btnloading: true,
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
                  canvasId: "myQrcodetwo",
                  success: (res) => {
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: (res) => {
                        // console.log(res);
                        _this.setData({
                          show1: false,
                          show2: false,
                          btnloading: false,
                        });
                      },
                      fail: (err) => {
                        _this.setData({
                          btnloading: false,
                        });
                      },
                    });
                  },
                  fail: (err) => {
                    wx.openSetting();
                    _this.setData({
                      btnloading: false,
                    });
                  },
                },
                this
              );
            },
            fail: (err) => {
              _this.setData({
                btnloading: false,
                openset: true,
              });
              // console.log("我进来额");
              wx.openSetting();
            },
          });
        } else {
          wx.canvasToTempFilePath(
            {
              canvasId: "myQrcodetwo",
              success: (res) => {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: (res) => {
                    // console.log(res);
                    _this.setData({
                      show1: false,
                      show2: false,
                      btnloading: false,
                    });
                  },
                  fail: (err) => {
                    _this.setData({
                      btnloading: false,
                    });
                  },
                });
              },
              fail: (err) => {
                _this.setData({
                  btnloading: false,
                });
              },
            },
            this
          );
        }
      },
    });
  },
  
  getOBJvalue(value) {
    return (value / 750) * wx.getSystemInfoSync().windowWidth;
  },

  roundRectfunction: function (ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle('white')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  
    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
  
    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
  
    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
  
    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)
  
    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },
  

  togglePopupclose() {
    var that = this
    app.checkauthorization(() => {
      this.setData({ show1: false });
      this.setData({ show2: false });
    });
    that.setData({
      btnloading: false,
      loading:false,
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
      ajaxData: that.data.warplist[indexs].replylist[0],
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
    var shareImg = _this.data.ajaxData.smallimg
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
        goodsId;
    } else {

      imgUrl =
        "https://renzhenshenghuo.cn/good/detail/?useridsaleman=" +
        wx.getStorageSync("fenxiaoshangid") +
        "&goodsid=" +
        goodsId +
        "&shopid=" +
        wx.getStorageSync("shopid");
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

    var thist = this

    // 我的店铺

    var shopid = '';
    var netstr = decodeURIComponent(options.q);
    if (netstr.length > 10) {
      var searchParams = thist.getQueryString(netstr, 'shopid');
      console.log('12333456' + searchParams);
      thist.setData({
        id: searchParams
      })
    }

    wx.request({
      url: app.data.hostAjax + '/api/user/v1/getsalespersongoodslist',
      data: {
        user_id: wx.getStorageSync("userid")

      },
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res)
        console.log(res.data.Data.list)
        if (res.data.Code == 200) {
          thist.setData({
            warplist: res.data.Data.list,
            reslst: res.data.Data.record,
          })
        } else {
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