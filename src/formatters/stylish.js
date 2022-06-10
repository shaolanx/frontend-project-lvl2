import _ from 'lodash';

const iter = (tree, depth = 1) => {
  const currentIndent = depthes => ' '.repeat(depthes * 2);

  const stringify = (value, depth) => {
    if (!(value instanceof Object)) {
     return value;
    }
    const openingSpaces = currentIndent(depth + 2);
    const closingSpaces = currentIndent(depth);
    return `{\n${openingSpaces}${Object.keys(value)}: ${Object.values(value)}\n${closingSpaces}}`;
  };

  const result = tree.map((node) => {
    switch (node.type) {
      case 'deleted':
        return `${currentIndent(depth)}- ${stringify(node.value, depth)}`;
      case 'added':
        return `${currentIndent(depth)}+ ${stringify(node.value, depth)}`;
      case 'unchanged':
        return `${currentIndent(depth)}  ${stringify(node.value, depth)}`;
      case 'updated':
        return [
          `${currentIndent(depth)}- ${stringify(node.value, depth)}`,
          `${currentIndent(depth)}+ ${stringify(node.newValue, depth)}`,
        ];
      case 'has children':
        return `${currentIndent(depth)}  {\n${iter(node.children, depth + 2)}\n${currentIndent(depth)}}`;
      default:
        throw new Error('missing selector');
    }
  });

  return _.flatten(result).join('\n');
};

const stylish = tree => `{\n${iter(tree)}\n}`;

export default stylish;
