import _ from 'lodash';
import path from 'path';
import process from 'process';
import { readFileSync } from 'fs';
import parse from './parsers.js';
import { buildTree } from './builds.js';
import format from './formatters/formatters_switch.js';

const formAbsolutePath = (filepath) => {
  const cwd = process.cwd();
  return path.resolve(cwd, filepath);
};

const genDiff = (filepath1, filepath2, formatterName = 'stylish') => {
  const firstFileExt = path.extname(filepath1);
  const secondFileExt = path.extname(filepath2);
  const preparedFile1 = parse(readFileSync(formAbsolutePath(filepath1)), firstFileExt);
  const preparedFile2 = parse(readFileSync(formAbsolutePath(filepath2)), secondFileExt);
  if (!_.isObject(preparedFile1) || !_.isObject(preparedFile2)) {
    return 'Unsupported format of file!';
  }

  const preparedTree = buildTree(preparedFile1, preparedFile2, []);

  return format(preparedTree, formatterName);
};

export default genDiff;
