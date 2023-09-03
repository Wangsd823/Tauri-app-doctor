import { createApp } from "vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "./styles.css";
import App from "./App.vue";

const app = createApp(App);
// FIXME 注册 icons
// TODO icons input待处理
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.mount("#app");
