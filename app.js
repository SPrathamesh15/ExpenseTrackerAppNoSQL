const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config()

const path = require('path');
const fs = require('fs');

const userRoutes = require('./routes/signUp');
const userLogInRoutes = require('./routes/logIn');
const expenseRoutes = require('./routes/index');
const purchaseRoutes = require('./routes/purchase')
const leaderBoardRoutes = require('./routes/premium')
const forgotPasswordRoutes = require('./routes/forgotpassword')
const resetPasswordRoutes = require('./routes/resetpassword')
const reportsRoutes = require('./routes/report')

app.use(helmet())
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(express.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a'})
app.use(morgan('combined', { stream: accessLogStream }))

app.use('/user', userRoutes)
app.use('/user', userLogInRoutes)
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes)
app.use('/premium', leaderBoardRoutes)
app.use('/password', forgotPasswordRoutes)
app.use('/password', resetPasswordRoutes)
app.use('/report', reportsRoutes)

app.use((req, res, next) => {
  res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' https: 'unsafe-inline';" + 
      "script-src 'self' https://cdnjs.cloudflare.com https://checkout.razorpay.com 'unsafe-inline' 'unsafe-eval';" + 
      "style-src 'self' https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/ 'unsafe-inline';" + 
      "connect-src 'self' http://13.126.112.76:3000 https://api.razorpay.com https://lumberjack-cx.razorpay.com;" +
      "frame-src https://api.razorpay.com;"
  );
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});


app.get('/password/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/resetpassword/resetpassword.html'));
});

app.use((req, res) => {
    console.log('URL: ', req.url);
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})


mongoose
.connect(
  `mongodb+srv://${process.env.MONGODBUSERNAME}:${process.env.PASSWORD}@cluster0.brta1me.mongodb.net/expenseTrackerNoSQL?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(result => {
    app.listen(3000)
    console.log('Connected!')
  })
  .catch(err => {
    console.log(err)
  })
