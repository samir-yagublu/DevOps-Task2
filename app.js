const session = require('express-session')

const express = require('express');
const bcrypt = require('bcryptjs');
const ejs = require('ejs');
const {body, validationResult} = require('express-validator'); 
const bodyparser = require('body-parser');
const db = require('./db.js');
const app = express();
app.set('view engine','ejs')
app.use(bodyparser.urlencoded({extended:false}));


app.use(
    session({
        secret: 'WEBPROJECT', 
        name: 'uniqueSessionID', 
        saveUninitialized: false,
        resave: false
    })
)


let sql = 'CREATE TABLE books( id  INT PRIMARY KEY NOT NULL AUTO_INCREMENT , book_name VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, price DOUBLE NOT NULL, user_id INT NOT NULL);';
console.log('worked')
app.use(express.static(__dirname + '/public'));

app.get('/registration',(req,res)=>{
    res.render('registration',{errors:null, message:null});
})

app.get('/login',(req,res)=>{
    if(req.session.isLogged ==true){
        res.redirect('/logout');
    }
    res.render('login',{errors:null});
})

app.get('/',(req,res)=>{
    res.redirect('login');
})

app.post('/login', (req, res) => {
    let sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [req.body.email], (err, result) => { // Pass an array of values
      if (result.length) {
        bcrypt.compare(req.body.password, result[0].password).then(re => {
          if (re == true) {
            req.session.isLogged = true;
            req.session.name = result[0].id;
            console.log(req.session);
            res.status(200).redirect('index');
          } else {
            res.status(500).render('login', { errors: "Password is not correct" });
          }
        });
      } else {
        res.render('login', { errors: 'Email address is not correct' });
      }
    });
  });
app.get('/logout',(req,res)=>{
    req.session.destroy(err=>{});
    res.redirect('login');
})  

app.post('/registration',

body('name').trim().isLength({min:3}).withMessage("Name should be minimum 3 character"),
body('email').trim().isEmail().withMessage('It is not email.'),
body('password').isLength({min:8}).withMessage("Password should be minimum 8 characters").matches('[0-9]').withMessage('Password should contain numbers'),
(req,res)=>{
    
    const errors = validationResult(req);
    
    let hashedpassword = "";
    bcrypt.hash(req.body.password,10).then(ress=>{hashedpassword = ress;
    if(!errors.isEmpty()){
        res.status(501).render('registration',{errors:errors.array(), message:""});
       
    }
    else{
        let sql = 'INSERT INTO users (name,email,password) VALUES (?,?,?)';
    db.query(sql,[req.body.name,req.body.email,hashedpassword],(err,result)=> {
        if(err) {throw err;}
       // res.render('registration',{message:"Account created", errors:null});
        return res.status(200).redirect('login');
    })
        }
    });
    
    })




app.get('/index',(req,res)=>{
    if(req.session == null){
        res.redirect('login');

    }
    else{
    db.query("SELECT * FROM books WHERE user_id = ?",req.session.name,(err,result)=> {
        if(err) throw err;
        res.render('index',{results:result});
    });
    }
})

app.post('/insert',(req,res)=>{

    const data = [req.body.book_name,req.body.author,req.body.price,req.session.name];
    console.log(req.session)
    let sql = "INSERT INTO books (book_name,author,price,user_id) VALUES (?,?,?,?)";
    db.query(sql,data,(err,result)=>{
        if(err) throw err;
    });
    res.redirect('index');

})


app.post('/delete',(req,res)=>{
    let sql = "DELETE FROM books WHERE id = ?";
    db.query(sql,req.body.id,(err,result)=>{
        if(err) throw err;
        console.log(result);
    });
    res.redirect('index');
})

app.get('/edit',(req,res)=>{
    res.render('edit',{book:null})

})

app.post('/edit',(req,res)=>{
    let sql = "SELECT * FROM books WHERE id = ?";
    db.query(sql,req.body.id,(err,result)=>{
        res.render('edit',{book:result});
    });

}  );

app.post('/s_edit',(req,res)=>{
    console.log(req.body.id);
    let sql = 'UPDATE books SET book_name = ? , author = ? , price = ? WHERE id = ?';
    const data = [req.body.book_name,req.body.author,req.body.price,req.body.id];
    db.query(sql,data,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.redirect('index');
    });
})

app.listen(3000);

module.exports = app;