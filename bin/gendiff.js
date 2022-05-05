#!/usr/bin/env node

console.log('Hi')


import { Command } from 'commander';


const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1', '-V, --version', 'output the version number')
  .option('-f, --format <type>', 'output format')


export default program.parse();