import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const setup = () => {
  axios.interceptors.request.use(
    (config) => {
      // That's a way to handle with the store outside a component!
      // const authStore = useAuthStore();
      // console.log("Direct access:", authStore.accessToken);

      // Better we use a httponly cookie in procution system!
      const token = localStorage.getItem("accessToken");
      if (token) {
        // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        config.headers["x-access-token"] = token; // for Node.js Express back-end
      }

      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (res) => {
      console.log("RES", res);
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (originalConfig.url !== "/auth/login" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const rs = await axios.post("/auth/token", {
              refreshToken: "asdf2",
            });

            const { accessToken, refreshToken } = rs.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            console.log(rs.data);

            return axios(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
