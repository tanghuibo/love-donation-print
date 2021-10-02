const express = require('express');
const path = require('path');
const fs = require('fs');
const raiseFund = require('./raiseFund');

const app = express();

app.get('/get-data', (req, res) => {
  raiseFund.query(req.query.url).then(data => res.send(data)).catch(e => {
    console.error("发送异常", e);
    res.status(500).send(e);
  })
});

app.get('/404', (req, res) => {
  res.status(404).send('Not found');
});

app.get('/500', (req, res) => {
  res.status(500).send('Server Error');
});

app.use('/', express.static('public'));


// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});


// Web 类型云函数，只能监听 9000 端口
app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});
