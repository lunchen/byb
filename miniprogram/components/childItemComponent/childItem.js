// 育儿小方块 暂不用
const app = getApp()
Component({
  properties: {
    informationData: {
      //informationListData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {
        id: 0,
        readCount: 0,
        readCountValue: "",
        remark: "",
        star: 0,
        title: "",
        type: 1,    //1育儿咨询2测试
        url: {
          name: "",
          no: "",
          skipUrl: "",
          type: {
            id: 0,
            name: "",
            paramFlg: 0,
            paramName: ""
          }
        }
      },
      observer: function (newVal, oldVal) { }
    },
    
  },
  data: {
  },
  attached: function () {
    
  },
  methods: {
  }
})
/*informationListData: [
      {
        id: 0,
        readCount: 0,
        readCountValue: "",
        remark: "",
        star: 0,
        title: "",
        type: 1,    //1育儿咨询2测试
        url: {
          name: "",
          no: "",
          skipUrl: "",
          type: {
            id: 0,
            name: "",
            paramFlg: 0,
            paramName: ""
          }
        }
      }
    ]
    */