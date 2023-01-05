import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = "http://localhost:8000";

let authToken = window.cookieStore.get("accessToken")
   ? window.cookieStore.get("accessToken")
   : null;

const axiosInstance = axios.create({
   baseURL: baseURL,
   headers: {
      Accept: "application/json",
   },
});

axiosInstance.interceptors.request.use(
   async function (config) {
      const authAccessToken = await authToken;
      const refrehToken = await window.cookieStore.get("refreshToken");

      if (!authAccessToken?.value) {
         // set auth header.
         config.headers.Authorization = `Bearer ${authAccessToken?.value}`;
      }

      const decodeAccessToken = jwtDecode(authAccessToken?.value);
      const now = new Date();

      // if token is valid reurn config req.
      if (!(decodeAccessToken.exp * 1000 < now.getTime())) {
         config.headers.Authorization = `Bearer ${authAccessToken?.value}`;
         console.log("jwt token expire is not expire right now");
         return config;
      } else {
         console.log("jwt token expire now");

         const accessTokenResponse = await axios.post(`${baseURL}/refresh-token`, {
            refrehToken: refrehToken?.value,
         });

         window.cookieStore.set("accessToken", accessTokenResponse.data.accessToken);
         config.headers.Authorization = `Bearer ${accessTokenResponse.data.accessToken}`;
         return config;
      }
   },
   function (error) {
      return Promise.reject(error.response);
   }
);

export default axiosInstance;
