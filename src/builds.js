import _ from 'lodash';

const prepareData = (obj1, obj2, key) => {
  const objectComparison = obj1[key] === obj2[key];
  if (!_.has(obj1, key)) {
    return { key, value: obj2[key], status: 'added' };
  } if (!_.has(obj2, key)) {
    return { key, value: obj1[key], status: 'deleted' };
  } if (!objectComparison) {
    return {
      key, value: obj1[key], newValue: obj2[key], status: 'updated',
    };
  }
  return { key, value: obj1[key], status: 'unchanged' };
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

export default buildTree;
