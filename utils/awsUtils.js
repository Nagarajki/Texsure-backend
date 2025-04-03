let { Upload } = require("@aws-sdk/lib-storage");
let { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require('fs');
const AWS = require('aws-sdk')
const multer = require('multer')
const s3Config = {
    region: process.env.AWSREGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEY,
        secretAccessKey: process.env.SECRETACCESSKEY,
    }
};
// update code
AWS.config.update({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.AWSREGION,
});
// Create an S3 client
const s3 = new AWS.S3();

const s3Client = new S3Client(s3Config);
//multer config
//multer middleware
let upload = multer({
    limits: 1024 * 1024 * 5, //how much mb limits
    fileFilter: (req, file, done) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
            done(null, true)
        } else {
            done("Multer error - File type is not supported", false)
        }
    }
})
// AMS LOGO UPLOAD FUNCTIONS
const addLogo = async ( fileData,folderName ) => {
    // console.log("fileData,", fileData);
    // let  folderStructure = `logoimages/${fileData.originalname}`;
    let folderStructure;
    if (folderName === 'COMPANY') {
        folderStructure = `companyLogo/${fileData.originalname}`;
    } else if (folderName === 'PLANT') {
        folderStructure = `plantImage/${fileData.originalname}`;
    }
    // console.log("folder",folderStructure);
    try {
        let bucketParams = {
            Bucket: process.env.BUCKETNAME,
            Key: `${folderStructure}`,
            Body: fileData.buffer, // Using fileData.buffer instead of fs.readFile
        };
        console.log("bucketParams==>>>", bucketParams);
        const parallelUploads3 = new Upload({
            client: s3Client,
            queueSize:1,
            leavePartsOnError: false,
            params: bucketParams,
        });
        parallelUploads3.on("httpUploadProgress", (progress) => {
            // console.log(progress);
        });
        const response = await parallelUploads3.done();
        let datafile = {
            url: response.Location,
            Key: fileData.originalname,
        };
        // console.log("bucketParams", datafile);
        return datafile;
    } catch (error) {
        console.log("Error", error)
    }
};
//View the image
const awsLogoAcces = async (img_path, folderName) => {
    let keyPath ;
    console.log("keyPath", img_path)
    if (folderName === 'COMPANY') {
        keyPath = `companyLogo/${img_path}`;
    } else if (folderName === 'PLANT') {
        keyPath = `plantImage/${img_path}`;
    }
    const bucketParams = {
        Bucket: process.env.BUCKETNAME,
        Key: keyPath
    };
    const command = new GetObjectCommand(bucketParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const newUrl = new URL(url); //It will splite the url 

    const basePath = newUrl.pathname;  //Folder name and filename  where the files are stored
    
    const baseUrl = `${newUrl.origin}${basePath}`; // Removed unnecessary data from the getSingedUrl() created "url"
    // console.log("baseUrl", baseUrl)
    return baseUrl
}
//update the file
const updateLogo = async (old_path, new_path, folderName) => {
    // console.log("file deleting data --> ", old_path, new_path);
    // let  deleteExistingImage = `logoimages/${old_path}`;
    //     let  folderStructure = `logoimages/${new_path.originalname}`;
        let deleteExistingfile;
        let folderStructure;
        if (folderName === 'COMPANY') {
            deleteExistingfile = `companyLogo/${old_path}`;
            folderStructure =  `companyLogo/${new_path.originalname}`;
        } else if (folderName === 'PLANT') {
            deleteExistingfile = `plantImage/${old_path}`;
            folderStructure = `plantImage/${new_path.originalname}`;
        }
    // console.log("deleteExistingImage", deleteExistingfile);
    // console.log("folderStructure", folderStructure);
    try {
        // Step 1: Delete the existing image
        await s3.deleteObject({
            Bucket: process.env.BUCKETNAME,
            Key: deleteExistingfile,
        }).promise();
    
        const bucketParams = {
            Bucket: process.env.BUCKETNAME,
            Key: folderStructure,
            Body: new_path.buffer,
        };
        // console.log("bucketParams==>>>", bucketParams);
        const response = await s3.upload(bucketParams).promise();
        let datafile = {
            url: response.Location,
            Key: new_path.originalname,
        };
        console.log("bucketParams", datafile);
        return datafile;
    } catch (error) {
        console.error("Error in updateAwsBanners:", error);
        throw error; // Rethrow the error to be caught by the calling function
    }
};
module.exports = {
    addLogo,
    awsLogoAcces,
    updateLogo
}