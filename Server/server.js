const mongoose = require('mongoose');
const dotenv = require('dotenv');
//-------------------Config----------------//
dotenv.config({ path: './config.env' });
//--------------------DB-------------------//
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose.set('strictQuery', true);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(console.log('DB connection successful!'))
  .catch(err => {
    console.error('Failed to connect with mongo');
    console.error(err);
  });
//------------------Listener----------------//
const app = require('./app');

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(
    `start Listening on port http://localhost:${port} in ${process.env.NODE_ENV} mode`
  );
});
//--------------Rejection Handler------------//
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
//-----------------Exports------------------//
module.exports = server;
