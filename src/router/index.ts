import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import TheOverview from "@/views/TheOverview.vue";
import CustomerOverview from "@/views/CustomerOverview.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: TheOverview,
      // beforeEnter: (to, from, next) => {
      //   const authStore = useAuthStore();
      //   if (!authStore.loggedIn) {
      //     next({ name: "login" }); // Redirect to login if not logged in
      //   } else {
      //     next(); // Proceed to the route
      //   }
      // },
      children: [
        {
          path: "customers",
          component: CustomerOverview,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

export default router;
