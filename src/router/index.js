import constanceVariable from "@/helpers/constanceVariable";
import helperFun from "@/helpers/helperFun";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../components/form/UserLoginForm.vue"),
    },

    {
      path: "/signup",
      name: "signup",
      component: () => import("../components/form/SignUpForm.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/users",
      name: "users",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/ListUsersView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/bookings",
      name: "bookings",
      component: () => import("../views/ListBookginsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("../components/customs/CustomFullCalender.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/404View.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {  
  const isProtected = to.meta.requiresAuth;
  const infoUser = helperFun.getSessionItem(
    constanceVariable.SessionStorageKey.UserInfo
  );
  if (isProtected && !infoUser) {
    next({ path: "/" });
  } else {
    next();
  }
});
export default router;
