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

const genDiff = (filepath_1, filepath_2, formatterName = 'stylish') => {
  const firstFileExt = path.extname(filepath_1);
  const secondFileExt = path.extname(filepath_2);
  const preparedFile_1 = parse(readFileSync(formAbsolutePath(filepath_1)), firstFileExt);
  const preparedFile_2 = parse(readFileSync(formAbsolutePath(filepath_2)), secondFileExt);
  if (!_.isObject(preparedFile_1) || !_.isObject(preparedFile_2)) {
    return 'Unsupported format of file!';
  }

  const preparedTree = buildTree(preparedFile_1, preparedFile_2, []);

  return format(preparedTree, formatterName);
};

export default genDiff;