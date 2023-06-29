const express = require('express');
const items = require('./fakeDb');
const ExpressError = require('./expressError');

const app = express();
app.use(express.json());


app.get('/items', (req, res) => {
  res.json(items);
});


app.post('/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json({ added: newItem });
});


app.get('/items/:name', (req, res, next) => {
  const itemName = req.params.name;
  const item = items.find((item) => item.name === itemName);

  if (item) {
    res.json(item);
  } else {
    next(new ExpressError('Item not found', 404));
  }
});


app.patch('/items/:name', (req, res, next) => {
  const itemName = req.params.name;
  const updatedItem = req.body;

  for (let item of items) {
    if (item.name === itemName) {
      item.name = updatedItem.name || item.name;
      item.price = updatedItem.price || item.price;
      return res.json({ updated: item });
    }
  }

  next(new ExpressError('Item not found', 404));
});


app.delete('/items/:name', (req, res, next) => {
  const itemName = req.params.name;
  const index = items.findIndex((item) => item.name === itemName);

  if (index !== -1) {
    items.splice(index, 1);
    res.json({ message: 'Deleted' });
  } else {
    next(new ExpressError('Item not found', 404));
  }
});


app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: { message, status } });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});