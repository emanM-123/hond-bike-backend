const express = require('express');
const app = express();
const emailRoute = require('./src/routes/route'); 
const dotenv = require('dotenv');
const cors = require('cors');

app.use(cors());
dotenv.config();
app.use(express.json());

app.use('/api', emailRoute); 

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
