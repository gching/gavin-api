var express = require('express');
var router = express.Router();
var db = require('../config/DB');


/**
  #permittedParams
  Gets the permitted params for chapter
*/
var permittedParams = function permittedParams(raw_params){
  return {
    title: raw_params.title,
    body: raw_params.body,
    photo: raw_params.photo
  };
};

// [GET] /
// Returns the index of chapters
router.get('/', function(req, res, next) {
  var Chapter = db.getDB();


  Chapter.find(function(err, chapters){
    if (err){
      next(err);
    } else {
      res.send({chapters: chapters});
    }
  });
});

// [GET] /:id
// Find chapter by id.
router.get('/:id', function(req, res, next){
  var Chapter = db.getDB();

  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

    Chapter.findById(req.params.id, function(err, doc){

      if (err){
        return next(err);
      }
      
      res.send({chapter: doc});

    });
  } else {
    res.send('ID is not valid id');
  }

});

// [POST] /
// Creats a chapter
router.post("/", function(req, res, next){

  var Chapter = db.getDB();
  var chapter_params = permittedParams(req.body);

  // TODO - Pic to cloud

  // Create it
  Chapter.create(chapter_params, function(err, chapter){
    if (err){
      return next(err);
    }

    res.send({chapter: chapter});
  });

});

// [POST] /:id
// Updates a chapter
router.post("/:id", function(req,res,next){

  var Chapter = db.getDB();
  var chapter_params = permittedParams(req.body);

  Chapter.findByIdAndUpdate(req.params.id, chapter_params, function(err, doc){
    if (err){
      return next(err);
    }

    chapter_params._id = req.params.id;
    chapter_params.__v = doc.__v;
    res.send(chapter_params);
  });
});

/**
  [DELETE] /:id
*/
router.delete("/:id", function(req, res, next){

  var Chapter = db.getDB();

  Chapter.findByIdAndRemove(req.params.id, function(err, doc){
    if (err){
      next(err);
      return res.send({
        msg: "failure"
      });
    }

    res.send({
      msg: (doc) ? "success" : "failure"
    });
  });
});


module.exports = router;
