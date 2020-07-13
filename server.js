const express =require('express');
const bodyParser = require('body-parser');
const cookieSession=require('cookie-session');
const db=require('./services/db');

const port=process.env.PORT || 3000;

const app = express();
app.set('views','./views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));


app.use(cookieSession({
    name: 'session',
    keys: ['12345'],
    maxAge: 24*60*60*1000, 
}));

//Midldeware
app.use(require('./middlewares/auth'));

//Routes
app.use(express.static('public'));
app.get('/',require('./routes/index'));
app.post('/',require('./routes/index'));
app.use('/login',require('./routes/login'));
app.use('/register',require('./routes/register'));
app.use('/employee',require('./routes/employee/employee'));
app.use('/activity',require('./routes/employee/activity'));
app.use('/user',require('./routes/user/index'));

app.post('/login', require('./routes/login'));
app.post('/employee', require('./routes/employee/employee'));
app.post('/register', require('./routes/register'));

db.sync().then(function(){
    app.listen(port);
    console.log(`Server is listening on ${port}`);
}).catch(function(err){
    console.error(err);
});