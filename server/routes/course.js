var express = require('express');
var router = express.Router();
var handler = require('./dbhandler.js');  //封装handler
var ObjectId = require('mongodb').ObjectId; //_id转化

//课程列表
router.post('/CourseList', function(req, res, next) {
    //console.log(req.body);
    req.route.path = "/page"; //修改path来设定 对 数据库的操作
    var page = req.body.page || 1;
    var rows = req.body.rows || 5;
    handler(req, res, "course", [{},{limit: rows, skip:(page-1)*rows}] ,function(data,count){
        var obj = {
          data:data,
          total:count,
          success:"成功"
        };
        var str = JSON.stringify(obj);
        res.end(str);
    });
  });
  
  
  //添加管理员
  router.post('/add', function(req, res, next) {
    //console.log(req.body);
    handler(req, res, "course", req.body,function(data){
        
        //console.log(data);
        if(data.length==0){
            res.end('{"err":"抱歉，添加失败"}');
        }else{
            res.end('{"success":"添加成功"}');
        }
    });
  });
  
  
  //删除用户
  router.post('/delete', function(req, res, next) {
    
    handler(req, res, "course", {"_id" : ObjectId(req.body._id)},function(data){
        
        console.log(data);
        if(data.length==0){
            res.end('{"err":"抱歉，删除失败"}');
        }else{
            var obj = {
              success:"删除成功"
            };
            var str = JSON.stringify(obj);
            res.end(str);
        }
        
    });
  });
  
  
  //编辑更新用户
  router.post('/update', function(req, res, next) {
    //console.log(req.body);
    
    var selectors = [
        {"_id":ObjectId(req.body._id)},
        {"$set":{
                courseName:req.body.courseName, //用户名称
            }
        }
    ];
    handler(req, res, "course", selectors,function(data){
        
        //console.log(data);
        if(data.length==0){
            res.end('{"err":"抱歉，修改失败"}');
        }else{
            res.end('{"success":"修改成功"}');
        }
        
    });
    
  });
  
  module.exports = router;
  