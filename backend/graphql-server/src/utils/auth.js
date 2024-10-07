"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_TOKEN_COOKIE_NAME = exports.REFRESH_TOKEN_COOKIE_NAME = void 0;
exports.createTokens = createTokens;
exports.setAccessToken = setAccessToken;
exports.setRefreshToken = setRefreshToken;
exports.refreshTokens = refreshTokens;
var jsonwebtoken_1 = require("jsonwebtoken");
var knexfile_js_1 = require("../../knexfile.js");
var knex_1 = require("knex");
var sign = jsonwebtoken_1.default.sign, verify = jsonwebtoken_1.default.verify;
function createTokens(user) {
    var refreshToken = sign({ userUid: user.uid, tokenCount: user.tokenCount }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30days",
    });
    var accessToken = sign({ userUid: user.uid }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15mins",
    });
    return { refreshToken: refreshToken, accessToken: accessToken };
}
exports.REFRESH_TOKEN_COOKIE_NAME = "refresh-token";
exports.ACCESS_TOKEN_COOKIE_NAME = "access-token";
function setAccessToken(res, accessToken) {
    res.cookie(exports.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        path: "/",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
}
function setRefreshToken(res, refreshToken) {
    res.cookie(exports.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
}
function refreshTokens(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var knexInstance, refreshToken, data, user, _a, newRefreshToken, newAccessToken, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    knexInstance = (0, knex_1.default)(knexfile_js_1.default);
                    refreshToken = req.cookies[exports.REFRESH_TOKEN_COOKIE_NAME];
                    if (!refreshToken) {
                        return [2 /*return*/, { success: false, message: "Refresh token not found" }];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    return [4 /*yield*/, knexInstance("users")
                            .where({ uid: data.userUid })
                            .first()];
                case 2:
                    user = _b.sent();
                    _a = createTokens(user), newRefreshToken = _a.refreshToken, newAccessToken = _a.accessToken;
                    // Set new tokens in HTTP-only cookies
                    setAccessToken(res, newAccessToken);
                    setRefreshToken(res, newRefreshToken);
                    return [2 /*return*/, { success: true, message: "Tokens refreshed successfully" }];
                case 3:
                    error_1 = _b.sent();
                    console.error("Error verifying refresh token:", error_1);
                    return [2 /*return*/, { success: false, message: "Invalid refresh token" }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
