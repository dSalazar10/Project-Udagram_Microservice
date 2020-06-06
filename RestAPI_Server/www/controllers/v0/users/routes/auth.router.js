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
exports.AuthRouter = exports.requireAuth = void 0;
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
const User_1 = require("../models/User");
const config_1 = require("../../../../config/config");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const EmailValidator = __importStar(require("email-validator"));
const router = express_1.Router();
/* Helper Functions */
// Generate a salted password hash using Javascript Web Tokens
function generatePassword(plainTextPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        const salt = yield bcrypt.genSalt(saltRounds);
        return yield bcrypt.hash(plainTextPassword, salt);
    });
}
// Compare a given password with the stored password hash
function comparePasswords(plainTextPassword, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(plainTextPassword, hash);
    });
}
// Generate a Javascript Web Token using a given email
function generateJWT(user) {
    return jwt.sign(user.short(), config_1.config.dev.jwt_secret);
}
// Validate authentication provided
function requireAuth(req, res, next) {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }
    const token = token_bearer[1];
    return jwt.verify(token, config_1.config.dev.jwt_secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        return next();
    });
}
exports.requireAuth = requireAuth;
/* Endpoints */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        '    <p>/auth</p>\n' +
        '</body>\n' +
        '</html>\n');
}));
// Verify credentials are valid
router.get('/verification', requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send({ auth: true, message: 'Authenticated.' });
}));
// Login with username and password
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }
    // check email password valid
    if (!password) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }
    const user = yield User_1.User.findByPk(email);
    // check that user exists
    if (!user) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }
    // check that the password matches
    const authValid = yield comparePasswords(password, user.password_hash);
    if (!authValid) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }
    res.status(200).send({ auth: true, token: generateJWT(user), user: user.short() });
}));
// register a new user
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }
    // check email password valid
    if (!plainTextPassword) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }
    // find the user
    const user = yield User_1.User.findByPk(email);
    // check that user doesnt exists
    if (user) {
        return res.status(422).send({ auth: false, message: 'User may already exist' });
    }
    const password_hash = yield generatePassword(plainTextPassword);
    const newUser = yield new User_1.User({
        email: email,
        password_hash: password_hash
    });
    let savedUser;
    try {
        savedUser = yield newUser.save();
    }
    catch (e) {
        throw e;
    }
    res.status(201).send({ token: generateJWT(savedUser), user: savedUser.short() });
}));
exports.AuthRouter = router;
//# sourceMappingURL=auth.router.js.map