// select下拉 
Component({
  properties: {
    customStyle: {
      type: String,
      value: ''
    },
    options: {
      type: Array,
      value: [
        // {
        // id: '001',
        // name: '是'
        // },{
        //   id: '002',
        //   name: '否'
        // }
      ],
      observer: function (newVal, oldVal) {
        this.changekv()
      }
    },
    defaultOption: {
      type: Object,
      value: {
        id: '000',
        name: '是否有基础'
      }
    },
    key: {
      type: String,
      value: 'id'
    },
    text: {
      type: String,
      value: 'name'
    }
  },
  data: {
    result: [],
    isShow: false,
    current: {}
  },
  methods: {
    optionTap(e) {
      let dataset = e.target.dataset
      this.setData({
        current: dataset,
        isShow: false
      });
      console.log(dataset)
      // 调用父组件方法，并传参
      this.triggerEvent("change", { ...dataset })
    },
    openClose() {
      this.setData({
        isShow: !this.data.isShow
      })
    },

    // 此方法供父组件调用
    close() {
      this.setData({
        isShow: false
      })
    },
    // 改变传入值的key 分别为id和name
    changekv(){
      let result = []
      // if (this.data.key !== 'id' || this.data.text !== 'name') { 
      //   for (let item of this.data.options) {
      //     let { [this.data.key]: id, [this.data.text]: name } = item
      //     result.push({ id, name })
      //   }
      // }
      for (let item of this.data.options) {
        let { [this.data.key]: id, [this.data.text]: name } = item
        result.push({ id, name })
      }
      let { [this.data.key]: id, [this.data.text]: name } = this.data.defaultOption
      this.setData({
        // current: Object.assign({}, this.data.defaultOption),
        current: { id, name },
        result: result
      })
      if (this.data.result[0] != undefined) {
        this.triggerEvent("change", { ...this.data.result[0] })
      }
      
    }
  },

  lifetimes: {
    attached() {
      // 属性名称转换, 如果不是 { id: '', name:'' } 格式，则转为 { id: '', name:'' } 格式
      this.changekv()
    }
  }
})