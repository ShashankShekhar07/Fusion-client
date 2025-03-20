# Fusion Frontend

## Overview
This Project is the frontend of Fusion - IIITDMJ's ERP Portal. We've migrated the frontend of Fusion from Django templates to a modern React-based architecture.

## Tech Stack

- [ReactJS](https://react.dev/learn) as the main frontend library
- [Mantine UI](https://mantine.dev/getting-started/) for UI components
- [Redux](https://redux-toolkit.js.org/introduction/getting-started) for state management
- [Phosphor-icons](https://phosphoricons.com/) for icons
- [Mantine-React-Table](https://v2.mantine-react-table.com/docs/examples/basic) for tables

Check the `package.json` file for more information about all the libraries being used.
This project is using Eslint and Prettier for linting and formatting the code.

## Team Members

- **Shashank Shekhar (22BCS226)** - Team Lead

### Frontend
- **Guntupalli Venkateswarlu (22BCS097)**
- **Piyush Bihani (22BCS187)**
-  **Sunil Kumar (22BCS244)**

### Backend
- **Jatothu Arun (22BCS113)**
- **Himanshu (22BCS107)**

### Android Development
- **Tawade Ashish Pradip Kumar (22BCS250)**
- **Ritik Kumar (22BCS212)**
- **Somawanshi Pranav Prakash (22BCS235)**

### FusionX
- **Sunil Kumar (22BCS244)**
- **Pappala Pavan Kumar (22BCS180)**

*Previous team member: Anitesh Pandey (22BCS032)*

## Setting up the project 🛠️

1. Fork the repository
2. Clone **your forked** repository
3. Change directory to the project folder (`cd path/to/project`)
4. Run `npm install` to install all the dependencies
5. Run `npm run dev` to start the development server.
   The development server will start at `http://localhost:5173/`

Make sure that your backend server is running properly before starting the frontend server.

## Project Structure and Important Information

1. All the required assets (images, audio, videos) for the project are in the `src/assets` folder.
2. The routes for all the web pages are defined in the `src/App.jsx` file.
3. All the API routes are stored as constants in the `src/routes/api_routes.jsx` file.
4. Only the **global** components are in the `src/components` folder.
5. Only the **global** web pages are in the `src/pages` folder.
6. All the web pages related to a **module** are in `src/modules/<module-name>` folder.
7. All the components related to a **module** are in `src/modules/<module-name>/components` folder.
8. All the styles related to a **module** are in the `src/modules/<module-name>/styles` folder.
9. All the state management-related code is in the `src/redux` folder. The `src/redux/userSlice.jsx` file contains user-related states.

### Usage Example:

You can access the username and role of the user using the `useSelector` hook.

```jsx
import { useSelector } from 'react-redux';

const ExampleComponent = () => {
  const role = useSelector(state => state.user.role);
  const username = useSelector(state => state.user.username);
  return (
    <div>
      {username}
      {role}
    </div>
  );
};
```

- For styles, you can use the `mantine` library for components and css-modules for custom styles (Refer to this [guide](https://mantine.dev/styles/css-modules/)).

## Style Guide

- All the folder names should be in kebab-case.
- All the file names should be in camelCase.
- All the constants should be in UPPERCASE.

**Note**: Please make sure to follow the project structure and naming conventions while adding new files or folders to the project.

## Module-Specific Information: Purchase Module

### Purpose
The Purchase module aims to streamline the process of indent filing, approval, and procurement. It shifts the traditional paperwork-based process to a digital platform, enhancing efficiency and user experience.

### Features

1. **Indent Filing:**
   - Allows indenters to file a proposal for procurement, save drafts, and track submission status.
   - Error validation for compulsory fields.

2. **Approval Workflow:**
   - Section/Department Heads can approve or reject submitted indents with remarks.
   - Director can review, approve, or reject indents and bills.

3. **Bill Processing:**
   - Purchase Officer and Account Admin handle bill review and final payment processing.

4. **Notifications:**
   - Real-time email and SMS notifications for approval status updates.

### Detailed Use Cases

#### Indent Filing
- **Actor:** Indenter
- **Flow:**
  - Indenter logs in and accesses the dashboard.
  - Options are presented to file a new indent or track previous submissions.
  - Errors are shown if mandatory fields are left unfilled.
  - Once submitted, the indent status is updated in the database.

#### Approval Process
- **Actors:**
  - Section/Department Head: Reviews indents and adds remarks.
  - Director: Final approval for indent and bill processing.
- **Flow:**
  - Indents are passed through hierarchical approval stages.
  - Notifications are sent at each stage of approval.

#### Bill Review and Approval
- **Actors:**
  - Purchase Officer: Reviews bills for discrepancies.
  - Director: Provides final bill approval.
- **Flow:**
  - Bills are reviewed for accuracy and completeness.
  - Approved bills are sent to Account Admin for processing.

### Non-Functional Requirements

- **Performance:** Must handle up to 1000 concurrent users.
- **UI/UX:** Ensure a user-friendly experience with real-time updates (response time < 2 seconds).
- **Compatibility:** Supports modern versions of iOS and Android.
- **Logging:** Comprehensive logs for debugging and audits.

### Integration Dependencies

- **APIs:** `addStockEntry` for stock details integration.
- **Modules:** Seamless connection with the File Tracking module.

### Communication Interfaces

- **Notifications:**
  - Real-time email and SMS updates for status changes.
- **External Interfaces:**
  - Integration with stock and file tracking systems.

For additional details, refer to the SRS documentation.

