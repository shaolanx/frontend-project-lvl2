import _ from 'lodash';

// const currentIndent = depthes => ' '.repeat(depthes * 2);

const currentIndent = (depth, replacer = ' ', spacesCount = 4) => {
  const indentSize = depth * spacesCount;
  return replacer.repeat(indentSize - 1);
};

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return `${value}`;
  }

  const indent = currentIndent(depth);
  const bracketIndent = currentIndent(depth + 1);
  const lines = Object
    .entries(value)
    .map(([key, val]) => `${bracketIndent.slice(1)}  ${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${indent} }`,
  ].join('\n');
};

const iter = (tree, depth = 1) => {
  const result = tree.map((node) => {
    const indent = currentIndent(depth);
    switch (node.status) {
      case 'deleted':
        return `${indent.slice(1)}- ${node.key}: ${stringify(node.value, depth)}`;
      case 'added':
        return `${indent.slice(1)}+ ${node.key}: ${stringify(node.value, depth)}`;
      case 'unchanged':
        return `${indent.slice(1)}  ${node.key}: ${stringify(node.value, depth)}`;
      case 'updated':
        return [
          `${indent.slice(1)}- ${node.key}: ${stringify(node.value, depth)}`,
          `${indent.slice(1)}+ ${node.key}: ${stringify(node.newValue, depth )}`,
        ];
      case 'has children':
        return `${indent} ${node.key}: {\n${iter(node.children, depth + 1)}\n${indent} }`;
      default:
        throw new Error('missing selector');
    }
  });

  return _.flatten(result).join('\n');
};

const stylish = tree => `{\n${iter(tree)}\n}`;

export default stylish;
