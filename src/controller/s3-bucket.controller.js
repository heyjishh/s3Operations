const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const buckets = {};
const objects = {};

const createBucket = (req, res) => {
    try {
        const { bucketName } = req.body;
        if (!bucketName) {
            return res.status(400).json({ message: `Bucket name is required.` });
        }
        if (!buckets[bucketName]) {
            buckets[bucketName] = [];
            return res.status(201).json({ message: `Bucket '${bucketName}' created.` });
        } else {
            return res.status(400).json({ message: `Bucket '${bucketName}' already exists.` });
        }
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while creating the bucket.');
    }
};

const listBuckets = (req, res) => {
    try {
        return res.status(200).json({ buckets });
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while listing the buckets.');
    }
};

const uploadDataIntoBucket = (req, res) => {
    try {
        const { bucketName } = req.params;
        const file = req.file;
        if (!buckets[bucketName]) {
            return res.status(400).json({ message: `Bucket '${bucketName}' not found.` });
        } else {
            const objectKey = `${file.originalname}-${Date.now()}`;
            objects[objectKey] = file.buffer;
            buckets[bucketName].push(objectKey);
            return res.status(201).json({ message: `Object '${objectKey}' uploaded to bucket '${bucketName}'` });
        }
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while uploading data into the bucket.');
    }
};

const getObjectFromBucket = (req, res) => {
    try {
        const { bucketName, objectKey } = req.params;
        if (!buckets[bucketName]) {
            return res.status(400).json({ message: `Bucket '${bucketName}' not found.` });
        } else if (!objects[objectKey]) {
            return res.status(400).json({ message: `Object '${objectKey}' not found in bucket '${bucketName}'` });
        } else {
            return res.json({ data: objects[objectKey] });
        }
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while getting the object from the bucket.');
    }
};

const deleteObjectFromBucket = (req, res) => {
    try {
        const { bucketName, objectKey } = req.params;
        if (!buckets[bucketName]) {
            return res.status(400).json({ message: `Bucket '${bucketName}' not found.` });
        } else if (!objects[objectKey]) {
            return res.status(400).json({ message: `Object '${objectKey}' not found in bucket '${bucketName}'` });
        } else {
            delete objects[objectKey];
            buckets[bucketName] = buckets[bucketName].filter((key) => key !== objectKey);
            return res.status(200).json({ message: `Object '${objectKey}' deleted from bucket '${bucketName}'` });
        }
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while deleting the object from the bucket.');
    }
};

module.exports = {
    createBucket,
    listBuckets,
    uploadDataIntoBucket: [upload.single('file'), uploadDataIntoBucket],
    getObjectFromBucket,
    deleteObjectFromBucket,
};