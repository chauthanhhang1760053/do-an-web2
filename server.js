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



app.use(express.static('public'));
app.get('/',require('./routes/index'));
app.post('/',require('./routes/index'));
app.use('/login',require('./routes/login'));

app.use('/register',require('./routes/register'));

app.use('/employee',require('./routes/employee/index'));
app.use('/active',require('./routes/employee/active'));
app.use('/user',require('./routes/user/index'));
db.sync().then(function(){
    app.listen(port);
    console.log(`Server is listening on ${port}`);
}).catch(function(err){
    console.error(err);
});