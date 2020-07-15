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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var fs = __importStar(require("fs"));
var tl = __importStar(require("azure-pipelines-task-lib/task"));
var sigSize = tl.getInput('sigSize', true); // size of signatures
var percentPrecise = tl.getInput('percentPrecise', true); // percent precise
var file1 = tl.getPathInput('file1', true); // file 1 to compare
var file2 = tl.getPathInput('file2', true); // file 2 to compare
var print_matched = tl.getBoolInput('printMatched', true); // prints in console Signatures which similiar
var custom_Var = tl.getBoolInput('customVar', true); // creates variable $(Sigbench.Percent)
var f1 = [];
var f2 = [];
function GetSigFiles(inputFile, SigArray) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("##[debug]GetSigFiles()::" + inputFile);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var fetchData = [];
                    fs.createReadStream(inputFile, { highWaterMark: sigSize })
                        .on('data', function (chunk) {
                        SigArray.push(chunk);
                    })
                        .on('end', function () {
                        resolve(fetchData);
                    })
                        .on('error', reject);
                })];
        });
    });
}
function difference(a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++)
        a[a1[i]] = a1[i];
    for (var i = 0; i < a2.length; i++)
        if (a[a2[i]])
            delete a[a2[i]];
        else
            a[a2[i]] = a2[i];
    for (var k in a)
        diff.push(a[k]);
    return diff;
}
function intersect(a, b) {
    var ai = 0, bi = 0;
    var result = [];
    while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) {
            ai++;
        }
        else if (a[ai] > b[bi]) {
            bi++;
        }
        else /* they're equal */ {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }
    return result;
}
// https://stackoverflow.com/a/18650828
function formatBytes(bytes, decimals) {
    if (decimals === void 0) { decimals = 2; }
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var dm = decimals < 0 ? 0 : decimals;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function precise(x, precision) {
    if (precision === void 0) { precision = 4; }
    return Number.parseFloat(x).toPrecision(precision);
}
// Start function
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var f1_size, f2_size, inter, inter_arr_debug, inter_arr_command, inter_length, diff, diff_arr_debug, diff_length, DifferencePercent, IntersectionPercent, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, GetSigFiles(file1, f1)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, GetSigFiles(file2, f2)];
                case 2:
                    _a.sent();
                    f1_size = f1.length * sigSize;
                    f2_size = f2.length * sigSize;
                    console.log('##[group]Information about files. (debug only)');
                    console.log('##[debug]Signature Size (block size): ', sigSize);
                    console.log('##[debug]File 1 Signatures (total blocks in file 1): ', f1.length);
                    console.log('##[debug]File 2 Size: ', formatBytes(f1_size));
                    console.log('##[debug]File 2 Signatures (total blocks in file 2): ', f2.length);
                    console.log('##[debug]File 2 Size: ', formatBytes(f2_size));
                    console.log('##[debug]Total Signatures (blocks): ', f1.length + f2.length);
                    console.log('##[debug]Total Size: ', formatBytes(f1_size + f2_size));
                    console.log('##[endgroup]');
                    inter = intersect(f1, f2);
                    inter_arr_debug = inter.map(function (i) { return '##[debug]' + i; });
                    console.log('##[group]Found Signtures (inter). (debug only)');
                    console.log(inter_arr_debug);
                    console.log('##[endgroup]');
                    if (print_matched) {
                        console.log('##[command]Signature Benchmark | Matched signatures: ');
                        inter_arr_command = inter.map(function (i) { return '##[command]' + i; });
                        console.log(inter_arr_command);
                    }
                    else {
                        console.log('##[debug]Print Intersection set to false');
                    }
                    inter_length = inter.length;
                    console.log('##[debug]Found Signtures Num (inter length): ', inter_length);
                    diff = difference(f1, f2);
                    diff_arr_debug = diff.map(function (i) { return '##[debug]' + i; });
                    console.log('##[group]Found Signtures (diff). (debug only)');
                    console.log(diff_arr_debug);
                    console.log('##[endgroup]');
                    diff_length = diff.length;
                    console.log('##[debug]Found Signtures Num (diff length): ', diff_length);
                    DifferencePercent = 100 - diff_length / f2.length;
                    console.log('##[command]Difference Percent: ', DifferencePercent + '%');
                    IntersectionPercent = inter_length / (f2.length + f1.length - inter_length);
                    console.log('##[command]Intersection Percent: ', IntersectionPercent + '%');
                    if (custom_Var) {
                        tl.setVariable('Sigbench.DiffPercent', precise(DifferencePercent, percentPrecise));
                        tl.setVariable('Sigbench.InterPercent', precise(IntersectionPercent, percentPrecise));
                    }
                    else {
                        console.log('##[debug]Create Variables set to false');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    tl.setResult(tl.TaskResult.Failed, err_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
run();
