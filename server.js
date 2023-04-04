const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')


dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

connectToMongoDB();

// Set up API routes
app.use('/api/customers', require('./routes/customers'));
app.use('/api/workOrders', require('./routes/workOrders'));
app.use('/api/technicians', require('./routes/technicians'));
// app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/invoices', require('./routes/invoices'));


// Set up views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Set up non-API routes
app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
