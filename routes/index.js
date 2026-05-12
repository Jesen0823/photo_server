const controller = require("../controller/dbServe");

module.exports = function (app) {
  // test
  app.get("/test", (req, res) => {
    res.type("html");
    res.render("test");
  });

  // 新建wall数据
  app.post("/insertWall", (req, res) => {
    controller.insertWall(req, res);
  });

  // 新建反馈
  app.post("/insertFeedback", (req, res) => {
    controller.insertFeedback(req, res);
  });

  // 新建评论
  app.post("/insertComment", (req, res) => {
    controller.insertComment(req, res);
  });

  // 删除wall
  app.post("/deleteWall", (req, res) => {
    controller.deleteWall(req, res);
  });

  // 删除反馈
  app.post("/deleteFeedback", (req, res) => {
    controller.deleteFeedback(req, res);
  });

  // 删除评论
  app.post("/deleteComment", (req, res) => {
    controller.deleteComment(req, res);
  });

  // 分页查wall
  app.post("/findWallPage", (req, res) => {
    controller.findWallPage(req, res);
  });

  // 分页查评论
  app.post("/findCommentPage", (req, res) => {
    controller.findCommentPage(req, res);
  });
};
