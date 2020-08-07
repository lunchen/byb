// 活动小方块 活动列表用
const util = require('../../utils/util.js');
const app = getApp()
Component({
  properties: {
    like: {
      type: Object,
      value: {
        // "x": 200,
        // "y": 200,
        // show: false
        // clear: true  //清除list
      },
      observer(newVal, oldVal){
        console.log(newVal)
        var data = this.data.likeList
        if(data.length>40){
          data = data.slice(30,data.length)
          this.setData({
            likeList: data
          })
        }
        data.push(newVal)
        this.setData({
          likeList: data
        })
        console.log(this.data.likeList)
        if(newVal.clear){
          this.setData({
            likeList: []
          })
        }
      }
    },
  },
  data: {
    needAni: false,
    likeList: []
  },
  attached(){
    var that = this 
  },
  methods: {
    
  }
})