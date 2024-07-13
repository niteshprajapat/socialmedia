import DataUriParser from 'datauri/parser.js';
import path from 'path';


const getDataUrl = (file) => {
    const parser = new DataUriParser();

    const extName = path.extname(file.originalname).toString();
    const fileFormat = parser.format(extName, file.buffer);
    return fileFormat;
}

export default getDataUrl;