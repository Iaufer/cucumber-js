"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const data_table_1 = __importDefault(require("./data_table"));
const id = 'id';
const location = { line: 0 };
(0, mocha_1.describe)('DataTable', () => {
    (0, mocha_1.describe)('table with headers', () => {
        const dataTable = {
            location,
            rows: [
                {
                    id,
                    location,
                    cells: [
                        { value: 'header 1', location },
                        { value: 'header 2', location },
                    ],
                },
                {
                    id,
                    location,
                    cells: [
                        { value: 'row 1 col 1', location },
                        { value: 'row 1 col 2', location },
                    ],
                },
                {
                    id,
                    location,
                    cells: [
                        { value: 'row 2 col 1', location },
                        { value: 'row 2 col 2', location },
                    ],
                },
            ],
        };
        (0, mocha_1.describe)('rows', () => {
            (0, mocha_1.it)('returns a 2-D array without the header', () => {
                (0, chai_1.expect)(new data_table_1.default(dataTable).rows()).to.eql([
                    ['row 1 col 1', 'row 1 col 2'],
                    ['row 2 col 1', 'row 2 col 2'],
                ]);
            });
        });
        (0, mocha_1.describe)('hashes', () => {
            (0, mocha_1.it)('returns an array of object where the keys are the headers', () => {
                (0, chai_1.expect)(new data_table_1.default(dataTable).hashes()).to.eql([
                    { 'header 1': 'row 1 col 1', 'header 2': 'row 1 col 2' },
                    { 'header 1': 'row 2 col 1', 'header 2': 'row 2 col 2' },
                ]);
            });
        });
        (0, mocha_1.describe)('transpose', () => {
            (0, mocha_1.it)('returns a new DataTable, with the data transposed', () => {
                (0, chai_1.expect)(new data_table_1.default(dataTable).transpose().raw()).to.eql([
                    ['header 1', 'row 1 col 1', 'row 2 col 1'],
                    ['header 2', 'row 1 col 2', 'row 2 col 2'],
                ]);
            });
        });
    });
    (0, mocha_1.describe)('table without headers', () => {
        const dataTable = {
            location,
            rows: [
                {
                    id,
                    location,
                    cells: [
                        { value: 'row 1 col 1', location },
                        { value: 'row 1 col 2', location },
                    ],
                },
                {
                    id,
                    location,
                    cells: [
                        { value: 'row 2 col 1', location },
                        { value: 'row 2 col 2', location },
                    ],
                },
            ],
        };
        (0, mocha_1.describe)('raw', () => {
            (0, mocha_1.it)('returns a 2-D array', () => {
                (0, chai_1.expect)(new data_table_1.default(dataTable).raw()).to.eql([
                    ['row 1 col 1', 'row 1 col 2'],
                    ['row 2 col 1', 'row 2 col 2'],
                ]);
            });
        });
        (0, mocha_1.describe)('rowsHash', () => {
            (0, mocha_1.it)('returns an object where the keys are the first column', () => {
                (0, chai_1.expect)(new data_table_1.default(dataTable).rowsHash()).to.eql({
                    'row 1 col 1': 'row 1 col 2',
                    'row 2 col 1': 'row 2 col 2',
                });
            });
        });
    });
    (0, mocha_1.describe)('table with something other than 2 columns', () => {
        (0, mocha_1.describe)('rowsHash', () => {
            (0, mocha_1.it)('throws an error if not all rows have two columns', function () {
                const dataTable = {
                    location,
                    rows: [
                        {
                            id,
                            location,
                            cells: [{ value: 'row 1 col 1', location }],
                        },
                        {
                            id,
                            location,
                            cells: [{ value: 'row 2 col 1', location }],
                        },
                    ],
                };
                (0, chai_1.expect)(() => new data_table_1.default(dataTable).rowsHash()).to.throw('rowsHash can only be called on a data table where all rows have exactly two columns');
            });
        });
    });
});
//# sourceMappingURL=data_table_spec.js.map