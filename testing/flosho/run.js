import { FloSho } from './index.js';
import chalk from 'chalk';

async function runFloSho() {
  const mode = process.argv[2] || 'auto';
  const name = process.argv[3] || 'xText-PRP Feature';
  
  console.log(chalk.blue.bold('\nxText-PRP FloSho Testing System\n'));
  console.log(chalk.cyan(`Mode: ${mode}`));
  console.log(chalk.cyan(`Feature: ${name}\n`));

  const flosho = new FloSho(name);
  await flosho.init();

  try {
    switch (mode) {
      case 'flow':
        // Example user flow test
        await flosho.flow('Example User Flow', [
          {
            action: 'navigate',
            url: 'http://localhost:3000',
            description: 'Navigate to home page'
          },
          {
            action: 'screenshot',
            name: 'homepage',
            description: 'Homepage loaded'
          }
        ]);
        break;
        
      case 'api':
        // Example API test
        await flosho.api('/api/health', [
          {
            name: 'Health check',
            method: 'GET',
            expect: { status: 200 }
          }
        ]);
        break;
        
      case 'auto':
        // Auto-detect and test
        console.log(chalk.yellow('Auto-detection mode...'));
        // Would analyze recent changes and generate tests
        await flosho.flow('Auto-detected Flow', [
          {
            action: 'navigate',
            url: 'http://localhost:3000',
            description: 'Testing auto-detected features'
          }
        ]);
        break;
    }
    
    await flosho.done();
    
  } catch (error) {
    console.error(chalk.red(`\n❌ Testing failed: ${error.message}`));
    process.exit(1);
  }
}

runFloSho();