# Java REST API Assessment Project

A professional Java workspace demonstrating REST API consumption with automated build tasks and proper dependency management.

![Java](https://img.shields.io/badge/Java-17+-orange.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-Workspace-blue.svg)
![Gson](https://img.shields.io/badge/Gson-2.13.1-green.svg)

## Project Overview

This project showcases a complete Java development environment with:
- REST API integration using Gson for JSON parsing
- Automated VS Code build tasks for seamless development
- Professional workspace configuration
- Clean dependency management

## Features

- **REST API Consumption**: Fetches and processes JSON data from external APIs
- **JSON Processing**: Uses Gson library for robust JSON parsing and object mapping
- **Automated Build Tasks**: One-click compilation and execution via VS Code tasks
- **Professional Setup**: Clean workspace with proper classpath configuration

## Project Structure
assessment/
├── Main.java                 # Main application entry point
├── gson-2.13.1.jar          # Gson dependency for JSON processing
├── .vscode/
│   ├── tasks.json           # Automated build and run tasks
│   ├── settings.json        # VS Code workspace settings
│   └── launch.json          # Debug configuration
└── README.md                # This file

## Prerequisites

- Java 17 or higher
- VS Code with Java Extension Pack
- Internet connection for API requests

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd assessment

2. Open in VS Code
code .

3. Run the Application
Option A: Using VS Code Tasks (Recommended)

Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)
Type "Tasks: Run Task"
Select "Run Java with Gson"

Option B: Command Line
java -cp .:gson-2.13.1.jar Main

VS Code Integration
Automated Tasks
The project includes pre-configured tasks for seamless development:

Compile Java with Gson: Compiles the project with proper classpath
Run Java with Gson: Executes the compiled application
Clean Build: Removes compiled files for fresh builds

Workspace Configuration

Automatic classpath resolution for external dependencies
Clean import organization
Integrated terminal execution
Professional development environment

Code Structure
Main.java
The main application demonstrates:

HTTP client implementation for REST API calls
JSON response parsing using Gson
Error handling and resource management
Clean, readable code structure

Key Implementation Details

Uses HttpURLConnection for HTTP requests
Implements proper exception handling
Demonstrates object-oriented JSON parsing
Professional coding practices and documentation

Development Workflow

Write Code: Edit Java files with full IDE support
Build: Use automated tasks for compilation
Run: Execute with one-click task execution
Debug: Set breakpoints and use integrated debugging
Version Control: Git integration for professional workflow

Interview Highlights
This project demonstrates several professional development practices:

Automated Workflows: Eliminates manual build processes
Dependency Management: Clean external library integration
IDE Optimization: Professional VS Code workspace setup
Code Quality: Clean, maintainable, and well-documented code
Version Control: Proper Git repository structure

Technical Stack

Language: Java 17+
JSON Library: Gson 2.13.1
HTTP Client: Java built-in HttpURLConnection
IDE: VS Code with Java Extension Pack
Build System: Custom VS Code tasks
Version Control: Git

API Integration
The application demonstrates REST API consumption by:

Making HTTP GET requests to external APIs
Processing JSON responses
Extracting and displaying specific data fields
Handling network errors gracefully

Professional Setup Features

No Manual Compilation: Automated build tasks handle all compilation
Clean Workspace: No red squiggles or import errors
Consistent Builds: Reliable execution across different environments
Professional Structure: Well-organized project layout

Future Enhancements
Potential improvements for production use:

Configuration file for API endpoints
Enhanced error handling and logging
Unit tests and integration tests
Docker containerization
CI/CD pipeline integration

Contact
This project was created as part of a technical assessment, demonstrating professional Java development practices and modern IDE workflow optimization.