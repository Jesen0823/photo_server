const mysql = require("mysql2");
const config = require("../config/default");
// 先创建不带database的连接，用于创建数据库
const db = mysql.createConnection({
  host: config.database.HOST,
  user: config.database.USER,
  password: config.database.PASSWORD,
});

let pool = null;

const initPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.database.HOST,
      user: config.database.USER,
      password: config.database.PASSWORD,
      database: config.database.WALL,
    });
  }
  return pool;
};

const bdbs = (sql, value) => {
  return new Promise((resolve, reject) => {
    db.query(sql, value, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const query = (sql, values) => {
  const pool = initPool();
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

let WALLS = `create database if not exists WALLS default charset utf8 collate utf8_general_ci;`;

let createDatabase = (dbSql) => {
  return bdbs(dbSql, []);
};

let walls_tb = `create table if not exists walls_tb(
  id INT NOT NULL AUTO_INCREMENT,
  type INT NOT NULL COMMENT '类型0信息1图片',
  message VARCHAR(1000) COMMENT '留言',
  name VARCHAR(100) NOT NULL COMMENT '用户名',
  userId VARCHAR(100) NOT NULL COMMENT '创建者ID',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  label INT NOT NULL COMMENT '标签',
  color INT COMMENT '颜色',
  imgUrl VARCHAR(100) COMMENT '图片路径',
  PRIMARY KEY ( id )
);`;

let feedbacks_tb = `create table if not exists feedbacks_tb(
  id INT NOT NULL AUTO_INCREMENT,
  wallId INT NOT NULL COMMENT '留言Id',
  userId VARCHAR(100) NOT NULL COMMENT '反馈者ID',
  type INT NOT NULL COMMENT '反馈类型0喜欢1举报2撤销',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  PRIMARY KEY ( id )
);`;

let comments_tb = `create table if not exists comments_tb(
  id INT NOT NULL AUTO_INCREMENT,
  wallId INT NOT NULL COMMENT '留言Id',
  userId VARCHAR(100) NOT NULL COMMENT '评论者ID',
  imgUrl VARCHAR(100) COMMENT '头像路径',
  comment VARCHAR(1000) COMMENT '评论内容',
  name VARCHAR(100) NOT NULL COMMENT '用户名',
  moment VARCHAR(100) NOT NULL COMMENT '时间',
  PRIMARY KEY ( id )
);`;

let createTable = (sqlStr) => {
  return query(sqlStr, []);
};

async function create() {
  await createDatabase(WALLS);
  await createTable(walls_tb);
  await createTable(feedbacks_tb);
  await createTable(comments_tb);
}

create();

const insertWall = (value) => {
  let _sql =
    "insert into walls_tb set type=?,message=?,name=?,userId=?,moment=?,label=?,color=?,imgUrl=?;";
  return query(_sql, value);
};

const insertFeedback = (value) => {
  let _sql = "insert into feedbacks_tb set wallId=?,userId=?,type=?,moment=?;";
  return query(_sql, value);
};

const insertComment = (value) => {
  let _sql =
    "insert into comments_tb set wallId=?,userId=?,imgUrl=?,comment=?,name=?,moment=?;";
  return query(_sql, value);
};

const deleteWall = (id) => {
  let _sql = `delete a,b,c from walls_tb a left join 
  feedbacks_tb b on a.id=b.wallId left join 
  comments_tb c on a.id=c.wallId where a.id="${id}";`;
  return query(_sql);
};

const deleteFeedback = (id) => {
  let _sql = `delete from feedbacks_tb where id="${id}";`;
  return query(_sql);
};

const deleteComment = (id) => {
  let _sql = `delete from comments_tb where id="${id}";`;
  return query(_sql);
};

const findWallPage = (page, pageSize, type, label) => {
  let _sql;
  if (label == -1) {
    _sql = `select * from walls_tb where type="${type}" order by id desc limit ${(page - 1) * pageSize},${pageSize};`;
  } else {
    _sql = `select * from walls_tb where type="${type}" and label="${label}" order by id desc limit ${(page - 1) * pageSize},${pageSize};`;
  }
  return query(_sql);
};

const findCommentPage = (page, pageSize, id) => {
  let _sql = `select * from comments_tb where wallId="${id}" order by id desc limit ${(page - 1) * pageSize},${pageSize};`;
  return query(_sql);
};

const feedbackCount = (wid, type) => {
  let _sql = `select count(*) as count from feedbacks_tb where wallId="${wid}" and type="${type}";`;
  return query(_sql);
};

const commentCount = (wid) => {
  let _sql = `select count(*) as count from comments_tb where wallId="${wid}";`;
  return query(_sql);
};

const likeCount = (wid, uid) => {
  let _sql = `select count(*) as count from feedbacks_tb where wallId="${wid}" and userId="${uid}" and type=0;`;
  return query(_sql);
};

module.exports = {
  query,
  create,
  insertWall,
  insertFeedback,
  insertComment,
  deleteWall,
  deleteFeedback,
  deleteComment,
  findWallPage,
  findCommentPage,
  feedbackCount,
  commentCount,
  likeCount,
};
