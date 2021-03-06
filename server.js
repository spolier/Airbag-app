const express = require('express')
const app = express()
// MongoDB 数据库配置
// const url = "mongodb://127.0.0.1:27017/runoob"
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://0.0.0.0:27017/"
const bodyParser = require('body-parser')
const fs = require("fs")
// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const multer = require('multer')
const ObjectId = require('mongodb').ObjectID

// HTTP 请求上传参数最大限制修改
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(express.json({limit: '100mb'}));

// g-zip 压缩
const compression = require('compression')
app.use(compression())

app.use(express.static('public'))

// extended 为 false 表示使用 querystring 来解析数据，这是 URL-encoded 解析器
app.use(bodyParser.urlencoded({ extended: false }))

// 文件上传
app.use(multer({ dest: '/tmp/' }).array('file'))
app.use(express.static('dist'))

// 日志
const log4js = require('log4js')
log4js.configure({
  appenders: {
    file: {
      type: 'dateFile',
      filename: 'logs/app',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss} %p - %m',
      }
    }
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'debug'
    }
  }
})
const logger = log4js.getLogger()
// logger.debug('debug log ~')
// logger.info('info log ~')
// logger.warn('warn log ~')
// logger.error('error log ~')
// logger.fatal('fatal log ~')

// 用户登录
app.post('/login', urlencodedParser, function (req, res) {
  logger.info('>> 登录请求')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let whereStr = {
      "name": req.body.name,
      "password": req.body.password
    }
    // 查询条件
    dbo.collection("user").find(whereStr).toArray(function (e, r) {
      if (e) throw e
      if (r.length > 0) {
        res.send(JSON.stringify({ access: true }))
      } else {
        res.send(JSON.stringify({ access: false }))
      }
      db.close()
      logger.info('登录成功 <<')
    })
  })
})

// 查询所有文章
app.get('/list', function (req, res) {
  logger.info('>> 查询全部文章列表')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let whereStr = {
      "flag": 0
    }
    var mysort = { date: -1 }
    // 查询条件
    dbo.collection("ulysses").find(whereStr).sort(mysort).toArray(function (e, r) {
      if (e) throw e
      res.send(JSON.stringify(r))
      db.close()
      logger.info('查询全部文章列表成功 <<')
    })
  })
})

// 查询所有文章 (分页)
app.post('/pager', urlencodedParser, function (req, res) {
  logger.info('>> 查询全部文章 (分页)')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let whereStr = {
      "flag": 0
    }
    let index = parseInt(req.body.index)
    let size = parseInt(req.body.size)
    let num = index * size
    let mysort = { date: -1 }
    let total = null
    // 查询条件
    dbo.collection("ulysses").find(whereStr).sort(mysort).limit(size).skip(num).toArray(function (e, r) {
      if (e) throw e
      dbo.collection("ulysses").aggregate([{$group : {_id: "$flag", total : {$sum : 1}}}]).toArray(function (er, re) {
        if (er) throw er
        total = re
        r.push(total)
        res.send(JSON.stringify(r))
        db.close()
        logger.info('查询全部文章成功 (分页) <<')
      })
    })
  })
})

// 查询单篇文章
app.get('/markdown', function (req, res) {
  logger.info('>> 查询单篇文章')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let whereStr = {
      "_id": ObjectId(req.query.id),
      "flag": 0
    }
    // 查询条件
    logger.debug(whereStr)
    dbo.collection("ulysses").find(whereStr).toArray(function (e, r) {
      if (e) throw e
      res.send(JSON.stringify(r))
      db.close()
      logger.info('查询单篇文章成功 <<')
    })
  })
})

// 新增文章
app.post('/add', urlencodedParser, function (req, res) {
  logger.info('>> 新增文章')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let myobj = {
      "title": req.body.title,
      "path": req.body.path,
      "date": req.body.date,
      "markdown": req.body.markdown,
      "flag": 0
    }
    dbo.collection("ulysses").insertOne(myobj, function (e, r) {
      if (e) throw e
      res.send('文章发布成功!')
      db.close()
      logger.info('新增文章成功 <<')
    })
  })
})

// 上传图片
app.post('/upload', function (req, res) {
  // 上传的文件信息
  logger.info('>> 上传图片')
  let des_file = __dirname + "\\public\\images\\" + req.files[0].originalname
  fs.readFile(req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        logger.error(err)
      } else {
        response = {
          message: '文件上传成功!',
          filename: req.files[0].originalname,
          path: "/images/" + req.files[0].originalname
        }
      }
      res.end(JSON.stringify(response))
      logger.info('上传图片成功 <<')
    })
  })
})

// 删除图片
app.get('/remove', function (req, res) {
  logger.info(">> 图片删除")
  let des_file = __dirname + "\\public\\images\\" + req.query.fileName
  fs.unlink(des_file, function(err) {
    if (err) {
      logger.error(err)
    }
    logger.info("图片删除成功 <<")
  })
})

// 删除文章
app.get('/del', function (req, res) {
  logger.info('>> 删除文章')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let whereStr = {
      "_id": ObjectId(req.query.id)
    }
    // 查询条件
    let updateStr = {
      $set: {
        "flag": 1
      }
    }
    dbo.collection("ulysses").updateOne(whereStr, updateStr, function (e, r) {
      if (e) throw e
      res.send(JSON.stringify(r))
      db.close()
      logger.info('删除文章成功 <<')
    })
  })
})

// 更新文章
app.post('/update', urlencodedParser, function (req, res) {
  logger.info('>> 更新文章')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let whereStr = {
      "_id": ObjectId(req.body.id)
    }
    // 查询条件
    let updateStr = {
      $set: {
        "title": req.body.title,
        "path": req.body.path,
        "date": req.body.date,
        "markdown": req.body.markdown
      }
    }
    dbo.collection("ulysses").updateOne(whereStr, updateStr, function (e, r) {
      if (e) throw e
      res.send(JSON.stringify(r))
      db.close()
      logger.info('更新文章成功 <<')
    })
  })
})

// 查询机柜数据
app.get('/cabinet', function (req, res) {
  logger.info('>> 查询机柜数据')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let whereStr = {}
    // 查询条件
    dbo.collection("cabinet").find(whereStr).toArray(function (e, r) {
      if (e) throw e
      res.send(JSON.stringify(r))
      db.close()
      logger.info('查询机柜数据成功 <<')
    })
  })
})

// 更新机柜信息
app.get('/updateCabinet', function (req, res) {
  logger.info('>> 更新机柜信息')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err
    let dbo = db.db("airbag")
    let whereStr = {
    }
    // 查询条件
    let updateStr = {
      $set: {
        "partSize": req.query.partSize,
        "describ": JSON.parse(req.query.describ),
        "equipInfo": JSON.parse(req.query.equipInfo)
      }
    }
    dbo.collection("cabinet").updateOne(whereStr, updateStr, function (e, r) {
      if (e) throw e
      res.send(JSON.stringify(r))
      db.close()
      logger.info('更新机柜信息成功 <<')
    })
  })
})



// 启动实例
let server = app.listen(8081, '0.0.0.0', function () {
  let host = server.address().address
  let port = server.address().port
  logger.info(":::::::::: START ::::::::::\n应用成功,访问地址为 http://%s:%s", host, port)
  console.log(":::::::::: START ::::::::::\n应用成功,访问地址为 http://%s:%s", host, port)
})