const express = require('express') // เรียกใช้ Express
const mysql = require('mysql') // เรียกใช้ mysql
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');



const db = mysql.createConnection({
host     : 'localhost', 
user     : 'root',
password : 'root',
database : 'wallet'
})

db.connect() 
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login',(req,res)=> {
    let sql = `SELECT * FROM users WHERE email=?`  
    let query = db.query(sql,[req.body.email],(err,results) => { 
        if(results.length == 0){
            var response = {
                'res_code': '101',
                'res_desc': 'Email not found.',
            }
            res.json(response) 
        }
        else{
            var response = {
                'res_code': '0000',
                'res_desc': '',
                'email': results[0].email,
                'pin': results[0].pin,
                'amount': results[0].amount
            }
            res.json(response)
        }
    })
})

app.post('/loginSuccess',(req,res)=> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tour.nodemailer@gmail.com', // your email
          pass: 'testnodemailer1' // your email password
        }
    });
    let mailOptions = {
        from: 'sender@hotmail.com',                // sender
        to: req.body.email,                // list of receivers
        subject: 'You login digio',              // Mail subject
        html: '<b>Now you login digio</b>'   // HTML body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err){
          console.log(err)
          var response = {
            'res_code': '103',
            'res_desc': err,
          }
          res.json(response)
        }
        else
          console.log(info)
          var response = {
            'res_code': '0000'
          }
        res.json(response)
     });
})

app.post('/register',(req,res)=> {
    let sql1 = `SELECT * FROM users WHERE email=?`
    let query = db.query(sql1,[req.body.email],(err,results) => { 
        if(results.length == 0){
            let sql2 = `INSERT INTO users (email, pin) VALUES (?, ?)`;
            db.query(sql2,[req.body.email, req.body.pin], function (err, result) {
              if (err) throw err;
              console.log(req.body)
              var response = {
                'res_code': '0000',
                'res_desc': '',
                'email': req.body.email,
                'pin': req.body.pin,
              }
              res.json(response)
            }); 
        }
        else{
            var response = {
                'res_code': '102',
                'res_desc': 'Email has already been used.',
              }
            res.json(response)
        }
    })

   
})

app.post('/check',(req,res)=> {
    let sql1 = `SELECT * FROM users WHERE email=?`
    let query = db.query(sql1,[req.body.email],(err,results) => { 
        if(results.length == 0){
              console.log(req.body)
              var response = {
                'res_code': '0000',
                'res_desc': '',
                'email': req.body.email,
                'pin': req.body.pin,
              }
              res.json(response)
        }
        else{
            var response = {
                'res_code': '102',
                'res_desc': 'Email has already been used.',
              }
            res.json(response)
        }
    })

   
})

app.listen('3000',() => {     // 
console.log('start port 3000')  
})