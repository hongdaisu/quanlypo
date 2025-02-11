import phongbanService from "../services/phongbanService";
import { raw } from 'body-parser';
require('dotenv').config();

export const getUrlView = (req, res) => {
    // res.json({ url: process.env.URL_VIEW });
    try {
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            url: process.env.URL_VIEW
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: 500, errMessage: 'Internal Server Error' });
    }
};


module.exports = {
    getUrlView: getUrlView
}

