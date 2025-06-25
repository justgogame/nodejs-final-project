# Challenge Tracker

A full-featured server-rendered web application that allows users to create, manage, and track progress on personal challenges. Built with Node.js, Express, MongoDB and EJS.

## Features

- User registration and login (with Passport & bcrypt)
- Create and edit personal challenges
- Log daily progress entries per challenge
- View detailed challenge stats (average and remaining progress)
- Access control: only challenge owners can manage their data
- Public/private toggle for challenges
- Filter to view all or only active (incomplete) challenges
- Flash messages for success and error feedback
- Secure routing and CSRF protection
- Fully deployed to Render.com

## Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- Passport.js for authentication
- EJS for server-side rendering
- express-validator for validation
- dotenv for env variables
- connect-flash for messages
- helmet & xss-clean for basic security

## Folder Structure

```
nodejs-final-project/
│
├── controllers/         # Business logic (auth, challenges, entries)
├── middleware/          # Custom middleware (auth, flash)
├── models/              # Mongoose models (User, Challenge, Entry)
├── node_modules/
├── passport/            # Passport configuration
├── public/              # Static assets (style.css)
├── routes/              # Express routers
├── views/               # EJS templates
│   ├── auth/            # Login and registration views
│   ├── challenges/      # Challenge CRUD and detail views
│   └── public/          # Public challenge list
├── .env                 # Environment variables (not committed)
├── .gitignore           # Ignored files and folders
├── app.js               # Main app file
├── package.json
├── package-lock.json
└── README.md            # Project documentation
```

## Environment Variables

Create a `.env` file and define:

```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

## Author

Made by Aleksandr Bogomolov [\[linkedin\]](https://www.linkedin.com/in/1alexbogomolov/)
