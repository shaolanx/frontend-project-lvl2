import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return `${value}`;
};

const plain = (difference) => {
  const iter = (diff, prefix = '') => _.map(diff, (node) => {
    const nodeKey = `${prefix}${node.key}`;
    switch (node.status) {
      case 'added':
        return `Property '${nodeKey}' was added with value: ${stringify(node.value)}`;
      case 'deleted':
        return `Property '${nodeKey}' was removed`;
      case 'updated':
        return `Property '${nodeKey}' was updated. From ${stringify(node.value)} to ${stringify(node.newValue)}`;
      case 'unchanged':
        return [];
      case 'has children':
        return iter(node.children, `${nodeKey}.`);
      default:
        throw new Error(`Unknown status: ${node.status}`);
    }
  },);
  return _.flattenDeep(iter(difference)).join('\n');
};

export default plain;
