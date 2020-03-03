const bodyParser = require("body-parser"),
  express = require("express"),
  querystring = require("querystring"),
  app = express();

app.set("port", process.env.PORT || 8080);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var dataBase = {
  79059847682: {
    name: "Сергей Германов",
    bonus: 1000,
    money: 1000,
    bonusIndex: 5,
    percent: 10
  },
  79039109829: {
    name: "Алексей Германов",
    bonus: 3000,
    money: 1000,
    bonusIndex: 10,
    percent: 25
  }
};

var phNumber;
var idPhone;
var data;
var message;

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/", function(req, res) {
  phNumber = req.body.telNo;
  idPhone = phNumber.replace(/[^\d.]/g, "");

  if (dataBase[idPhone]) {
    data = dataBase[idPhone];
  } else {
  }
  res.redirect("/client");
});

app.get("/client", function(req, res) {
  if (phNumber && data) {
    res.render("client", { phNumber: phNumber, data: data, message: message });
  } else {
    res.redirect("/");
  }
});

app.post("/client", function(req, res) {
  dataBase[idPhone].bonusIndex = Number(req.body.bonusIndex);
  dataBase[idPhone].percent = Number(req.body.percent);
  var bonus = Number(req.body.bonus) / dataBase[idPhone].bonusIndex;
  var percent = (Number(req.body.bonus) * Number(req.body.percent)) / 100;
  var bonusPercent = dataBase[idPhone].bonus - Math.round(percent);

  if (req.body.action === "deposit") {
    // message = {};
    dataBase[idPhone].bonus += Math.round(bonus);
    dataBase[idPhone].money += Number(req.body.bonus);
    message = {
      fullPay: req.body.bonus,
      bonus: Math.round(bonus),
      action: "deposit"
    };
  } else {
    if (bonusPercent < 0) {
      dataBase[idPhone].money += Math.abs(bonusPercent);
      message = {
        fullPay: req.body.bonus,
        bonus: dataBase[idPhone].bonus,
        pay: req.body.bonus - dataBase[idPhone].bonus,
        action: "withdraw"
      };
      dataBase[idPhone].bonus = 0;
    } else {
      dataBase[idPhone].bonus -= Math.round(percent);
      dataBase[idPhone].money += Number(req.body.bonus) - Math.round(percent);
      message = {
        fullPay: req.body.bonus,
        bonus: Math.round(percent),
        pay: Number(req.body.bonus) - Math.round(percent),
        action: "withdraw"
      };
    }
  }

  res.redirect("/client");
});

app.get("/create", function(req, res) {
  res.render("create");
});

app.post("/create", function(req, res) {
  idPhone = req.body.telNo.replace(/[^\d.]/g, "");
  delete req.body.telNo;

  var bonus = Number(req.body.bonus) / Number(req.body.bonusIndex);

  dataBase[idPhone] = req.body;
  dataBase[idPhone].money = Number(req.body.bonus);
  dataBase[idPhone].bonusIndex = Number(req.body.bonusIndex);
  dataBase[idPhone].percent = Number(req.body.percent);
  dataBase[idPhone].bonus = bonus;

  if (dataBase[idPhone]) {
    res.redirect("/");
  } else {
    res.redirect("/create");
  }
});

app.listen(app.get("port"), function() {
  console.log("Express started on http://localhost:" + app.get("port"));
});
