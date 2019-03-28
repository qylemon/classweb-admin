var express = require('express');
var router = express.Router();
var handler = require('./dbhandler.js');
var ObjectId = require('mongodb').ObjectId;

router.post('/StudentList',function(req,res,next){
    req.route.path = "/page";
    var page = req.body.page || 1;
    var rows = req.body.rows || 5;
    handler(req,res,"student",[{},{limit: rows, skip:(page-1)*rows}],function(data,count){
        var obj = {
            data:data,
            total:count,
            success:"成功"
        };
        var str = JSON.stringify(obj);
        res.end(str);
    });
});

router.post('/add',function(req,res,next){
    handler(req,res,"student",req.body,function(data){
        if(data.length == 0){
            res.end('{"err":"抱歉，添加失败"}');
        }else{
            res.end('{"success":"添加成功"}');
        }
    });
});

router.post('/update',function(req,res,next){

    var selectors = [
        {"_id":ObjectId(req.body._id)},
        {"$set":{
                name:req.body.name,
                age:req.body.age,
                gender:req.body.gender,
                course:req.body.course,
            }
        }
    ];

    handler(req,res,"student",selectors,function(data){
        if(data.length == 0){
            res.end('{"err":"抱歉，添加失败"}');
        }else{
            res.end('{"success":"添加成功"}');
        }
    });
});

router.post('/delete',function(req,res,next){
    handler(req,res,"student",{"_id":ObjectId(req.body._id)},function(data){
        if(data.length == 0){
            res.end('{"err":"抱歉，删除失败"}');
        }else{
            var obj= {
                success:"删除成功"
            }
            var str = JSON.stringify(obj);
            res.end(str);
        }
    });
});

module.exports = router;