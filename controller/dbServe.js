const dbModel = require("../lib/db");
const MKDir = require("../lib/mkdir");

// 新建walls
exports.insertWall = async (req, res) => {
  let data = req.body;
  console.log("insertWall,body:", data);
  await dbModel
    .insertWall([
      data.type,
      data.message,
      data.name,
      data.userId,
      data.moment,
      data.label,
      data.color,
      data.imgUrl,
    ])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

// 新建反馈
exports.insertFeedback = async (req, res) => {
  let data = req.body;
  await dbModel
    .insertFeedback([data.wallId, data.userId, data.type, data.moment])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

// 新建评论
exports.insertComment = async (req, res) => {
  let data = req.body;
  await dbModel
    .insertComment([
      data.wallId,
      data.userId,
      data.imgUrl,
      data.comment,
      data.name,
      data.moment,
    ])
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

// 删除wall
exports.deleteWall = async (req, res) => {
  let data = req.body;
  if (data.imgUrl) {
    // MKDir.delFiles("data/" + data.imgUrl);
  }
  await dbModel.deleteWall(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

// 删除反馈
exports.deleteFeedback = async (req, res) => {
  let data = req.body;
  await dbModel.deleteFeedback(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

// 删除评论
exports.deleteComment = async (req, res) => {
  let data = req.body;
  await dbModel.deleteComment(data.id).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

// 分页查wall
exports.findWallPage = async (req, res) => {
  let data = req.body;
  await dbModel
    .findWallPage(data.page, data.pageSize, data.type, data.label)
    .then(async (result) => {
      for (let i = 0; i < result.length; i++) {
        // 喜欢
        result[i].like = await dbModel.feedbackCount(result[i].id, 0);
        // 举报
        result[i].report = await dbModel.feedbackCount(result[i].id, 1);
        // 要求撤销
        result[i].revoke = await dbModel.feedbackCount(result[i].id, 2);
        // 是否点赞
        result[i].islike = await dbModel.likeCount(result[i].id, data.userId);
        // 评论数
        result[i].comcount = await dbModel.commentCount(result[i].id);
      }
      res.send({
        code: 200,
        message: result,
      });
    });
};

// 分页查评论
exports.findCommentPage = async (req, res) => {
  let data = req.body;
  await dbModel
    .findCommentPage(data.page, data.pageSize, data.id)
    .then((result) => {
      res.send({
        code: 200,
        message: result,
      });
    });
};

// 反馈数量查询
exports.feedbackCount = async (req, res) => {
  let data = req.body;
  await dbModel.feedbackCount(data.wid, data.type).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

// 评论数量查询
exports.commentCount = async (req, res) => {
  let data = req.body;
  await dbModel.findCommentPage(data.wid).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};

// 点赞数量
exports.likeCount = async (req, res) => {
  let data = req.body;
  await dbModel.findCommentPage(data.wid, data.uid).then((result) => {
    res.send({
      code: 200,
      message: result,
    });
  });
};
