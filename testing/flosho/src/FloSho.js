import { chromium } from 'playwright';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { FlowRecorder } from './FlowRecorder.js';
import { APIVisualizer } from './APIVisualizer.js';
import { TestGenerator } from './TestGenerator.js';

export class FloSho {
  constructor(projectName, options = {}) {
    this.projectName = projectName;
    this.options = {
      outputDir: options.outputDir || './testing/flosho-docs',
      viewport: options.viewport || { width: 1280, height: 720 },
      headless: options.headless ?? false,
      slowMo: options.slowMo || 50,
      ...options
    };
    
    this.browser = null;
    this.page = null;
    this.recorder = new FlowRecorder(this);
    this.apiViz = new APIVisualizer(this);
    this.generator = new TestGenerator(this);
  }

  async init() {
    console.log(chalk.blue.bold(`\n🌊 FloSho Testing - ${this.projectName}\n`));
    
    this.browser = await chromium.launch({
      headless: this.options.headless,
      slowMo: this.options.slowMo
    });
    
    const context = await this.browser.newContext({
      viewport: this.options.viewport,
      recordVideo: {
        dir: path.join(this.options.outputDir, 'videos'),
        size: this.options.viewport
      }
    });
    
    // Intercept API calls for documentation
    await context.route('**/api/**', async (route, request) => {
      console.log(chalk.gray(`API Call: ${request.method()} ${request.url()}`));
      await route.continue();
    });
    
    this.page = await context.newPage();
    console.log(chalk.green('✅ FloSho initialized - Ready to test!'));
  }

  async flow(flowName, steps) {
    return await this.recorder.recordFlow(flowName, steps);
  }

  async api(endpoint, tests) {
    return await this.apiViz.testAPI(endpoint, tests);
  }

  async auto(featureName) {
    return await this.generator.autoTest(featureName);
  }

  async setViewport(preset) {
    const viewports = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1280, height: 720 },
      wide: { width: 1920, height: 1080 }
    };
    
    const viewport = viewports[preset] || preset;
    await this.page.setViewportSize(viewport);
    console.log(chalk.cyan(`📱 Viewport changed to: ${viewport.width}x${viewport.height}`));
  }

  async done() {
    console.log(chalk.yellow('\n📝 Generating documentation...'));
    
    await this.recorder.generateDocumentation();
    await this.apiViz.generateAPIDocs();
    
    if (this.browser) {
      await this.browser.close();
    }
    
    console.log(chalk.green.bold('\n✨ FloSho testing complete!'));
    console.log(chalk.cyan(`📖 User Manual: ${this.options.outputDir}/user-manual/`));
    console.log(chalk.cyan(`📸 Screenshots: ${this.options.outputDir}/screenshots/`));
    console.log(chalk.cyan(`🎥 Videos: ${this.options.outputDir}/videos/`));
    
    // Generate summary
    const summary = {
      project: this.projectName,
      timestamp: new Date().toISOString(),
      flows: this.recorder.flows.length,
      screenshots: this.recorder.screenshots.length,
      apiTests: this.apiViz.apiTests.length,
      status: 'complete'
    };
    
    await fs.writeFile(
      path.join(this.options.outputDir, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );
  }
}