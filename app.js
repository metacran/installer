import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import jade from 'jade';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from './routes/index.js';

var app = express();

// view engine setup
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(logger('combined'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

