/*****************************************************************************
  EXPORT SET UP FOR HOUSES.JS
*****************************************************************************/
module.exports = function(){
    var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var methodOverride = require("method-override");

/*****************************************************************************
    HELPER QUERY FUNCTIONS
*****************************************************************************/
  function getProfessors(res, mysql, context, complete){
    mysql.pool.query('SELECT Professors.id AS id, Professors.fname, Professors.lname, Houses.name AS house FROM Professors LEFT JOIN Houses ON Houses.id = Professors.house',
    function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.end();
      }
      context.professors = results;
      complete();
  });
  }

  function getProfessor(res, mysql, context, req, complete){
    mysql.pool.query('SELECT Professors.id AS id, Professors.fname, Professors.lname, Houses.name AS name FROM Professors LEFT JOIN Houses ON Houses.id = Professors.house WHERE Professors.id =' +req.params.id,
    function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.end();
      }
      context.professor = results[0];
      complete();
  });
  }

	function getHouses(res, mysql, context, complete){
	    mysql.pool.query('SELECT Houses.id AS id, Houses.name AS name FROM Houses', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.houses = results;
	        complete();
	    });
	}

  /*****************************************************************************
    DISPLAY ALL PROFESSORS
  *****************************************************************************/
	router.get('/',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getProfessors(res, mysql, context, complete)
		getHouses(res, mysql, context, complete)
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('professors', context);
            }
		}
	});

  /*****************************************************************************
    DISPLAY ONE PROF (for UPDATE only)
  *****************************************************************************/
	router.get('/:id',function(req,res){
		var context = {};
		callbackCount = 0;
		// context.jsscripts = ["selectedhouse.js", "updatestudent.js"];

		var mysql = req.app.get('mysql');
		getProfessor(res, mysql, context, req, complete)
		getHouses(res, mysql, context, complete)
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-professor', context);
            }
		}
	});

  /*****************************************************************************
    INSERT PROF
  *****************************************************************************/
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Professors (fname, lname, house) VALUES (?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.house];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/professors');
            }
        });
	});

  /*****************************************************************************
    UPDATE PROF
  *****************************************************************************/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Professors SET fname=?, lname=?, house=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.house, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
				res.redirect('/professors');
            }
        });
	});

  /*****************************************************************************
    DELETE PROF
  *****************************************************************************/

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Professors WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.redirect('/professors');
            }
        })
	});

	return router;
}();