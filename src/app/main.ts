import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "./main.scss";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});
createApp(App).use(VueQueryPlugin, { queryClient }).use(PrimeVue).mount("#app");
