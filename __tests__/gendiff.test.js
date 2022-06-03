import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const buildFilePath = (filename) => path.join(dirname(__filename), '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(buildFilePath(filename), 'utf-8');

const cases = [
  ['file1-1.json', 'file2-2.yml', 'stylish', 'STYLISH-result-file.txt'],
  ['file1-1.json', 'file2-3.yaml', 'plain', 'PLAIN-result-file.txt'],
  ['file1-1.json', 'file2-3.yaml', 'json', 'JSON-result-file.txt'],
];

test.each(cases)('Main test for "%s" and "%s" with formater "%s".', (file1, file2, formatName, fixture) => {
  const expected = readFile(fixture);
  const actual = genDiff(buildFilePath(file1), buildFilePath(file2), formatName);
  expect(actual).toEqual(expected);
});

test('Default formater.', () => {
  const expected = readFile('STYLISH-result-file.txt');
  const actual = genDiff(buildFilePath('file1-1.json'), buildFilePath('file2-3.yaml'));
  expect(actual).toEqual(expected);
});

test('Wrong file format!', () => {
  const actual = genDiff(buildFilePath('STYLISH-result-file.txt'), buildFilePath('file1-2.json'));
  expect(actual).toBe('Unsupported format of file!');
});
