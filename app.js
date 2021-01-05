var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://pkounelios:manosgret2009@cluster0.kqbfx.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
client.connect().then(function(){
    console.log("connected to Mongo");
}).catch(e=>console.log(e));
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const cors = require('cors');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/vouchers', async (req,res)=>{
    const collection = client.db("demo").collection("vouchers");
    let data = await collection.find({}).toArray();
    res.json(data)
});

app.post('/store-voucher' , (req,res,next)=>{
    console.log(req.body);
    const collection = client.db("demo").collection("vouchers");
    collection.insertOne(req.body).then(function(id){
        res.json({message:"created voucher:"+id.insertedId});
    }).catch(e=>{
        res.json({error:e.error});
    })
});



module.exports = app;
