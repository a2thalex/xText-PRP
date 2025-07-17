#!/usr/bin/env node
import { FloSho } from './index.js';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';

const program = new Command();

program
  .name('xtext-flosho')
  .description('xText-PRP FloSho Visual Testing')
  .version('2.0.0');

program
  .command('test <name>')
  .description('Run a FloSho test flow')
  .option('-u, --url <url>', 'Starting URL', 'http://localhost:3000')
  .action(async (name, options) => {
    const spinner = ora(`Testing "${name}"...`).start();
    
    try {
      const flosho = new FloSho(name);
      await flosho.init();
      
      await flosho.flow(name, [
        { action: 'navigate', url: options.url, description: 'Navigate to application' },
        { action: 'screenshot', name: 'initial', description: 'Initial state' }
      ]);
      
      await flosho.done();
      spinner.succeed(`FloSho test "${name}" complete!`);
    } catch (error) {
      spinner.fail('Test failed');
      console.error(error);
    }
  });

program.parse();