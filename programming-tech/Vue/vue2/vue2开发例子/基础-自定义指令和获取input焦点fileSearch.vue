<template>
  <div style="height: 100%;width: 100%">
    <div
      class="van-nav-bar--fixed van-nav-bar van-hairline--bottom"
      style="z-index: 1;line-height:56px"
    >
      <form action="/">
        <van-search
          v-model="value"
          placeholder="请输入搜索关键词"
          show-action
          @search="onSearch"
          @cancel="onCancel"
          background="#fff"
          id="tesef"
          style="padding-top:10px;background-color:bule!important;"
          v-focus
        />
      </form>
    </div>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
    <input placeholder="fathh" v-focus>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
    <p v-myRed>哈哈</p>
  </div>
</template>
<script>
import { Search } from "vant";
export default {
  components: {
    [Search.name]: Search
  },
  data() {
    return {
      value: ""
    };
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function(el) {
        el.focus();
      }
    },
    // 自定义指令
    myRed: {
      inserted: function(el) {
        el.style.color = "red";
      }
    }
  },
  methods: {
    // 搜索
    onSearch() {
      alert("onSearch");
    },
    onCancel() {
      // this.$refs.inputText.blur();
      this.$router.push({ path: "/app/file" });
      // alert("onCancel");
    },
    blurEv() {
      blur();
    },
    // 搜索终
    thisFocus() {
      document.getElementById("tesef").focus();
    }
  },
  mounted() {
    var obj = document.getElementById("tesef");
    obj.style.background = "#f1f2f4";
    obj.style.borderRadius = "10px";
    obj.style.height = "28px";
    obj.style.padding = "10px";

    var dom = document.getElementsByClassName("van-cell__left-icon");
    for (var i = 0, len = dom.length; i < len; i++) {
      dom[i].style.color = "#1989fa";
      dom[i].style.fontSize = "21px";
      dom[i].style.lineHeight = "30px";
    }
    //tesef
    this.thisFocus();
    setTimeout(() => {
      this.thisFocus();
    }, 0);
  },
  activated() {}
};
</script>
<style scoped>
.van-nav-bar--fixed {
  top: 0;
  left: 0;
  width: 100%;
  position: fixed;
}
.van-nav-bar {
  height: 56px;
  position: fixed;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;
  line-height: 56px;
  background-color: #fff;
  /* background-color: aqua; */
}
.van-hairline--bottom::after {
  border-bottom-width: 1px;
}
.van-search--show-action {
  padding-right: 0;
  padding-left: 0;
}
</style>
