const fs = require('fs');
const axios = require('axios');
const path = require('path');
const pdfLinks = require('./pdf')

async function downloadPDF(url, downloadDir) {
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const fileName = path.basename(url);
        const filePath = path.join(downloadDir, fileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', (err) => reject(err));
        });
    } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}`);
        return null;
    }
}

async function main() {
    const pdfUrls = pdfLinks;

    const downloadDir = 'Downloaded-PDFs';

    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }

    console.log(`Downloading ${pdfUrls.length} PDF files...`);

    for (const pdfUrl of pdfUrls) {
        await downloadPDF(pdfUrl, downloadDir);
        console.log(`Downloaded: ${pdfUrl}`);
    }

    console.log('All PDF Downloads Completed.');
}

main();
