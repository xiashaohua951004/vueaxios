<template>
</template>

<script>
  import http from '../request/base'; // 导入接口域名列表

  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    created: function () {
      this.onLoad()
    },
    methods: {
      onLoad:function() {

        this.$api.get(`${http.sq}/home/index`).then(res=>{
            console.log("请求成功");
          console.log(res.status);
        }).catch(err=>{
          console.log("请求失败")
        })

      }

      //   this.$api.article.articleDetail(id,{
      //     member_id:3,
      //     seller_id:1
      //   }).then(res=> {
      //     // 执行某些操作
      //     console.log(123)
      //   })
      // }


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
