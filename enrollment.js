module.exports = function(){
    var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var methodOverride = require("method-override");

	function getStudent(res, mysql, context, req, complete){
	    mysql.pool.query('SELECT Students.id, Students.fname, Students.lname FROM Students WHERE Students.id =' +req.params.id, function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.student = results[0];
	        complete();
	    });
	}

	function getStudents(res, mysql, context, complete){
	    mysql.pool.query('SELECT Students.id, Students.fname, Students.lname FROM Students', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.students = results;
	        complete();
	    });
	}

	function getClassStudents(res, mysql, context, req, complete){
	    mysql.pool.query('SELECT Enrolled.id AS id, Students.id AS sid, Students.fname, Students.lname FROM Enrolled INNER JOIN Classes ON Enrolled.cid = Classes.id INNER JOIN Students ON Enrolled.sid = Students.id WHERE Classes.id =' +req.params.id, function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.students = results;
	        complete();
	        
	    });
	}

	function getStudentClasses(res, mysql, context, req, complete){
	    mysql.pool.query('SELECT Enrolled.id AS id, Classes.id AS cid, Classes.name FROM Enrolled INNER JOIN Classes ON Enrolled.cid = Classes.id INNER JOIN Students ON Enrolled.sid = Students.id WHERE Students.id =' +req.params.id, function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.classes = results;
	        complete();
	    });
	}

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

	function getClasses(res, mysql, context, complete){
	    mysql.pool.query('SELECT Classes.id, Classes.name FROM Classes', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.classes = results;
	        complete();
	    });
	}

	function getClass(res, mysql, context, req, complete){
	    mysql.pool.query('SELECT Classes.id, Classes.name FROM Classes WHERE Classes.id =' +req.params.id, function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.class = results[0];
	        complete();
	    });
	}

/*****************************************************************************
  Routes for Enrollment
*****************************************************************************/

	router.get('/',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getClasses(res, mysql, context, complete);
		getStudents(res, mysql, context, complete);
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
            	console.log(context);
                res.render('enrollment', context);
            }
		}
	});

	router.get('/class/:id',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getClass(res, mysql, context, req, complete);
		getClassStudents(res, mysql, context, req, complete);
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
            	console.log(context);
                res.render('edit-class', context);
            }
		}
	});

	router.get('/student/:id',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getStudent(res, mysql, context, req, complete);
		getStudentClasses(res, mysql, context, req, complete);
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
            	console.log(context);
                res.render('edit-student', context);
            }
		}
	});

	router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Enrolled (sid, cid) VALUES (?,?)";
        var inserts = [req.body.sid, req.body.cid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('enrollment');
            }
        });
	});

    router.delete('/class/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Enrolled WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.redirect('/enrollment');
            }
        })
	});


    router.delete('/student/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Enrolled WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.redirect('/enrollment');
            }
        })
	});

	return router;
}();