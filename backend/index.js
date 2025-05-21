require('dotenv').config();


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // Importă funcția de conectare la DB
const port = process.env.PORT || 8080;
const cors = require("cors");
const path = require('path'); 

// Conectează-te la MongoDB
connectDB();


app.use(bodyParser.json());
app.use(cors());


app.set("view engine", "ejs"); // Activăm EJS
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); // Folder CSS, JS

app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/quotes' , require("./Routes/quotesRoutes"))
app.use('/api/carti' , require('./Routes/cartiRoutes'))
app.use('/api/autor' , require('./Routes/autorRoutes'))
app.use('/api/admin' , require("./Routes/adminRoutes"))






app.listen(port, () => {
  console.log('Magic happens at http://localhost:' + port);
});
