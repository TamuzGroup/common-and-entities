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
exports.AddHealthcareOrganizations = void 0;
/* eslint-disable */
const mongodb_1 = require("mongodb");
const hcos_json_1 = require("../data/hcos.json");
const collectionName = 'healthcareOrganizations';
class AddHealthcareOrganizations {
    async up(db) {
        const docs = hcos_json_1.data.map((_a) => {
            var { _id, parent } = _a, rest = __rest(_a, ["_id", "parent"]);
            return Object.assign({ _id: new mongodb_1.ObjectId(_id), parent: new mongodb_1.ObjectId(parent) }, rest);
        });
        const specialitiesCollection = await db.createCollection(collectionName);
        await specialitiesCollection.insertMany(docs);
    }
    async down(db) {
        db.dropCollection(collectionName);
    }
}
exports.AddHealthcareOrganizations = AddHealthcareOrganizations;
//# sourceMappingURL=1634726121556_add-hcos.js.map