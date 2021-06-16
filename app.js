const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const multer  = require('multer');
const alert = require('alert');
const dialog = require('dialog');
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/formDataDB", { useNewUrlParser: true });

const Storage = multer.diskStorage({
  destination:  function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({ storage: Storage });
var type = upload.single("file");

// creating schema
const dataSchema = {

  firstName: String,
  lastName:String,
  Contact: String,
  Address:String,
  Email:String,
  Password:String,
  Gender:String,
  Image:String,
}

const Data = new mongoose.model("Data", dataSchema)

mongoose.set('useFindAndModify', false);


/////////////////////////////////////////////////// getting home route

app.get("/", upload.single("file"), function(req,res){
       res.sendFile(__dirname + "/index.html");
})

const reviewData = [];
const found = [] ;

//////////////////////////////////////////////////////////////////collecting form data

app.post('/' , upload.single("file"), function (req, res, next) {
  reviewData.splice(0,1);
  found.splice(0,2);
  const file = req.file;
   const gender = req.body.gender;
   const  fName = req.body.firstName;
   const lName = req.body.lastName;
   const contact = req.body.contact;
   const address = req.body.address;
   const email = req.body.email;
   const password = req.body.password;

   Data.find({Email : email}, function(err, foundedData){
     if(foundedData.length == 0){
       reviewData.push({File:file, Gender:gender, fName:fName, lName:lName, contact:contact, address:address, email:email, password:password});
       console.log("reviewData" , reviewData);
       // saving to db
         const data = new Data({
          firstName : fName,
          lastName : lName,
          Contact : contact,
          Address : address,
          Email : email,
          Password : password,
          Gender:gender,
        Image : file.filename,
         })

         data.save();

        if (res.statusCode===200){
          res.sendFile(__dirname + "/success.html")
        } else{
          res.sendFile(__dirname + "/failure.html")
        }

        found.push(email, password);
     }
     else{
         res.sendFile(__dirname + "/already-registered.html")

     }
   })
})

////////////////////////////////////////////////////////

app.get("/review", function(req,res){
  res.render("review", {entries : reviewData});
  // reviewData.splice(0,1);
  console.log(reviewData);

})

/////////////////////////////////////////////////////////

app.get("/form-update", upload.single("file"), function(req, res){

  Data.find({Email : found[0], Password : found[1]}, function(err, foundedData){
    if(err){
      console.log(err)
    }
    else{
        res.render("formUpdate", {datas:foundedData});
        console.log(foundedData)

    }
  })

})

///////////////////////////////////

app.post("/form-update", upload.single("file"), function(req,res){
reviewData.splice(0,1);
   const file = req.file;
   const gender = req.body.gender;
   const  fName = req.body.firstName;
   const lName = req.body.lastName;
   const contact = req.body.contact;
   const address = req.body.address;
   const email = req.body.email;
   const password = req.body.password;

if(email == found[0]){
    reviewData.push({ File:file, Gender:gender, fName:fName, lName:lName, contact:contact, address:address, email:email, password:password});

    console.log(found[0], found[1]);

    Data.findOneAndUpdate({Email:found[0], Password:found[1]}, {$set:{
        firstName : fName,
        lastName : lName,
        Contact : contact,
        Address : address,
        Email : email,
        Password : password,
        Gender : gender,
        Image:file.filename,
      }},
      { new: true }, function(err,doc){
        if(err){
         console.log("Something wrong when updating data!");
     }else{
         console.log("updated", doc);
     }
    })
     if (res.statusCode===200){
       res.sendFile(__dirname + "/confirm.html")
     } else{
       res.sendFile(__dirname + "/failure.html")
     }
    found.splice(0,2);
}
else{
  Data.find({Email : email}, function(err, foundedData){
    if (foundedData.length==0){
      reviewData.push({File : file, Gender:gender, fName:fName, lName:lName, contact:contact, address:address, email:email, password:password});

      console.log(found[0], found[1]);

      Data.findOneAndUpdate({Email:found[0], Password:found[1]}, {$set:{
          firstName : fName,
          lastName : lName,
          Contact : contact,
          Address : address,
          Email : email,
          Password : password,
          Gender : gender,
           Image:file.filename,
        }},
        { new: true }, function(err,doc){
          if(err){
           console.log("Something wrong when updating data!");
       }else{
           console.log("updated", doc);
       }
      })
       if (res.statusCode===200){
         res.sendFile(__dirname + "/confirm.html")
       } else{
         res.sendFile(__dirname + "/failure.html")
       }
      // found.splice(0,2);
    }else{
      res.sendFile(__dirname + "/update-registered.html")
    }
  })
}
  })

///////////////////////////////////////////////

app.get("/signin" , function(req,res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/signin", function(req,res){

  const email = req.body.email;
  const password = req.body.password;

  Data.find({Email : email, Password: password},function(err, foundedData){
    if(foundedData.length == 0){
      // alert("Incorrect username or password!");
      dialog.warn('Incorrect username or password!');

      // res.redirect("/signin");
    }else{
      found.splice(0,2);
      found.push(email, password);
      res.redirect("/form-update");
    }
  })
})

//////////////////////////////////////////////////////////

app.post("/success", function(req,res){
 res.redirect("/form-update");
})

///////////////////////////////////////////

app.post("/failure", function(req,res){
  res.redirect("/")
})

//////////////////////////////////////////////

app.post("/already-registerd", function(req,res){
  res.redirect("/")
})

////////////////////////////////////////////////

app.post("/update-registered", function(req,res){
  res.redirect("/form-update")
})

///////////////////////////////////////////////

app.post("/reviewEntries", function(req, res){
  if(reviewData.length != 0){
      res.redirect("/review")
  }
  else{
    res.sendFile(__dirname + "/failure.html")
  }

})

///////////////////////////////////////////////////

app.get("/confirm", function(req, res){
  res.sendFile(__dirname + "/confirm.html")
})

////////////////////////////////////////////////////

app.post("/confirm", function(req,res){
  res.redirect("/confirm")
})

///////////////////////////////////////////////////

app.listen(3000, function(){
  console.log("Server at port 3000")
})
