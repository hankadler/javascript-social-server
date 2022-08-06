# Social

A simple social-media express app

## Setup

### Node

This code uses ES6+ ``import/export`` syntax. To prevent errors do the following:

- When executing directly:

```sh
NODE_OPTIONS=--experimental-specifier-resolution=node NODE_NO_WARNINGS=1 node index.js
```

- When executing through IDE, include environment variables in run/debug configurations:

```sh
NODE_OPTIONS=--experimental-specifier-resolution=node;NODE_NO_WARNINGS=1  # run config
NODE_OPTIONS=--experimental-vm-modules;NODE_NO_WARNINGS=1  # test config
```

### Config

1. Create ``.env`` file in the project's root directory.

2. Set the following constants:

   - ``MONGO_DB_URI`` - e.g. ``mongodb://localhost:27017``
   - ``JWT_SECRET`` - jsonwebtoken secret key
   - ``EMAIL_USER`` - address from which to send app emails
   - ``EMAIL_PASS`` - email account password
   - ``EMAIL_HOST`` - e.g. ``smtp.office365.com``
   - ``EMAIL_PORT`` - e.g. ``587``

> outlook suggested over gmail, since gmail no longer allows direct nodemailer connection

3. Revise ``config.js`` values as needed.

## Usage

```sh
npm i  # install dependencies
npm start  # run app
```
