import _ from 'lodash';

// const currentIndent = depthes => ' '.repeat(depthes * 2);

const currentIndent = (depth, replacer = ' ', spacesCount = 4) => {
  const indentSize = depth * spacesCount;
  return replacer.repeat(indentSize);
};

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indent = currentIndent(depth);
  const bracketIndent = currentIndent(depth + 1);
  const lines = Object
    .entries(value)
    .map(([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

const iter = (tree, depth = 1) => {
  const result = tree.map((node) => {
    const indent = currentIndent(depth);
    switch (node.status) {
      case 'deleted':
        return `${indent}- ${node.key}: ${stringify(node.value, depth + 1)}`;
      case 'added':
        return `${indent}+ ${node.key}: ${stringify(node.value, depth + 1)}`;
      case 'unchanged':
        return `${indent}  ${node.key}: ${stringify(node.value, depth + 1)}`;
      case 'updated':
        return [
          `${indent}- ${node.key}: ${stringify(node.value, depth + 1)}`,
          `${indent}+ ${node.key}: ${stringify(node.newValue, depth + 1)}`,
        ];
      case 'has children':
        return `${indent} ${node.key}: {\n${iter(node.children, depth + 2)}\n${indent}}`;
      default:
        throw new Error('missing selector');
    }
  });

  return _.flatten(result).join('\n');
};

const stylish = tree => `{\n${iter(tree)}\n}`;

export default stylish;
