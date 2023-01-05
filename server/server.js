require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const jwt = require("jsonwebtoken");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
   cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
   })
);

// genrate access token function
const genrateJwtAccessToken = function (user) {
   const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "2m",
   });
   return accessToken;
};

// genrate refresh token function
const genrateRefreshToken = function (user) {
   const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "1y",
   });
   return refreshToken;
};

// varify jwt token function
const varifyJwtToken = function (req, res, next) {
   const authToken = req.headers["authorization"];

   const token = authToken.split(" ")[1];
   console.log(token);

   if (!token)
      return res.status(401).json({
         error: true,
         message: "Unauthorized",
      });

   jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, payload) => {
      if (err) {
         return res.status(401).json({
            error: true,
            message: "Unauthorized",
         });
      }

      next();
   });
   //    next();
};

// login user api end point
app.post("/login", function (req, res, next) {
   const user = req.body;
   const accessToken = genrateJwtAccessToken(user);
   const refreshToken = genrateRefreshToken(user);

   return res.status(201).json({
      accessToken,
      refreshToken,
   });
});

// singin user api end point
app.post("/singin", function (req, res, next) {
   const user = req.body;
   const accessToken = genrateJwtAccessToken(user);
   const refreshToken = genrateRefreshToken(user);

   return res.status(201).json({
      accessToken,
      refreshToken,
   });
});

// refresh token api function
app.post("/refresh-token", function (req, res, next) {
   const user = req.body;
   const accessToken = genrateJwtAccessToken(user);
   return res.status(201).json({
      accessToken,
   });
});

// api private route onlue valid user can acces this route.
app.get("/private-api-route", varifyJwtToken, function (res, res, next) {
   return res.status(200).json({
      error: false,
      success: true,
      message: "Welcome to private route",
   });
});

// server port
http.listen(port, () => {
   console.log(`server running in port ${port}`);
});
