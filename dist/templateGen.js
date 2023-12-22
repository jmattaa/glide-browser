"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genFromTemplateFile = void 0;
const fs_1 = __importDefault(require("fs"));
function parse(code, vars) {
    // love regex
    let varRegex = /\#\{(.*?)}/g;
    return code.replace(varRegex, (match, varname) => {
        return vars[varname] || match; // keeping it as is if there is no var
    });
}
function genFromTemplateFile(templatefile, destfile, vars) {
    fs_1.default.readFile(templatefile, (err, res) => {
        if (err)
            throw Error(err + '\r\nGLIDE NOT INSTALLED CORRECTLY!');
        let newfilecode = parse(res.toString(), vars);
        fs_1.default.writeFileSync(destfile, newfilecode);
    });
}
exports.genFromTemplateFile = genFromTemplateFile;
