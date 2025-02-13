require('dotenv').config();  // Load environment variables from a .env file

const express = require('express');
const { PDFNet } = require('@pdftron/pdfnet-node');
const cors = require('cors');  // Import CORS package

const app = express();
const port = 8971;

app.use(cors({
    origin: 'http://localhost:5173'})); 

const licenseKey = process.env.YOUR_LICENSE_KEY;
PDFNet.initialize(licenseKey);

app.get('/generate-pdf', async (req, res) => {
    try {
        const main = async () => {
            const doc = await PDFNet.PDFDoc.create();
            
            const page = await doc.pageCreate();
            doc.pagePushBack(page);

            await doc.save('blank.pdf', PDFNet.SDFDoc.SaveOptions.e_linearized);

            res.contentType('application/pdf');
            res.sendFile('blank.pdf', { root: '.' });
        };

        await PDFNet.runWithCleanup(main);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error Generating PDF');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
