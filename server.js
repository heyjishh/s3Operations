const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const getRoutes = require('./src/routes/s3-bucket.routes');
app.use('/api', getRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});