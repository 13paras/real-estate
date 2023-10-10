# REAL ESTATE

This is a web app that allows you to create, view, edit, and delete real estate listings. You can also log in and log out, and send emails to the owners of the listings you are interested in. This app mimics the working of other real estate websites.

This app is built with React + Vite, TailwindCSS, and Firebase. It uses Firebase Authentication, Firestore, Storage, and Functions to handle the backend functionality.

## Features

 - Log in and log out using Firebase Authentication
 - Create, view, edit, and delete listings using Firestore and Storage
 - Upload and display images for each listing
 - Filter listings by price, location, type, and features
 - Send emails to the owners of the listings using Firebase Functions
 - Protect routes based on the user’s authentication status

* ## Getting started
  To run this app locally, you need to have Node.js and npm installed on your machine. You also need to create a Firebase project and enable the services mentioned above. Then follow these steps:

1. To get started with this project, run

```bash
  https://github.com/13paras/react-estate.git
```

2. Navigate into the project directory:

    ```bash
    cd react-estate
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Create a .env file in the root folder and add your Firebase configuration variables

5. Start the development server:

    ```bash
    npm run dev
    ```

  ##  Demo
You can see a live demo of this app <a href="https://real-estate-azure-omega.vercel.app/" target="_blank" rel="noreferrer">here</a>.

## License

[MIT](https://choosealicense.com/licenses/mit/)
