module.exports = function(){
    var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var methodOverride = require("method-override");

	function getProfessors(res, mysql, context, complete){
	    mysql.pool.query('SELECT Professors.id AS id, Professors.fname, Professors.lname, Professors.house FROM Professors', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.professors = results;
	        complete();
	        
	    });
	}

	function getClassStudents(res, mysql, context, req, complete){
	    mysql.pool.query('SELECT Classes.id, Classes.name, Students.fname, Students.lname FROM Enrolled INNER JOIN Students ON Enrolled.sid = Students.id INNER JOIN Classes ON Enrolled.cid = Classes.id WHERE Classes.id =' +req.params.id, function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.students = results;
	        console.log(context)
	        complete();
	        
	    });
	}

	function getStudents(res, mysql, context, complete){
	    mysql.pool.query('SELECT Students.id AS id, Students.fname, Students.lname FROM Students', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.students = results;
	        complete();
	        
	    });
	}
	function getClasses(res, mysql, context, complete){
	    mysql.pool.query('SELECT Classes.id, Classes.name, Professors.fname AS teacherfname, Professors.lname AS teacherlname FROM Classes LEFT JOIN Professors ON Professors.id = Classes.teacher', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.classes = results;
	        complete();
	    });
	}

	function getClass(res, mysql, context, req, complete){
	    mysql.pool.query('SELECT Classes.id, Classes.name, Professors.fname AS teacherfname, Professors.lname AS teacherlname FROM Classes INNER JOIN Professors ON Professors.id = Classes.teacher WHERE Classes.id =' +req.params.id, function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.class = results[0];
	        complete();
	    });
	}

	router.get('/',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		//getStudents(res, mysql, context, complete)
		getClasses(res, mysql, context, complete);
		getProfessors(res, mysql, context, complete);
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
            	console.log(context);
                res.render('classes', context);
            }
		}
	});

	router.get('/:id',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getClass(res, mysql, context, req, complete);
		getProfessors(res, mysql, context, complete);
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
            	console.log(context);
                res.render('update-class', context);
            }
		}
	});

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Classes (name, teacher) VALUES (?,?)";
        var inserts = [req.body.name, req.body.teacher];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/classes');
            }
        });
	});

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Classes SET name=?, teacher=? WHERE id=?";
        var inserts = [req.body.name, req.body.teacher, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
				res.redirect('/classes');
            }
        });
	});

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Classes WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.redirect('/classes');
            }
        })
	});
	
	return router;
}();
