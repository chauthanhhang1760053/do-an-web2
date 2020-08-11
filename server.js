if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');
const db = require('./services/db');

app.use(
	cookieSession({
		name: 'nkhh-bank',
		keys: [ 'nkhh' ],
		maxAge: 24 * 60 * 60 * 1000 //24h
	})
); 

app.use(require('./middleware/authentication').localCurrentUser);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(cors()); 
app.use('/api', require('./api'));

//set layout
// app.set('socketio', io);
app.set('views', './views');
app.set('view engine', 'ejs');

//ROUTER
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/active', require('./routes/active'));
app.use('/forget-password', require('./routes/forgetPassword'));
app.use('/profile', require('./routes/profile'));
app.use('/transfer', require('./routes/transfer'));
app.use('/withdraw', require('./routes/withdraw'));
app.use('/verify-card', require('./routes/verify-card'));
app.use('/list-user', require('./routes/list-user'));
app.use('/history', require('./routes/history'));
app.use('/history-user', require('./routes/history-user'));
app.use('/list-account', require('./routes/list-account'));
app.use('/about', require('./routes/about')); 
app.use('/privacy', require('./routes/privacy'));
 
db
	.sync()
	.then(function() {
		app.listen(port);
		console.log(`\nServer is listening on port ${port}\n`);
	})
	.catch(function(err) {
		console.error(err);
	});
