## Vue Router
---

### vue-router路由传参
用params传参，F5强制刷新参数会被清空
```js
//发送方
export default {
  methods: {
    routerTo() {
      this.$router.push({
        name: `testRouterTo`,
        params: {
          page: '1', code: '8989'
        }
      })
    }
  }
}


//接收方
export default{
  data() {
    return {
      page: '',
      code: ''
    }
  },
  created() {
    this.getRouterData()
  },
  methods: {
    getRouterData() {
      this.page = this.$route.params.page
      this.code = this.$route.params.code
      console.log('page', this.page)
      console.log('code', this.code)
    }
  }
}
```
用query，由于参数适用路径传参的所以F5强制刷新也不会被清空
```js
//发送方
export default {
  methods: {
    routerTo() {
      this.$router.push({
        name: `testRouterTo`,
        query: {
          page: '1', code: '8989'
        }
      })
    }
  }
}

//接受方
export default{
  data() {
    return {
      page: '',
      code: ''
    }
  },
  created() {
    this.getRouterData()
  },
  methods: {
    getRouterData() {
      this.page = this.$route.query.page
      this.code = this.$route.query.code
      console.log('page', this.page)
      console.log('code', this.code)
    }
  }
}
```
由于query与params传参机制不一样，造成的差异
- 如果要隐藏参数用params
- 如果强制刷新不被清除用query