# Fusion Frontend

## Overview
This Project is the frontend of the Fusion - IIITDMJ's ERP Portal. We've migrated the frontend of fusion from Django templates to a modern React-based architecture.

## ## Tech Stack

- [ReactJS](https://react.dev/learn) as the main frontend library
- [Mantine UI](https://mantine.dev/getting-started/) for UI components
- [Redux](https://redux-toolkit.js.org/introduction/getting-started) for state management
- [Phosphor-icons](https://phosphoricons.com/) for icons
- [Mantine-React-Table](https://v2.mantine-react-table.com/docs/examples/basic) for tables

Check the `package.json` file for more information about all the libraries being used.
This project is using Eslint and Prettier for linting and formatting the code.

## Setting up the project 🛠️

1. Fork the repository
2. Clone **your forked** repository
3. Change directory to the project folder(`cd path/to/project`)
4. Run `npm install` to install all the dependencies
5. Run `npm run dev` to start the development server.
   The development server will start at `http://localhost:5173/`

Make sure that your backend server is running properly before starting the frontend server.

## Project Structure and important information

1. All the required assets(images, audio, videos) for the project are in the `src/assets` folder.
2. The routes for all the web pages are defined in the `src/App.jsx` file.
3. All the API routes are stored as constants in the `src/routes/api_routes.jsx` file.
4. Only the **global** components are in the `src/components` folder.
5. Only the **global** web pages are in the `src/pages` folder.
6. All the web pages related to a a **module** are in `src/modules/<module-name>` folder.
7. All the components related to a **module** are in the `src/modules/<module-name>/components` folder.
8. All the styles related to a **module** are in the `src/modules/<module-name>/styles` folder.
9. All the state management related code is in the `src/redux` folder. The `src/redux/userSlice.jsx` file contains user-related states. 

- Note: You can access the username and role of the user using the `useSelector` hook.

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
}
```

- For styles, you can use the `mantine` library for components and css-modules for custom styles(Refer this [guide](https://mantine.dev/styles/css-modules/)).

## Style Guide

- All the folder names should be in kebab-case.
- All the file names should be in camelCase.
- All the constants should be in UPPERCASE.

**Note**: Please make sure to follow the project structure and naming conventions while adding new files or folders to the project.

