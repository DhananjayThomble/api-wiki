require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT;

// ---------------------------------------db-----------------------------------------
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));

async function main() {
  mongoose.connect(process.env.DB_URL);
}

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});
const ArticleModel = mongoose.model("article", articleSchema);
// ---------------------------------------db-----------------------------------------

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/articles") //           /articles route

  .get((req, res) => {
    const articleArray = [];
    ArticleModel.find((err, results) => {
      for (let article of results) {
        articleArray.push({
          title: article.title,
          content: article.content,
        });
      }
      res.json(articleArray);
    });
  })

  .get((req, res) => {
    console.log("");
  })

  .post((req, res) => {
    const article = {
      title: req.body.title,
      content: req.body.content,
    };
    const articleCollection = new ArticleModel(article);
    articleCollection.save();
    res.send("saved");
  })

  .delete((req, res) => {
    ArticleModel.deleteMany((err) => {
      if (err) console.error(err);
      else res.send("Articles deleted!");
    });
  });

app
  .route("/articles/:title") //        /articles/{any title name}

  .get((req, res) => {
    const title = req.params.title;
    ArticleModel.find({ title: title }, (err, results) => {
      if (err) console.error(err);
      else {
        const articleArray = [];
        for (let article of results) {
          articleArray.push({
            title: article.title,
            content: article.content,
          });
        }
        res.json(articleArray);
      }
    });
  })

  .put((req, res) => {
    ArticleModel.updateOne(
      { title: req.params.title },
      { title: req.body.title },
      function (err) {
        if (err) {
          console.error(err);
        } else console.log("updated");
      }
    );
    res.send("updated");
  })

  .patch((req, res) => {
    ArticleModel.updateOne(
      { title: req.params.title },
      { $set: req.body },
      (err) => {
        if (err) console.error(err);
        else res.send("updated");
      }
    );
  })

  .delete((req, res) => {
    ArticleModel.deleteOne({ title: req.params.title }, (err) => {
      if (err) console.error(err);
      else res.send("Deleted!");
    });
  });

app.listen(PORT, (req, res) => {
  console.log(`Server started at ${PORT}`);
});
