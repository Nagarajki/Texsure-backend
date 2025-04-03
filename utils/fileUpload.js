const path = require("path");
const fs = require("fs");

const addLocalImage = async (file, folderName) => {
    const uploadPath = path.join(__dirname, "..", "taxsure_images", folderName);
    // Ensure the folder exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    //check file type
    let mimeType = file.mimetype;
    const filePath = await path.join(uploadPath, file.originalname);
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        const { buffer } = file;
        await sharp(buffer).jpeg({ quality: 50 })
            .toFile(filePath);
        mimeType = "Image ----> and image been compressed"
        return `https://api.travels.com/taxsure_images/${folderName}/${file.originalname}`;
    } else if (file.mimetype === 'application/pdf') {

        const { buffer } = file; // Get the uploaded PDF buffer
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(buffer);

        // Create a new PDF document to store the compressed version
        const newPdfDoc = await PDFDocument.create();

        // Copy pages from the original PDF to the new one
        const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => newPdfDoc.addPage(page));

        // Serialize the new PDF document to bytes (compressed version)
        const compressedPdfBytes = await newPdfDoc.save({ useObjectStreams: true }); // Optional: change options
        // Save the compressed PDF to the filesystem
        fs.writeFileSync(filePath, compressedPdfBytes);

        // Save the file
        await fs.writeFileSync(filePath, file.buffer);
        // Return the file path URL
        return `https://api.travels.com/taxsure_images/${folderName}/${file.originalname}`;
    } else {
        await fs.writeFileSync(filePath, file.buffer);
        return `https://api.travels.com/taxsure_images/${folderName}/${file.originalname}`;
    }
};

const updateLocalImage = async (oldImageKey, file, folderName) => {
    let mimeType = file.mimetype;
    if (oldImageKey) {
        // const oldImagePath = path.join(__dirname, "..", oldImageKey);
        const relativeOldImageKey = oldImageKey.replace('https://api.travels.com/', '');

        const oldImagePath = path.join(__dirname, "..", relativeOldImageKey);
        if (fs.existsSync(oldImagePath)) {
            await fs.unlinkSync(oldImagePath); // Delete old image
        }
    }
    const uploadPath = await path.join(__dirname, "..", "taxsure_images", folderName);
    // Ensure the folder exists
    if (!fs.existsSync(uploadPath)) {
        await fs.mkdirSync(uploadPath, { recursive: true });
    }
    const filePath = await path.join(uploadPath, file.originalname);
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        const { buffer } = file;
        await sharp(buffer).jpeg({ quality: 50 })
            .toFile(filePath);
        mimeType = "Image ----> and image been compressed"
        return `https://api.travels.com/taxsure_images/${folderName}/${file.originalname}`;
    } else if (file.mimetype === 'application/pdf') {

        const { buffer } = file; // Get the uploaded PDF buffer
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(buffer);
        // Create a new PDF document to store the compressed version
        const newPdfDoc = await PDFDocument.create();

        // Copy pages from the original PDF to the new one
        const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => newPdfDoc.addPage(page));

        // Serialize the new PDF document to bytes (compressed version)
        const compressedPdfBytes = await newPdfDoc.save({ useObjectStreams: true }); // Optional: change options
        // Save the compressed PDF to the filesystem
        fs.writeFileSync(filePath, compressedPdfBytes);

        // Save the file
        await fs.writeFileSync(filePath, file.buffer);
        // Return the file path URL
        return `https://api.travels.com/taxsure_images/${folderName}/${file.originalname}`;
    } else {
        await fs.writeFileSync(filePath, file.buffer);
        return `https://api.travels.com/taxsure_images/${folderName}/${file.originalname}`;
    }
}

module.exports = { addLocalImage, updateLocalImage };
