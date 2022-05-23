import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const getFixturePath = (filename) => path.join(dirname(__filename), '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

let resultStylish;
// let resultPlain;
let resultYaml;

beforeAll(() => {
  resultStylish = readFile('result.txt');
  resultYaml = readFile('result.txt');
//     resultPlain = readFile('resultPlain.txt');
});

test("genDiff's main flow json stylish", () => {
  const comparedJSON = genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'));
  expect(comparedJSON).toEqual(resultStylish);
});

test("genDiff's main flow yaml", () => {
  const comparedJSON = genDiff(getFixturePath('filepath1.yaml'), getFixturePath('filepath2.yaml'));
  expect(comparedJSON).toEqual(resultYaml);
});
