import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
    email: "",
    loggedIn:
      localStorage.getItem("accessToken") !== "" &&
      localStorage.getItem("refreshToken") !== "",
  }),
  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    },
    login(email: string) {
      this.email = email;
      this.loggedIn = true;
    },
    logout() {
      this.email = "";
      this.loggedIn = false;

      // Here we delte the tokens, too
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});
