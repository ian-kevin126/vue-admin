import Vue from "vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import VueLazyLoad from "vue-lazyload";
import VueCookie from "vue-cookie";
import { Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store";
import App from "./App.vue";
// import env from './env'
// mock开关
const mock = false;
if (mock) {
  require("./mock/api");
}

// 如果是jsonp或者后端跨域的时候，就需要写成完整的接口链接。
// axios.defaults.baseURL = 'https://www.easy-mock.com/mock/5dc7afee2b69d9223b633cbb/mimall';

// https://segmentfault.com/a/1190000037557209
// 如果是前端设置了代理之后，就只要设置成/api就可以了。根据前端的跨域方式做调整 /a/b : /api/a/b => /a/b
axios.defaults.baseURL = "/api";
// 超时时间，一定要做设置，不然会影响用户体验
axios.defaults.timeout = 8000;

// cors或者jsonp跨域时用这个：根据环境变量获取不同的请求地址
// axios.defaults.baseURL = env.baseURL;
// 接口错误拦截
axios.interceptors.response.use(
  function (response) {
    let res = response.data;
    let path = location.hash;
    if (res.status == 0) {
      return res.data;
      // 未登录的状态码要事先跟后端对接好
    } else if (res.status == 10) {
      // 不在首页的时候才跳转登录页
      if (path !== "#/index") {
        window.location.href = "/#/login";
      }
      return Promise.reject(res);
    } else {
      Message.warning(res.msg);
      return Promise.reject(res);
    }
  },
  (error) => {
    let res = error.response;
    Message.error(res.data.message);
    return Promise.reject(error);
  }
);

// 将axios挂在到Vue实例上，在组件中就可以通过this.axios去调接口了。
Vue.use(VueAxios, axios);
Vue.use(VueCookie);
Vue.use(VueLazyLoad, {
  loading: "/imgs/loading-svg/loading-bars.svg",
});
Vue.prototype.$message = Message;
Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
