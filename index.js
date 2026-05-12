const express = require("express");
const path = require("path");

// 用来解析html
const ejs = require("ejs");
const config = require("./config/default");

const app = express();

// 获取静态路径
//app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/data"));

// 设置允许跨域访问该服务
app.use(function (req, res, next) {
  // 允许访问ip为所有*
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", "3.2.1");
  res.header("Control-Type", "application/json;charset=utf-8");

  if (req.method == "OPTIONS") {
    // 让options请求快速返回
    res.sendStatus(200);
  } else {
    next();
  }
});

// 加入html视图
app.engine("html", ejs.__express);
app.set("view engine", "html");

// 解析前端数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 引入路由
require("./routes/index")(app);
//require("./routes/files")(app);

app.listen(config.port, () => {
  console.log(`Server start the PORT ${config.port}`);
});
