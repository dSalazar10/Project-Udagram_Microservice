"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedRouter = void 0;
/* MIT License

Copyright (c) 2019 Daniel Salazar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const express_1 = require("express");
const FeedItem_1 = require("../models/FeedItem");
const auth_router_1 = require("../../users/routes/auth.router");
const AWS = __importStar(require("../../../../aws"));
const config_1 = require("../../../../config/config");
const router = express_1.Router();
const axios = require('axios');
/* Endpoints */
// Get all images
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield FeedItem_1.FeedItem.findAndCountAll({ order: [['id', 'DESC']] });
    items.rows.map((item) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
}));
// Get a specific resource
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const item = yield FeedItem_1.FeedItem.findByPk(id).catch((err) => {
        if (err) {
            throw err;
        }
    });
    res.send(item);
}));
// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', auth_router_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    const url = AWS.getGetSignedUrl(fileName);
    res.status(201).send({ url: url });
}));
// update a specific resource
router.patch('/:id', auth_router_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Required id parameter
    const { id } = req.params;
    // Verify parameters
    if (!id) {
        return res.status(400).send(`id is required.`);
    }
    // Required JSON body
    const caption = req.body.caption;
    const fileName = req.body.url;
    // Verify caption
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }
    // Verify fileName
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }
    // Find item based on the search parameter
    const item = yield FeedItem_1.FeedItem.findByPk(id);
    // Update the caption and url
    const updated_item = yield item.update({
        'caption': caption,
        'url': fileName
    });
    updated_item.url = AWS.getGetSignedUrl(updated_item.url);
    res.status(200).send(updated_item);
}));
// Post an image
router.post('/', auth_router_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const caption = req.body.caption;
    const fileName = req.body.url;
    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }
    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }
    const item = yield new FeedItem_1.FeedItem({
        caption: caption,
        url: fileName
    });
    const saved_item = yield item.save();
    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
}));
// Get an image
router.get('/getImage/:id', auth_router_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Required id parameter
    const { id } = req.params;
    // Verify parameters
    if (!id) {
        return res.status(400).send(`id is required.`);
    }
    const item = yield FeedItem_1.FeedItem.findByPk(id);
    if (!item) {
        return res.status(400).send('item not found.');
    }
    const filename = item.url;
    AWS.getImage(filename).then((data) => {
        const img = Buffer.from(data.image.buffer, 'base64');
        res.writeHead(200, {
            'Content-Type': data.contentType
        });
        res.end(img);
    });
}));
// Filter an image
router.patch('/filter/:id', auth_router_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Required id parameter
    const { id } = req.params;
    // Verify parameters
    if (!id) {
        return res.status(400).send(`id is required.`);
    }
    // Use the token of the user to login to the Image Filter Server
    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length !== 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }
    // Search for the image to be filtered by id
    const item = yield FeedItem_1.FeedItem.findByPk(id);
    if (!item) {
        return res.status(400).send('item not found.');
    }
    // List of filters: grey, sepia, blur, gaussian, mirror, invert
    const filter_type = 'sepia';
    const token = token_bearer[1];
    // URL of Image Filter Server
    const host = config_1.config.dev.filter_host;
    const image = AWS.getGetSignedUrl(item.url);
    const path = `${host}/api/v0/filter/${filter_type}?image_url=${image}`;
    // Set the headers for the Filter Request
    const data = JSON.stringify({
        image_url: `${image}`
    });
    const headers = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    // Send a request to the Image Filter Server to filter an image
    axios.post(path, data, headers).then((getResponse) => {
        // TODO: Fix bug in image encoding
        // Receives an images encoded in base64
        const image_data = getResponse.data;
        // Convert base64 to binary
        const img = Buffer.from(image_data, 'binary');
        const filter_name = `filter.${item.url}`;
        // Upload directly
        AWS.uploadImage(filter_name, img).catch((err) => {
            console.log(err);
        });
        // Send a signedURL to the image for viewing
        res.status(200);
    });
}));
exports.FeedRouter = router;
//# sourceMappingURL=feed.router.js.map