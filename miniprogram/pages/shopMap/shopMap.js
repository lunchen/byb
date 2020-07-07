
const util = require('../../utils/util.js');
const apiServer = require('../../api/request.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const app = getApp()
Page({
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '选择地址', //导航栏 中间的标题
      white: false, // 是就显示白的，不是就显示黑的。
      address: '' // 加个背景 不加就是没有
    },
    height: app.globalData.navheight,
    addListShow: false,
    chooseCity: false,
    regionShow: {
      province: false,
      city: false,
      district: true
    },
    regionData: {}, 
    currentRegion: {
      province: '选择城市',
      city: '选择城市',
      district: '选择城市',
    },
    currentProvince: '选择城市',
    currentCity: '选择城市',
    currentDistrict: '选择城市',
    latitude: '',
    longitude: '',
    centerData: {},
    nearList: [],
    suggestion: [],
    selectedId: 0,
    defaultKeyword: '房产小区',
    keyword: '',
    index: ''
  },
  onLoad: function (e) {
    console.log(e)
    var nindex = e ? e.index : '';
    this.setData({
      index: nindex
    })
    let self =this;
    self.mapCtx = wx.createMapContext('myMap')
    // 实例化API核心类

    // qqmapsdk1: "W57BZ-JDB6X-XPA4H-Z76MI-73FF2-24BT4",
    //   qqmapsdk: "XIFBZ-MFRC3-LL73N-YT4ZG-ZIPJ6-YZBCG",
    qqmapsdk = new QQMapWX({
        key: 'XIFBZ-MFRC3-LL73N-YT4ZG-ZIPJ6-YZBCG'
    });
    wx.showLoading({
      title: '加载中'
    });
    console.log(qqmapsdk)
    self.getUserLocation(qqmapsdk)
    //定位
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     //console.log(res)
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     const speed = res.speed
    //     const accuracy = res.accuracy
    //     //你地址解析
    //     qqmapsdk.reverseGeocoder({
    //       location: {
    //         latitude: latitude,
    //         longitude: longitude
    //       },
    //       success: function (res) {
    //         //console.log(res)
    //         self.setData({
    //           latitude: latitude,
    //           longitude: longitude,
    //           currentRegion: res.result.address_component,
    //           keyword: self.data.defaultKeyword
    //         })
    //         // 调用接口
    //         self.nearby_search();
    //       },
    //     });
    //   },
    //   fail(err) {
    //     //console.log(err)
    //     wx.hideLoading({});
    //     wx.showToast({
    //       title: '定位失败',
    //       icon: 'none',
    //       duration: 1500
    //     })
    //     setTimeout(function () {
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     }, 1500)
    //   }
    // })
  },
  onReady: function () {
    
  },
  //监听拖动地图，拖动结束根据中心点更新页面
  mapChange: function (e) {
    let self = this;
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')){
      self.mapCtx.getCenterLocation({
        success: function (res) {
          //console.log(res)
          self.setData({
            nearList:[],
            latitude: res.latitude,
            longitude: res.longitude,
          })
          self.nearby_search();
        }
      })
    }
    
  },
  //重新定位
  reload: function () {
    this.onLoad();
  },
  //整理目前选择省市区的省市区列表
  getRegionData: function () {
    let self = this;
    //调用获取城市列表接口
    qqmapsdk.getCityList({
      success: function (res) {//成功后的回调
        //console.log(res)
        let provinceArr = res.result[0];
        let cityArr = [];
        let districtArr = [];
        for (var i = 0; i < provinceArr.length; i++) {
          var name = provinceArr[i].fullname;
          if (self.data.currentRegion.province == name) {
            if (name == '北京市' || name == '天津市' || name == '上海市' || name == '重庆市') {
              cityArr.push(provinceArr[i])
            } else {
              qqmapsdk.getDistrictByCityId({
                // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
                id: provinceArr[i].id,
                success: function (res) {//成功后的回调
                  //console.log(res);
                  cityArr = res.result[0];
                  self.setData({
                    regionData: {
                      province: provinceArr,
                      city: cityArr,
                      district: districtArr
                    }
                  })
                },
                fail: function (error) {
                  //console.error(error);
                },
                complete: function (res) {
                  //console.log(res);
                }
              });
            }
          }
        }
        for (var i = 0; i < res.result[1].length; i++) {
          var name = res.result[1][i].fullname;
          if (self.data.currentRegion.city == name) {
            qqmapsdk.getDistrictByCityId({
              // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
              id: res.result[1][i].id,
              success: function (res) {//成功后的回调
                //console.log(res);
                districtArr = res.result[0];
                self.setData({
                  regionData: {
                    province: provinceArr,
                    city: cityArr,
                    district: districtArr
                  }
                })
              },
              fail: function (error) {
                //console.error(error);
              },
              complete: function (res) {
                //console.log(res);
              }
            });
          }
        }
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  onShow: function () {
    let self = this;
  },
  //地图标记点
  addMarker: function (data) {
    //console.log(data)
    //console.log(data.title)
    var mks = [];
    mks.push({ // 获取返回结果，放到mks数组中
      title: data.title,
      id: data.id, 
      addr: data.addr,
      province: data.province,
      city: data.city,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      iconPath: "/images/my_marker.png", //图标路径
      width: 25,
      height: 25
    })
    this.setData({ //设置markers属性，将搜索结果显示在地图中
      markers: mks,
      currentRegion: {
        province: data.province,
        city: data.city,
        district: data.district,
      }
    })
    wx.hideLoading({});
  },
  //点击选择搜索结果
  backfill: function (e) {
    var id = e.currentTarget.id;
    let name = e.currentTarget.dataset.name;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        //console.log(this.data.suggestion[i])
        this.setData({
          centerData: this.data.suggestion[i],
          addListShow: false,
          latitude: this.data.suggestion[i].latitude,
          longitude: this.data.suggestion[i].longitude
        }); 
        this.nearby_search();
        return;
        //console.log(this.data.centerData)
      }
    }
  },
  //点击选择地图下方列表某项
  chooseCenter: function (e) {
    var id = e.currentTarget.id;
    let name = e.currentTarget.dataset.name;
    for (var i = 0; i < this.data.nearList.length; i++) {
      if (i == id) {
        this.setData({
          selectedId: id,
          centerData: this.data.nearList[i],
          latitude: this.data.nearList[i].latitude,
          longitude: this.data.nearList[i].longitude,
        });
        this.addMarker(this.data.nearList[id]);
        return;
        //console.log(this.data.centerData)
      }
    }
  },
  //显示搜索列表
  showAddList: function () {
    this.setData({
      addListShow: true
    })
  },
  // 根据关键词搜索附近位置
  nearby_search: function () {
    var self = this;
    wx.hideLoading();
    wx.showLoading({
      title: '加载中'
    });
    // 调用接口
    qqmapsdk.search({
      keyword: self.data.keyword,  //搜索关键词
      //boundary: 'nearby(' + self.data.latitude + ', ' + self.data.longitude + ', 1000, 16)',
      location: self.data.latitude + ',' + self.data.longitude,
      page_size: 20,
      page_index: 1,
      success: function (res) { //搜索成功后的回调
        //console.log(res.data)
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].ad_info.province,
            city: res.data[i].ad_info.city,
            district: res.data[i].ad_info.district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        self.setData({
          selectedId: 0,
          centerData: sug[0],
          nearList: sug, 
          suggestion: sug
        })
        self.addMarker(sug[0]);
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  //根据关键词搜索匹配位置
  getsuggest: function (e) {
    var _this = this;
    var keyword = e.detail.value;
    _this.setData({
      addListShow: true
    })
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      location: _this.data.latitude + ',' + _this.data.longitude,
      page_size: 20,
      page_index: 1,
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) {//搜索成功后的回调
        //console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].province,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug,
          nearList: sug,
          keyword: keyword
        });
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  //打开选择省市区页面
  chooseCity: function () {
    let self = this;
    self.getRegionData();
    self.setData({
      chooseCity: true,
      regionShow: {
        province: false,
        city: false,
        district: true
      },
      currentProvince: self.data.currentRegion.province,
      currentCity: self.data.currentRegion.city,
      currentDistrict: self.data.currentRegion.district,
    })
  },
  //选择省
  showProvince: function () {
    this.setData({
      regionShow: {
        province: true,
        city: false,
        district: false
      }
    })
  },
  //选择城市
  showCity: function () {
    this.setData({
      regionShow: {
        province: false,
        city: true,
        district: false
      }
    })
  },
  //选择地区
  showDistrict: function () {
    this.setData({
      regionShow: {
        province: false,
        city: false,
        district: true
      }
    })
  },
  //选择省之后操作
  selectProvince: function (e) {
    //console.log(e)
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    self.setData({
      currentProvince: name,
      currentCity: '请选择城市',
    })
    if (name == '北京市' || name == '天津市' || name == '上海市' || name == '重庆市'){
      var provinceArr = self.data.regionData.province;
      var cityArr = [];
      for (var i = 0; i < provinceArr.length;i++){
        if(provinceArr[i].fullname == name){
          cityArr.push(provinceArr[i])
          self.setData({
            regionData: {
              province: self.data.regionData.province,
              city: cityArr,
              district: self.data.regionData.district
            }
          })
          self.showCity();
          return;
        }
      }
    }else{
      let bj = self.data.regionShow;
      self.getById(id, name, bj)
    }
  },
  //选择城市之后操作
  selectCity: function (e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    self.setData({
      currentCity: name,
      currentDistrict: '请选择城市',
    })
    let bj = self.data.regionShow;
    self.getById(id, name, bj)
  },
  //选择区县之后操作
  selectDistrict: function (e) {
    let self = this;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let latitude = e.currentTarget.dataset.latitude;
    let longitude = e.currentTarget.dataset.longitude;
    self.setData({
      currentDistrict: name,
      latitude: latitude,
      longitude: longitude,
      currentRegion: {
        province: self.data.currentProvince,
        city: self.data.currentCity,
        district: name
      }, 
      chooseCity: false,
      keyword: self.data.defaultKeyword
    })
    self.nearby_search();
  },
  //根据选择省市加载市区列表
  getById: function (id,name,bj) {
    let self = this;
    qqmapsdk.getDistrictByCityId({
      // 传入对应省份ID获得城市数据，传入城市ID获得区县数据,依次类推
      id: id, //对应接口getCityList返回数据的Id，如：北京是'110000'
      success: function (res) {//成功后的回调
        //console.log(res);
        if(bj.province){
          self.setData({
            regionData: {
              province: self.data.regionData.province,
              city: res.result[0],
              district: self.data.regionData.district
            }
          })
          self.showCity();
        } else if (bj.city) {
          self.setData({
            regionData: {
              province: self.data.regionData.province,
              city: self.data.regionData.city,
              district: res.result[0]
            }
          })
          self.showDistrict();
        } else {
          self.setData({
            chooseCity: false,
          })
        }
      },
      fail: function (error) {
        //console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  //返回上一页或关闭搜索页面
  back1: function () {
    if (this.data.addListShow) {
      this.setData({
        addListShow: false
      })
    }else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //关闭选择省市区页面
  back2: function () {
    this.setData({
      chooseCity: false
    })
  },
  //确认选择地址
  selectedOk: async function () {
    var _this = this;
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2]; 
    console.log(this.data.centerData)
    var addrNo = await util.getAddrNo(this.data.centerData)
    prevPage.setData({
      storeAddress: this.data.centerData,
      index: this.data.index,
      addrNo: addrNo
    })
    wx.navigateBack({
      // 返回并执行上一页面方法
      success: function () {
        prevPage.setAddress({
          storeAddress: _this.data.centerData,
          index: _this.data.index,
          addrNo: addrNo
        }); // 执行前一个页面的方法
      }
    });
  },
  // 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
  getUserLocation: function (qqmapsdk) {
    console.log(qqmapsdk)
    let that = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation(qqmapsdk);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation(qqmapsdk);
        }
        else {
          //调用wx.getLocation的API
          that.getLocation(qqmapsdk);
        }
      }
    })
  },
  // 获取定位当前位置的经纬度
  getLocation: function (qqmapsdk) {
    console.log(qqmapsdk)
    let self = this;
    //定位
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        //console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            //console.log(res)
            self.setData({
              latitude: latitude,
              longitude: longitude,
              currentRegion: res.result.address_component,
              keyword: self.data.defaultKeyword
            })
            // 调用接口
            self.nearby_search();
          },
        });
      },
      fail(err) {
        //console.log(err)
        wx.hideLoading({});
        wx.showToast({
          title: '定位失败',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    })
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     let latitude = res.latitude
    //     let longitude = res.longitude
    //     app.globalData.lat = res.latitude;//
    //     app.globalData.lng = res.longitude;//把onload定位时候的经纬度存到全局
    //     let speed = res.speed
    //     let accuracy = res.accuracy;
    //     that.getLocal(latitude, longitude)
    //   },
    //   fail: function (res) {
    //     console.log('fail' + JSON.stringify(res))
    //   }
    // })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district;
        // 保存一下当前定位的位置留着后面重新定位的时候搜索附近地址用
        app.globalData.currentLocation = district;
        that.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude,
          district: district
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
})