import router from "@/router";
import axios from "axios";

const setup = () => {
  // Request Interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["x-access-token"] = token; // Attach token to headers for backend
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (err) => {
      const originalConfig = err.config;
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      // Check if the error is not from the login endpoint and if a 403 error occurred
      if (originalConfig.url.indexOf("/auth/login") === -1 && err.response) {
        // Token expired
        if (err.response.status === 403 && !originalConfig.retry) {
          originalConfig.retry = true; // Set retry flag to avoid infinite loops

          if (!localStorage.getItem("refreshToken")) {
            await router.push("/login");
            return Promise.reject(err);
          }

          try {
            // Use the refresh token to get a new access token
            const rs = await axios.post(VITE_BACKEND_URL + "/auth/token", {
              refreshToken: localStorage.getItem("refreshToken"),
            });

            const { accessToken, refreshToken } = rs.data;

            // Store new tokens in localStorage
            localStorage.setItem("refreshToken", refreshToken);

            // Set the new access token to the original request and resend it
            originalConfig.headers["x-access-token"] = accessToken;

            return axios(originalConfig); // Resend the original request
          } catch (_error) {
            // Redirect to login in case of token refresh failure
            await router.push("/login");
            return Promise.reject(_error);
          }
        } else {
          await router.push("/login");
          return Promise.reject(err);
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;
