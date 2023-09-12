// Import required modules
const express = require('express');
const {
    createBucket,
    listBuckets,
    uploadDataIntoBucket,
    getObjectFromBucket,
    deleteObjectFromBucket
} = require('../controller/s3-bucket.controller');

// Create a new router instance
const router = express.Router();

// Define routes and their corresponding controller functions
router.post('/buckets', createBucket);
router.get('/buckets', listBuckets);
router.post('/buckets/:bucketName/upload', uploadDataIntoBucket);
router.get('/buckets/:bucketName/:objectKey', getObjectFromBucket);
router.delete('/buckets/:bucketName/:objectKey', deleteObjectFromBucket);

// Export the router
module.exports = router;