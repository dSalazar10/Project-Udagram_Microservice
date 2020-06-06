"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sequelize_1 = require("./sequelize");
const index_router_1 = require("./controllers/v0/index.router");
const model_index_1 = require("./controllers/v0/model.index");
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize_1.sequelize.addModels(model_index_1.V0MODELS);
    yield sequelize_1.sequelize.sync();
    const app = express_1.default();
    const port = process.env.PORT || 8080; // default port to listen
    app.use(body_parser_1.default.json());
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
    // Redirect to index router for /api/v0/
    app.use('/api/v0/', index_router_1.IndexRouter);
    app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send('<!doctype html>\n' +
            '\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '  <meta charset="utf-8">\n' +
            '  <title>Udagram</title>\n' +
            '  <meta name="description" content="Udagram">\n' +
            '  <meta name="author" content="Daniel">\n' +
            '</head>\n' +
            '\n' +
            '<body>\n' +
            '    <p>Use /api/v0 to access the API</p>\n' +
            '</body>\n' +
            '</html>\n');
    }));
    app.get('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send('<!doctype html>\n' +
            '\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '  <meta charset="utf-8">\n' +
            '  <title>Udagram</title>\n' +
            '  <meta name="description" content="Udagram">\n' +
            '  <meta name="author" content="Daniel">\n' +
            '</head>\n' +
            '\n' +
            '<body>\n' +
            '    <p>Use /api/v0 to access the API</p>\n' +
            '</body>\n' +
            '</html>\n');
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map