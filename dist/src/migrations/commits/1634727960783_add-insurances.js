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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddInsurances = void 0;
/* eslint-disable */
const mongodb_1 = require("mongodb");
const insurances_json_1 = require("../data/insurances.json");
const collectionName = 'insurances';
class AddInsurances {
    up(db) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = insurances_json_1.data.map((_a) => {
                var { _id } = _a, rest = __rest(_a, ["_id"]);
                return Object.assign({ _id: new mongodb_1.ObjectId(_id) }, rest);
            });
            const specialitiesCollection = yield db.createCollection(collectionName);
            yield specialitiesCollection.insertMany(docs);
        });
    }
    down(db) {
        return __awaiter(this, void 0, void 0, function* () {
            db.dropCollection(collectionName);
        });
    }
}
exports.AddInsurances = AddInsurances;
//# sourceMappingURL=1634727960783_add-insurances.js.map