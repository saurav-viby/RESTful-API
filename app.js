const express = require('express');
const bodyparser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const params=require('params');

const app = express();

app.set("view engine", 'ejs');

app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");


articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article", articleSchema);

// GETTING ALL ARTICLES.............


app.route("/articles")
.get(function(req, res) {
  Article.find({}, function(err, foundarticles) {
    if (!err) {
      res.send(foundarticles);
    } else {
      res.send(err);
    }
  })
})
.post(function(req, res) {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Addded")
    }else{
      res.send(err)
    }
  });
})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Deleted All")
    }else{
      res.send(err)
    }
  })
});


// GETTING SPECIFIC ARTICLES.............


app.route("/articles/:articleTitle")
.get(function(req, res){

  const titles=req.params.articleTitle;
Article.findOne({title:titles},function(err,foundarticles){

if(foundarticles){

res.send(foundarticles);

}else{
  res.send("Not found specific title")
}

});
})
.put(function(req, res){
// insted of using update use replaceOne becouse update is outdated , only use if using overwrite is true
  Article.replaceOne(
    {title:req.params.articleTitle},

    {title:req.body.title,content:req.body.content},

    {overwrite:true},

    function(err){
      if(!err){
        res.send("Successfully Updated")
      }else{
        console.log(err);
      }

    }

  );

})
.patch(function(req, res){
  Article.updateOne(
    {title:req.params.articleTitle},

    {$set:req.body},

    function(err){
      if(!err){
        res.send("updated")
      }

    else{
      res.send(err)
    }
  }

    );

})
.delete(function(req, res){

  Article.deleteMany(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("deleted")
      }else{
        res.send(err)
      }

    }
    

  )


});








app.listen(3000, function() {
  console.log("server UP");

});
