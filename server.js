const app = require('express')()
const bodyParser = require('body-parser')
const multer = require('multer')()
const fs = require("fs");
const { runInNewContext } = require('vm');

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.get('/listUsers', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      res.contentType('json');
      res.send( data );
    });
 })
 
 app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var errorMessage = JSON.stringify({'error':'Invalid id!!'});
      
      var user = users.filter(user => user.id===Number(req.params.id))[0];

      res.contentType('json');
      res.end( user?JSON.stringify(user):errorMessage);
   });
})

app.post('/addUser', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      var payLoad = req.body;

      payLoad.id = Number(data[data.length-1].id) + 1;
      
      data.push(payLoad)

      fs.writeFile(__dirname + "/" + "users.json",JSON.stringify(data),()=>{
         res.contentType('json')
         res.end( JSON.stringify(data))
      });
   });
})

 var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })

 