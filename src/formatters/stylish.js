import _ from 'lodash';

const currentIndent = depthes => ' '.repeat(depthes * 2);

const stringify = (value, depth) => {
  if (!(value instanceof Object)) {
    return value;
  }
  const openingSpaces = currentIndent(depth + 2);
  const closingSpaces = currentIndent(depth);
  if (value.status === 'has children') {
    return `{\n${openingSpaces} ${stringify(Object.values(value), 4)}\n${closingSpaces}}`;
  }
  return `{\n${openingSpaces} ${Object.values(value)}\n${closingSpaces}  }`;
};

const iter = (tree, depth = 1) => {
  const result = tree.map((node) => {
    switch (node.status) {
      case 'deleted':
        return `${currentIndent(depth)}- ${node.key}: ${stringify(node.value, depth)}`;
      case 'added':
        return `${currentIndent(depth)}+ ${node.key}: ${stringify(node.value, depth)}`;
      case 'unchanged':
        return `${currentIndent(depth)}   ${node.key}: ${stringify(node.value, depth)}`;
      case 'updated':
        return [
          `${currentIndent(depth)}- ${node.key}: ${stringify(node.value, depth)}`,
          `${currentIndent(depth)}+ ${node.key}: ${stringify(node.newValue, depth)}`,
        ];
      case 'has children':
        return `${currentIndent(depth)} ${node.key}: {\n${iter(node.children, depth + 2)}\n${currentIndent(depth)}}`;
      default:
        throw new Error('missing selector');
    }
  });

  return _.flatten(result).join('\n');
};

const stylish = tree => `{\n${iter(tree)}\n}`;

export default stylish;
