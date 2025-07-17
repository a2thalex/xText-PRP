// FlowRecorder - Captures screenshots and generates flow documentation
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

export class FlowRecorder {
  constructor(flosho) {
    this.flosho = flosho;
    this.flows = [];
    this.screenshots = [];
  }

  async recordFlow(flowName, steps) {
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
        step.description,
        step.highlightSelector
      );
      
      // Execute step
      const result = await this.executeStep(step);
      
      // Capture after state
      const afterShot = await this.captureScreenshot(
        `${flowName}-step${stepNum}-after`,
        `After: ${step.description}`,
        step.annotate
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

  async executeStep(step) {
    const startTime = Date.now();
    
    try {
      const page = this.flosho.page;
      
      switch (step.action) {
        case 'navigate':
          await page.goto(step.url, { waitUntil: 'networkidle' });
          break;
          
        case 'click':
          await page.click(step.selector);
          if (step.waitAfter) {
            await page.waitForTimeout(step.waitAfter);
          }
          break;
          
        case 'fill':
          await page.fill(step.selector, step.value);
          break;
          
        case 'select':
          await page.selectOption(step.selector, step.value);
          break;
          
        case 'hover':
          await page.hover(step.selector);
          break;
          
        case 'press':
          await page.press(step.selector || 'body', step.key);
          break;
          
        case 'upload':
          await page.setInputFiles(step.selector, step.files);
          break;
          
        case 'wait':
          if (step.selector) {
            await page.waitForSelector(step.selector, { timeout: step.timeout || 30000 });
          } else {
            await page.waitForTimeout(step.duration || 1000);
          }
          break;
          
        case 'waitForNavigation':
          await page.waitForNavigation();
          break;
          
        case 'expect':
          const element = await page.$(step.selector);
          if (!element) throw new Error(`Element not found: ${step.selector}`);
          
          if (step.property === 'text' || !step.property) {
            const text = await element.textContent();
            if (text !== step.value) {
              throw new Error(`Expected "${step.value}" but got "${text}"`);
            }
          }
          break;
          
        case 'screenshot':
          // Screenshot only, no other action
          break;
          
        case 'custom':
          await step.execute(page);
          break;
      }
      
      return {
        success: true,
        duration: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  async captureScreenshot(name, description, options = {}) {
    const timestamp = Date.now();
    const sanitizedName = name.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const filename = `${sanitizedName}-${timestamp}.png`;
    const filepath = path.join(this.flosho.options.outputDir, 'screenshots', filename);
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    
    const page = this.flosho.page;
    
    // Add description overlay
    if (description) {
      await page.evaluate((desc) => {
        const existing = document.getElementById('flosho-overlay');
        if (existing) existing.remove();
        
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
          font-weight: 500;
          z-index: 999999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          max-width: 300px;
        `;
        overlay.textContent = desc;
        document.body.appendChild(overlay);
      }, description);
    }
    
    // Highlight element if specified
    if (options === true || options.highlight || (typeof options === 'string')) {
      const selector = typeof options === 'string' ? options : options.highlight || options;
      await page.evaluate((sel) => {
        const element = document.querySelector(sel);
        if (element) {
          element.style.outline = '3px solid #FF1744';
          element.style.outlineOffset = '2px';
          element.setAttribute('data-flosho-highlighted', 'true');
        }
      }, selector);
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: filepath, 
      fullPage: options.fullPage || false,
      animations: 'disabled'
    });
    
    // Clean up
    await page.evaluate(() => {
      const overlay = document.getElementById('flosho-overlay');
      if (overlay) overlay.remove();
      
      const highlighted = document.querySelector('[data-flosho-highlighted]');
      if (highlighted) {
        highlighted.style.outline = '';
        highlighted.style.outlineOffset = '';
        highlighted.removeAttribute('data-flosho-highlighted');
      }
    });
    
    const screenshot = {
      filename,
      filepath,
      description,
      timestamp,
      url: page.url()
    };
    
    this.screenshots.push(screenshot);
    return screenshot;
  }

  async generateFlowDoc(flow) {
    const flowName = flow.name.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const docPath = path.join(
      this.flosho.options.outputDir, 
      'user-manual', 
      `${flowName}.md`
    );
    
    const markdown = `# ${flow.name}

*Generated: ${new Date(flow.timestamp).toLocaleString()}*  
*Duration: ${(flow.duration / 1000).toFixed(2)}s*  
*Status: ${flow.status === 'passed' ? '✅ Passed' : '❌ Failed'}*

## Flow Overview

This flow tests the ${flow.name} functionality with ${flow.steps.length} steps.

## Detailed Steps

${flow.steps.map(step => `
### Step ${step.number}: ${step.description}

**Action:** \`${step.action}\`  
**Result:** ${step.result === 'Success' ? '✅ Success' : `❌ ${step.result}`}  
**Duration:** ${step.duration}ms

#### Before State
![Before State](../screenshots/${step.beforeImage.filename})

#### After State
![After State](../screenshots/${step.afterImage.filename})

---
`).join('\n')}

## Flow Diagram

\`\`\`mermaid
graph LR
    Start([Start])
${flow.steps.map((step, i) => {
  const node = `    Step${i + 1}[${step.description}]`;
  const edge = i === 0 ? `    Start --> Step1` : `    Step${i} --> Step${i + 1}`;
  return i === 0 ? `${node}\n${edge}` : node;
}).join('\n')}
    Step${flow.steps.length} --> End([End])
\`\`\`

## Summary

- **Total Steps:** ${flow.steps.length}
- **Successful:** ${flow.steps.filter(s => s.result === 'Success').length}
- **Failed:** ${flow.steps.filter(s => s.result !== 'Success').length}
- **Total Duration:** ${(flow.duration / 1000).toFixed(2)}s
- **Average Step Time:** ${(flow.duration / flow.steps.length / 1000).toFixed(2)}s

---

*Documentation generated by FloSho for xText-PRP*
`;

    await fs.mkdir(path.dirname(docPath), { recursive: true });
    await fs.writeFile(docPath, markdown);
  }

  async generateDocumentation() {
    if (this.flows.length === 0) return;
    
    const mainDoc = `# ${this.flosho.projectName} - User Manual

*Generated by FloSho on ${new Date().toLocaleString()}*

## Overview

This documentation was automatically generated from ${this.flows.length} test flows containing ${this.screenshots.length} screenshots.

## Test Flows

${this.flows.map(flow => {
  const flowFile = `${flow.name.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}.md`;
  return `### [${flow.name}](${flowFile})

- **Status:** ${flow.status === 'passed' ? '✅ Passed' : '❌ Failed'}
- **Steps:** ${flow.steps.length}
- **Duration:** ${(flow.duration / 1000).toFixed(2)}s
- **Key Actions:** ${[...new Set(flow.steps.map(s => s.action))].join(', ')}
`;
}).join('\n')}

## Quick Navigation

${this.flows.map(flow => 
  `- [${flow.name}](${flow.name.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}.md)`
).join('\n')}

## Screenshot Gallery

### Key Screenshots

${this.screenshots.slice(0, 10).map(shot => 
  `![${shot.description}](screenshots/${shot.filename})\n*${shot.description}*\n`
).join('\n')}

## Statistics

- **Total Flows:** ${this.flows.length}
- **Total Steps:** ${this.flows.reduce((sum, f) => sum + f.steps.length, 0)}
- **Total Screenshots:** ${this.screenshots.length}
- **Success Rate:** ${Math.round(
    (this.flows.filter(f => f.status === 'passed').length / this.flows.length) * 100
  )}%

---

*Built with FloSho - Visual Testing Framework for xText-PRP*
`;

    const docPath = path.join(this.flosho.options.outputDir, 'user-manual', 'README.md');
    await fs.mkdir(path.dirname(docPath), { recursive: true });
    await fs.writeFile(docPath, mainDoc);
    
    console.log(chalk.magenta(`\n📖 Documentation generated: ${docPath}`));
  }
}