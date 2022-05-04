const express = require('express')
const app = express()
const bp = require("body-parser")
const mongoose = require("mongoose")
const port = 3000
const ejs = require("ejs")
app.use(bp.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb+srv://harsh:harsh123@cluster0.p3xhf.mongodb.net/SdeSheet?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const questionSchema=new mongoose.Schema({
  id:String,
  description:String,
  topic:String,
  url:String,
  isDone:Boolean,
  isReview:Boolean
})
const userSchema=new mongoose.Schema({
  name:String,
  password:String,
  questionArray:[questionSchema]
})



const User=mongoose.model("User",userSchema);





app.get('/', (req, res) => {
  res.render("authorisation");
})

let user_name
let user_password
const mainArray=[];
app.post("/", (req, res) => {
  user_name = req.body.name;
  user_password=req.body.password;



  User.findOne({name:user_name,password:user_password},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        console.log("user presennt")
      // console.log(foundUser);
      // mainArray=foundUser.questionArray
      for(let i=0;i<(foundUser.questionArray).length;i++){
        mainArray[i]=foundUser.questionArray[i];
      }
      // console.log("1"+mainArray);
      }

      else{
        const NewUser= new User({
          name:user_name,
          password:user_password,
          questionArray:questionArray
        })
        for(let i=0;i<(questionArray).length;i++){
          mainArray[i]=questionArray[i];
        }
        // console.log(mainArray);
     NewUser.save(function(err,res){
       if(err){
         console.log(err);
       }
       else{
         console.log("inserted succesfully")
        //  console.log(res);
       }
     });
    }
      
    }
  });
  res.redirect("/mainPage");
  // find the array corresponding to that name
  // lets say array
})

app.get("/mainPage", (req, res) => {
  let proper_name;
  proper_name=user_name[0].toUpperCase() + user_name.slice(1);

  res.render("mainPage", { name: proper_name })

})
let topic
app.post("/mainPage", (req, res) => {
  topic = req.body.topic
  console.log(topic)
  res.redirect("/questionList/" + topic);

})
const questionArray = [
  {
    id: "0",
    description: "Reverse The Array",
    topic: "Array",
    url: "https://leetcode.com/problems/reverse-string/",
    isDone: false,
    isReview: false
  },

  {
    id: '1',
    description: "Check whether a String is Palindrome or not",
    topic: "String",
    url: "https://practice.geeksforgeeks.org/problems/palindrome-string0817/1",
    isDone: false,
    isReview: false
  },
  {
    id: '2',
    description: "Create a Graph, print it",
    topic: "Graph",
    url: "https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",
    isDone: false,
    isReview: false
  },
  {
    id: '3',
    description: "math1",
    topic: "Math",
    url: "https://www.google.com",
    isDone: false,
    isReview: false
  },
  {
    id: '4',
    description: "graph1",
    topic: "Graph",
    url: "https://www.google.com",
    isDone: false,
    isReview: false
  },
  {
    id: '5',
    description: "string 7",
    topic: "String",
    url: "https://www.google.com",
    isDone: false,
    isReview: false
  },
  {
    id: '6',
    description: "Check whether a String is Palindrome or not",
    topic: "String",
    url: "https://practice.geeksforgeeks.org/problems/palindrome-string0817/1",
    isDone: false,
    isReview: false
  },
  {
    id: '7',
    description: "Check whether a String is Palindrome or not",
    topic: "String",
    url: "https://practice.geeksforgeeks.org/problems/palindrome-string0817/1",
    isDone: false,
    isReview: false
  },
  {
    id: '8',
    description: "Check whether a String is Palindrome or not",
    topic: "String",
    url: "https://practice.geeksforgeeks.org/problems/palindrome-string0817/1",
    isDone: false,
    isReview: false
  },

];

// console.log(questionArray.length)
app.get("/questionList/:topic", (req, res) => {
  res.render("questionList", { array: mainArray, topic: topic })
})
let type;
app.post("/questionList/:topic", (req, res) => {
  type = req.body.type;
  console.log(type);
  if(type[0]==="#"){  // review
  for(let i=0;i<mainArray.length;i++){
   if(mainArray[i].id === type.substring(1,type.length)){
    mainArray[i].isReview=(!mainArray[i].isReview)
    break ;
   }
  }
}
else{  // done
  for(let i=0;i<questionArray.length;i++){
    if(mainArray[i].id === type){
      mainArray[i].isDone=(!mainArray[i].isDone)
      break ;
    }
  }
}

  
  User.findOne({name:user_name,passsword:user_password},function(err,foundUser){
    foundUser.questionArray =mainArray
    foundUser.save();
  })
  User.findOne({name:user_name,password:user_password},function(err,res){
    console.log(res.questionArray)
  })


  // console.log(mainArray)
  res.redirect("/questionList/"+topic);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
