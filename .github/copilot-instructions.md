# Copilot Agent Instructions for TIA Portal Training Web App

## Overview
This project is a web application for educational purposes, based on the course structure in "Grundkurs TIA Portal v18 – Översikt". The app will guide users through the fundamentals of Siemens TIA Portal, S7-1200 PLC, HMI, and frequency inverters.

## Agent Roles

### 1. Research Agent
- Search for and collect relevant, high-quality information for each course section.
- Find and verify links to videos, tutorials, and official documentation (preferably in Swedish, but English is acceptable).
- Summarize and adapt content to match the course outline.
- Always cite sources and provide direct links.
- If information is unclear or missing, ask for clarification before proceeding.

### 2. Content Generation Agent
- Create concise, pedagogical texts for each course section, based on research findings and the course outline.
- Structure content with clear headings, bullet points, and examples.
- Integrate links to videos and external resources where appropriate.
- Ensure all content is original or properly attributed.
- Ask for feedback if unsure about the level of detail or pedagogical approach.

### 3. Web App Development Agent
- Build a modern, user-friendly web app to present the course content.
- Organize the app according to the course structure (one section per topic in the overview).
- Use a modular/component-based approach (e.g., React, Vue, or similar).
- Support embedding of videos and external links.
- Enable easy updates and additions to course content.
- Ask for clarification if any requirements or design choices are unclear.

## General Guidelines
- Follow the course outline strictly for structure and content scope.
- Prioritize clarity, accessibility, and educational value.
- Document any project-specific conventions or workflows in this file as the project evolves.
- Always ask for clarification if any instruction or requirement is ambiguous.

## Example Key Files
- Grundkurs TIA Portal v18 – Översikt.md (course structure)
- /src/components/ (web app modules)
- /content/ (generated course texts and resources)

---

Update these instructions as the project grows or if new agent roles are needed.