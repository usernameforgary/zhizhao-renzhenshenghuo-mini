// pages/pe\rson/order/evaluate.js
const app = getApp();
var util = require("../../../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeindex_1: 0,
    evaluatelist_1: [
      {
        index: 1,
        label: "不满意",
        active: false,
      },
      {
        index: 2,
        label: "一般",
        active: false,
      },
      {
        index: 3,
        label: "满意",
        active: false,
      },
      {
        index: 4,
        label: "非常满意",
        active: false,
      },
      {
        index: 5,
        label: "无可挑剔",
        active: false,
      },
    ],
    activeindex_2: 0,
    evaluatelist_2: [
      {
        index: 1,
        label: "不满意",
        active: false,
      },
      {
        index: 2,
        label: "一般",
        active: false,
      },
      {
        index: 3,
        label: "满意",
        active: false,
      },
      {
        index: 4,
        label: "非常满意",
        active: false,
      },
      {
        index: 5,
        label: "无可挑剔",
        active: false,
      },
    ],
    value: "",//店铺简介
    value1: "",//店铺公告
    value2: '',//店铺名称
    cinfo: {
      id: "",
      c_name: "",
      c_img: "",
      t_name: "",
      t_img: "",
    },
    imagelist: [],
    orderid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.hasOwnProperty("id")) {
      this.setData({
        orderid: options.id,
        cinfo: options,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  starTap1: function (e) {
    let index = e.currentTarget.dataset["index"];
    this.setData({
      activeindex_1: this.activeindex_1 === index ? 0 : index,
    });
  },
  starTap2: function (e) {
    let index = e.currentTarget.dataset["index"];
    this.setData({
      activeindex_2: this.activeindex_2 === index ? 0 : index,
    });
  },
  tInput: function (event) {
    console.log(event)
    this.setData({
      value: event.detail.value,
    });
  },
  tInput1: function (event) {
    this.setData({
      value1: event.detail.value,
    });
  },
  tInput2: function (event) {
    this.setData({
      value2: event.detail.value,
    });
  },
  submit: function (e) {
    let _this = this;
    if (!this.data.value) {
      wx.showToast({
        title: "请填写介绍",
        icon: "none",
      });
      return;
    }


    let url = [];
    for (let i = 0; i < _this.data.imagelist.length; i++) {
      const element = _this.data.imagelist[i];
      url.push(element.path);
    }
    // let postdata = {
    //   //全部领取优惠券
    //   userid: wx.getStorageSync("userIdBuyGood"),
    //   corporatename: _this.data.value2,
    //   briefintroduction: _this.data.value,
    //   notice: _this.data.value1,
      
    //   logimg: url.join("|"),
      
    // };
    wx.request({
      url: app.data.hostAjax + "/api/dstributor/v1/updatedstributoinfo",   
      data: {
        id: _this.data.orderid,
        corporatename: _this.data.value2,
        briefintroduction: _this.data.value,
        notice: _this.data.value1,

        logimg: url.join("|"),
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
     
      success(res) {
        console.log(res.data)
        if (res.data.Code == "200") {
          wx.showToast({
            title: "修改成功！",
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 500);
        } else {
          wx.showToast({
            title: "网络错误，请稍后重试！",
            icon: "none",
          });
        }
      }
    })
  
  
   
  },
  addImg: function () {
    let _this = this;
    wx.chooseImage({
      count: 9 - _this.data.imagelist.length,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        // _this.setData({
        //   imagelist: [..._this.data.imagelist, ...res.tempFiles],
        // });
        if (res.tempFilePaths.count == 0) {
          return;
        }
        let tempFilePaths = res.tempFilePaths;
        _this.uploadImg(tempFilePaths);
      },
    });
  },
  uploadImg: function (tempFilePaths) {
    let _this = this;
    wx.showToast({
      title: "正在上传",
      icon: "loading",
      mask: true,
      duration: 1000,
    });
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //上传图片 循环提交
    for (let i = 0; i < tempFilePaths.length; i++) {
      wx.uploadFile({
        url: app.data.hostAjax + "/api/other/v1/PostFile",
        filePath: tempFilePaths[i],
        name: "file",
        header: {
          "Content-Type": "multipart/form-data",
        },
        // formData: {
        //   method: "POST", //请求方式
        // },
        success: function (res) {
          let rres = JSON.parse(res.data);
          _this.setData({
            imagelist: [
              ..._this.data.imagelist,
              ...[{ path: rres.Data[0].f_url }],
            ],
          });
        },
      });
    }
  },
  delImg: function (e) {
    let index = e.currentTarget.dataset["index"];
    this.setData({
      imagelist: this.data.imagelist.splice(index, 1),
    });
  },
});
