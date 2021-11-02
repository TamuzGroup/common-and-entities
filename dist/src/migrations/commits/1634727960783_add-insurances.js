"use strict";
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
    async up(db) {
        const docs = insurances_json_1.data.map((_a) => {
            var { _id } = _a, rest = __rest(_a, ["_id"]);
            return Object.assign({ _id: new mongodb_1.ObjectId(_id) }, rest);
        });
        const specialitiesCollection = await db.createCollection(collectionName);
        await specialitiesCollection.insertMany(docs);
    }
    async down(db) {
        db.dropCollection(collectionName);
    }
}
exports.AddInsurances = AddInsurances;
//# sourceMappingURL=1634727960783_add-insurances.js.map