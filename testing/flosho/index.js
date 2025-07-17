// xText-PRP FloSho Testing Framework
import { chromium } from 'playwright';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

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
    this.flows = [];
    this.apiTests = [];
    this.screenshots = [];
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
    
    this.page = await context.newPage();
    console.log(chalk.green('✅ FloSho initialized'));
  }

  async flow(flowName, steps) {
    console.log(chalk.blue(`\n📸 Recording Flow: ${flowName}\n`));
    
    const flow = {
      name: flowName,
      timestamp: new Date().toISOString(),
      steps: [],
      screenshots: [],
      duration: 0,
      status: 'running'
    };

    const startTime = Date.now();

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepNum = i + 1;
      
      console.log(chalk.cyan(`  Step ${stepNum}/${steps.length}: ${step.description}`));
      
      // Capture before state
      const beforeShot = await this.captureScreenshot(
        `${flowName}-step${stepNum}-before`,
        step.description
      );
      
      // Execute step
      const result = await this.executeStep(step);
      
      // Capture after state
      const afterShot = await this.captureScreenshot(
        `${flowName}-step${stepNum}-after`,
        `After: ${step.description}`
      );
      
      flow.steps.push({
        number: stepNum,
        description: step.description,
        action: step.action,
        beforeImage: beforeShot,
        afterImage: afterShot,
        result: result.success ? 'Success' : result.error,
        duration: result.duration
      });
      
      if (!result.success) {
        console.log(chalk.red(`    ❌ Failed: ${result.error}`));
        flow.status = 'failed';
        break;
      }
      
      console.log(chalk.green(`    ✅ Complete (${result.duration}ms)`));
    }

    flow.duration = Date.now() - startTime;
    flow.status = flow.status === 'running' ? 'passed' : flow.status;
    
    this.flows.push(flow);
    await this.generateFlowDoc(flow);
    
    return flow;
  }

  async api(endpoint, tests) {
    console.log(chalk.yellow(`\n🔌 Testing API: ${endpoint}\n`));
    
    const apiFlow = {
      endpoint,
      timestamp: new Date().toISOString(),
      tests: []
    };

    for (const test of tests) {
      console.log(chalk.cyan(`  Test: ${test.name}`));
      
      const startTime = Date.now();
      let result;
      
      try {
        const response = await axios({
          method: test.method || 'GET',
          url: `${test.baseURL || 'http://localhost:3000'}${endpoint}`,
          data: test.data,
          headers: test.headers || {},
          validateStatus: () => true
        });
        
        result = {
          success: test.expect ? response.status === test.expect.status : true,
          status: response.status,
          duration: Date.now() - startTime,
          request: test,
          response: {
            status: response.status,
            data: response.data
          }
        };
        
      } catch (error) {
        result = {
          success: false,
          error: error.message,
          duration: Date.now() - startTime
        };
      }
      
      // Create visual representation
      await this.createAPIVisual(test.name, endpoint, result);
      
      apiFlow.tests.push({ name: test.name, ...result });
      
      if (result.success) {
        console.log(chalk.green(`    ✅ Passed (${result.status}) - ${result.duration}ms`));
      } else {
        console.log(chalk.red(`    ❌ Failed: ${result.error || result.status}`));
      }
    }
    
    this.apiTests.push(apiFlow);
    return apiFlow;
  }

  async executeStep(step) {
    const startTime = Date.now();
    
    try {
      switch (step.action) {
        case 'navigate':
          await this.page.goto(step.url);
          break;
        case 'click':
          await this.page.click(step.selector);
          break;
        case 'fill':
          await this.page.fill(step.selector, step.value);
          break;
        case 'wait':
          if (step.selector) {
            await this.page.waitForSelector(step.selector);
          } else {
            await this.page.waitForTimeout(step.duration || 1000);
          }
          break;
        case 'screenshot':
          // Just screenshot, no action
          break;
      }
      
      return { success: true, duration: Date.now() - startTime };
    } catch (error) {
      return { success: false, error: error.message, duration: Date.now() - startTime };
    }
  }

  async captureScreenshot(name, description) {
    const timestamp = Date.now();
    const filename = `${name.replace(/[^a-z0-9-]/gi, '-')}-${timestamp}.png`;
    const filepath = path.join(this.options.outputDir, 'screenshots', filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    
    // Add description overlay
    if (description) {
      await this.page.evaluate((desc) => {
        const overlay = document.createElement('div');
        overlay.id = 'flosho-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-family: -apple-system, system-ui, sans-serif;
          font-size: 14px;
          z-index: 999999;
        `;
        overlay.textContent = desc;
        document.body.appendChild(overlay);
      }, description);
    }
    
    await this.page.screenshot({ path: filepath });
    
    // Remove overlay
    await this.page.evaluate(() => {
      const overlay = document.getElementById('flosho-overlay');
      if (overlay) overlay.remove();
    });
    
    const screenshot = { filename, filepath, description, timestamp };
    this.screenshots.push(screenshot);
    return screenshot;
  }

  async createAPIVisual(testName, endpoint, result) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; background: #0d1117; color: #c9d1d9; padding: 20px; margin: 0; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { background: #161b22; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .method { display: inline-block; padding: 4px 12px; border-radius: 4px; background: #1f6feb; color: white; font-weight: 600; }
    .endpoint { font-family: monospace; color: #58a6ff; margin-left: 10px; }
    .status { float: right; padding: 6px 16px; border-radius: 6px; background: ${result.success ? '#238636' : '#da3633'}; color: white; }
    .section { background: #161b22; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .code { background: #0d1117; padding: 16px; border-radius: 6px; font-family: monospace; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="method">${result.request?.method || 'GET'}</span>
      <span class="endpoint">${endpoint}</span>
      <span class="status">${result.status || 'ERROR'}</span>
    </div>
    <div class="section">
      <h3>Request</h3>
      <div class="code">${JSON.stringify(result.request?.data || {}, null, 2)}</div>
    </div>
    <div class="section">
      <h3>Response</h3>
      <div class="code">${result.response ? JSON.stringify(result.response.data, null, 2) : result.error}</div>
    </div>
  </div>
</body>
</html>`;

    const page = await this.browser.newPage();
    await page.setContent(html);
    
    const filename = `api-${testName.replace(/[^a-z0-9-]/gi, '-')}-${Date.now()}.png`;
    const filepath = path.join(this.options.outputDir, 'api-flows', filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await page.screenshot({ path: filepath, fullPage: true });
    await page.close();
  }

  async generateFlowDoc(flow) {
    const docPath = path.join(
      this.options.outputDir,
      'user-manual',
      `${flow.name.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}.md`
    );
    
    const markdown = `# ${flow.name}

*Generated: ${new Date(flow.timestamp).toLocaleString()}*  
*Status: ${flow.status === 'passed' ? '✅ Passed' : '❌ Failed'}*

## Steps

${flow.steps.map(step => `
### Step ${step.number}: ${step.description}

**Result:** ${step.result === 'Success' ? '✅ Success' : `❌ ${step.result}`}

![Before](../screenshots/${step.beforeImage.filename})
![After](../screenshots/${step.afterImage.filename})
`).join('\n')}

---
*Generated by xText-PRP FloSho*
`;

    await fs.mkdir(path.dirname(docPath), { recursive: true });
    await fs.writeFile(docPath, markdown);
  }

  async done() {
    // Generate main documentation
    if (this.flows.length > 0 || this.apiTests.length > 0) {
      const mainDoc = `# ${this.projectName} - Test Documentation

*Generated by xText-PRP FloSho on ${new Date().toLocaleString()}*

## User Flows

${this.flows.map(flow => `- [${flow.name}](./${flow.name.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}.md) - ${flow.status === 'passed' ? '✅' : '❌'}`).join('\n')}

## API Tests

${this.apiTests.map(api => `### ${api.endpoint}\n${api.tests.map(t => `- ${t.name}: ${t.success ? '✅' : '❌'}`).join('\n')}`).join('\n\n')}

## Screenshots

Total: ${this.screenshots.length} screenshots captured

---
*Built with xText-PRP + FloSho*
`;

      const docPath = path.join(this.options.outputDir, 'user-manual', 'README.md');
      await fs.mkdir(path.dirname(docPath), { recursive: true });
      await fs.writeFile(docPath, mainDoc);
    }
    
    if (this.browser) {
      await this.browser.close();
    }
    
    console.log(chalk.green.bold('\n✨ FloSho testing complete!'));
    console.log(chalk.cyan(`📖 Documentation: ${this.options.outputDir}/user-manual/`));
    console.log(chalk.cyan(`📸 Screenshots: ${this.options.outputDir}/screenshots/`));
  }
}

export default FloSho;