# xText
## Context Engineering Framework for AI-Driven Development

**Created by Gregory Reeves, Inkwell Technology Studios**

> "Context engineering is the delicate art and science of filling the context window with just the right information for the next step." - Andrej Karpathy

This template provides a comprehensive context engineering framework for Claude Code to build applications from start to finish. It's based on industry best practices from leaders like Andrej Karpathy, Tobi Lütke (Shopify CEO), and methodologies from successful AI-first companies.

## 🎯 Core Philosophy

**Context Engineering > Prompt Engineering**

Instead of clever prompts, we focus on providing:
- Complete and structured context
- The right information at the right time
- Appropriate tools and resources
- Clear success criteria
- Self-validation capabilities

## 📁 Template Structure

```
xText/
├── .claude/                    # Claude-specific configurations
│   ├── CLAUDE.md              # Global AI assistant rules
│   └── commands/              # Context commands
├── PRPs/                      # Product Requirements Prompts
│   ├── templates/             # Reusable PRP templates
│   └── examples/              # Example PRPs
├── context/                   # Dynamic context management
│   ├── project-init.md        # Project initialization context
│   ├── architecture.md        # Architecture patterns
│   ├── implementation.md      # Implementation guidelines
│   └── deployment.md          # Deployment workflows
└── INITIAL.md                 # Entry point template
```

## 🚀 Quick Start

1. **Initialize a new project:**
   ```bash
   # Copy this template to your project directory
   cp -r xText/* your-project/
   
   # Open with Claude Code
   claude-code your-project/
   ```

2. **Provide your app idea:**
   ```
   "I want to build a [TYPE] app that [DESCRIPTION]"
   ```

3. **Claude Code will:**
   - Analyze your requirements
   - Generate a comprehensive PRP (Product Requirements Prompt)
   - Create the project structure
   - Implement features iteratively
   - Test and validate each component
   - Deploy your application

## 📋 Key Components

### 1. Product Requirements Prompt (PRP)
A comprehensive template that includes:
- Project context and constraints
- User stories and success criteria
- Technical specifications
- Implementation roadmap
- Self-validation checkpoints

### 2. Context Window Management
Following Karpathy's "LLM as OS" metaphor:
- **LLM = CPU**: Processing engine
- **Context Window = RAM**: Working memory
- **PRP = Program**: Instructions to execute

### 3. 12-Factor Agentic Apps
Adapting the classic methodology for AI:
1. Domain-specific models
2. Model optionality
3. Tools integration
4. Actions definition
5. Coordination patterns
6. Memory management (short & long-term)
7. Organizational knowledge
8. Authentication
9. Inference logging
10. Trace management
11. Evaluation metrics
12. Continuous improvement

## 🔧 How It Works

### Phase 1: Context Gathering
Claude Code will:
- Extract requirements using the INITIAL.md template
- Identify constraints and dependencies
- Define success criteria
- Select appropriate technology stack

### Phase 2: PRP Generation
- Create a detailed Product Requirements Prompt
- Include self-validation capabilities
- Define iterative implementation steps
- Establish quality gates

### Phase 3: Implementation
- Follow the PRP systematically
- Use context-aware development
- Implement features incrementally
- Validate at each checkpoint

### Phase 4: Deployment
- Automated testing and validation
- Environment configuration
- Production deployment
- Documentation generation

## 💡 Best Practices

1. **Be Specific**: The more context you provide, the better the output
2. **Use Examples**: Include examples of desired behavior
3. **Define Constraints**: Specify technical limitations upfront
4. **Iterate**: Use the self-validation loops to refine
5. **Trust the Process**: Let Claude Code follow the systematic approach

## 📚 Based On

- **Andrej Karpathy's** Software 3.0 vision
- **Tobi Lütke's** context engineering principles at Shopify
- **Cole Medin's** Context Engineering Template
- **12-Factor Apps** methodology adapted for AI

## 🤝 Contributing

This template is designed to evolve. Contributions welcome:
- Improve PRP templates
- Add domain-specific contexts
- Share successful patterns
- Report issues and limitations

## 📄 License

MIT License - Use freely in your projects

---

**xText** - Created by Gregory Reeves, Inkwell Technology Studios

*"Most agent failures are not model failures anymore, they are context failures."*

Start building better apps with better context. 🚀