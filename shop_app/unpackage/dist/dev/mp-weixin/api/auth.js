"use strict";
const utils_request = require("../utils/request.js");
const login = (data) => utils_request.request({ url: "/auth/login", method: "POST", data });
const register = (data) => utils_request.request({ url: "/auth/register", method: "POST", data });
exports.login = login;
exports.register = register;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/auth.js.map
