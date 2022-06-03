import _ from 'lodash';
import { prepareData } from './selectives.js';

const buildPlainString = (obj, property) => {
  const isValueComplex = (_.isObject(obj.value)) ? '[complex value]' : obj.value;
  const preparedValue = (typeof obj.value === 'string') ? `'${obj.value}'` : isValueComplex;
  const isNewValueComplex = (_.isObject(obj.newValue)) ? '[complex value]' : obj.newValue;
  const preparedNewValue = (typeof obj.newValue === 'string') ? `'${obj.newValue}'` : isNewValueComplex;

  switch (obj.status) {
    case 'unchanged':
    case 'changedAndParentIsObj2':
      return '';
    case 'added':
      return `Property '${property}' was added with value: ${preparedValue}`;
    case 'deleted':
      return `Property '${property}' was removed`;
    case 'changedAndParentIsObj1':
      return `Property '${property}' was updated. From ${preparedValue} to ${preparedNewValue}`;
    default:
      return 'Wrong object status!';
  }
};

const buildTree = (obj1, obj2, resultObj) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const sortedKeys = _.sortBy(_.union(keys1, keys2));

  const preparedDataForTree = sortedKeys.flatMap((key) => {
    if (!_.isObject(obj1[key]) || !_.isObject(obj2[key])) {
      return prepareData(obj1, obj2, key);
    }
    return { key, children: buildTree(obj1[key], obj2[key], resultObj), status: 'has children' };
  });
  return preparedDataForTree;
};

export { buildPlainString, buildTree };
