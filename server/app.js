import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import adminRoute from './routes/admin';
import config from './config';
import strategy from './services/passportStrategy';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors())

app.use(session({
  secret: config.keys.session_secret,
  saveUninitialized: false,
  resave: false
}))
// Hook up Passport.
app.use(passport.initialize());


// Hook the passport strategy.
strategy(passport);

app.use(express.static(join(__dirname, '../public')));
app.use(express.static(join(__dirname, '../upload')));

app.use('/api/v1/admin', adminRoute(passport));

app.use('/', (req, res) => {
  res.format({
    html: () => { res.sendFile(join(__dirname, '../public', 'index.html')) },
  });
});

export default app;
