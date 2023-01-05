import axios from "axios";
import React, { useState } from "react";
import "./App.css";
import axiosInstance from "./Axios/AxiosInterceptors";

const userData = {
   name: "Testing",
   age: 21,
};

function App() {
   const [Error, setError] = useState(null);
   const [PrivateRouteData, setPrivateRouteData] = useState(null);

   const authHandler = async function () {
      try {
         const loginRespose = await axios.post("http://localhost:8000/login", userData);

         if (loginRespose?.data) {
            window.cookieStore.set("accessToken", loginRespose?.data?.accessToken);
            window.cookieStore.set("refreshToken", loginRespose?.data?.refreshToken);
            console.log("auth api respose ", loginRespose?.data);
         }
      } catch (err) {
         console.log(err);
         setError(err.message);
      }
   };

   const GetPrivateApiAccessHandler = async function () {
      try {
         const privateApi = await axiosInstance.get("/private-api-route");
         setPrivateRouteData(JSON.stringify(privateApi?.data));
      } catch (err) {
         console.log(err);
      }
   };

   const logOut = function () {};

   return (
      <div className="App">
         <button onClick={authHandler}>login button</button>
         <button onClick={authHandler}>sing in button</button>
         <button onClick={logOut}>log out</button>
         <p onClick={GetPrivateApiAccessHandler}>get private api data</p>
         {!!Error ? <p>{Error}</p> : null}
         {!!PrivateRouteData ? <p>{PrivateRouteData}</p> : null}
      </div>
   );
}

export default App;
