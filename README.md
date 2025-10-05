# This repository contains a test task for Frontend Developer 

Preview could see [here](https://basic-image-transformer.vercel.app/)
    
## Prerequisites
- Node.js v23 
- npm v10 
  
## Setup
```bash
npm install
```

## Run in development mode
```bash
npm run dev
```
# Full task description

## Implementation of transformation box

Imagine you have a preview zone in a video editor like ours, with some visual objects in it. Your task is to implement a “transformation” box that appears when you select one of these visual objects using the HTML Canvas API. The UI and design are up to the implementer.  
Video demo: [https://youtu.be/Adm8oMNCPIU](https://youtu.be/Adm8oMNCPIU)  
Lines that are marked with (\*) are optional. You can implement rotation if you have time or an interest for it.  
When the code is ready, please deploy it to GitHub as a private repository and give us access (romikzo, icune, imposibrus, chiefgreg).

### Functional requirements:

- Box should support dragging inside canvas  
- Box should support proportional scaling  
- Inside this box some sample image should be rendered for demonstration purpose  
- (\*) Box should support rotation relative to the center of the box

### Technical requirements:

- **No external libraries** should be used except Vue.js and browser API  
- TypeScript should be used  
- **Use of code-writing LLMs isn't encouraged**; however, you may consult LLMs for specific parts. The goal of this task is to test your personal thinking and coding skills.  
- Build system can be any or none, but if you will you use one, we recommend Vite and Vitests (as a test runner)  
- (\*) State of the application **should contain ONLY vertices** of the transformation box. That means storing vertices and rotation angle separately is not allowed. Rotation angle should be directly applied to coordinates of the box

### Things will be assessed:

- Readability of the code and clarity of intentions. That includes naming of vars and methods. Try to avoid comments and use proper naming and abstractions to show your objectives  
- Consistency across app’s code  
- Architectural decomposition. Even though it’s a simple task with a couple of fields in a state, consider implementing it like we plan to add a lot of other features later.  
- Decisions that affect performance (use of window.requestAnimationFrame as an example)

### Nice to have:

- Tests