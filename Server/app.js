const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const dalleRouter = require('./routes/dalleRoutes');
//-------------------------------------------//
const app = express();
//---------------middleware------------------//
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
//-----------------Routes--------------------//
app.use('/api/v1/Post', postRouter);
app.use('/api/v1/Users', userRouter);
app.use('/api/v1/Dalle', dalleRouter);

app.get('/', async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the API'
  });
});
// Invalid routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    message: 'Invalid route, please check URL'
  });
}); //-------------------------------------------//
module.exports = app;
