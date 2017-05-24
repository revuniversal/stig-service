"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
console.log('hello world!');
axios_1["default"].get('http://iase.disa.mil/stigs/Pages/a-z.aspx')
    .then(function (response) {
    console.log(response);
});
