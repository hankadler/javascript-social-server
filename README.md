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

   - ``APP`` - app/api name
   - ``VERSION`` - app/api version, must match a directory in ``src/api``
   - ``ENV`` - ``dev``, ``test`` or ``prod``
   - ``HOST`` - app/api url, valid only in prod
   - ``PORT`` - app/api server port, e.g. ``3000``
   - ``MONGO_DB_URI`` - e.g. ``mongodb://localhost:27017``
   - ``JWT_SECRET`` - jsonwebtoken secret key
   - ``JWT_EXPIRES_IN`` - jsonwebtoken expiration time, e.g. ``1h``
   - ``COOKIE_MAX_AGE`` - expiration in seconds for cookie storing jwt, e.g. ``3600`` for 1h
   - ``EMAIL_USER`` - address from which to send app emails
   - ``EMAIL_PASS`` - email account password
   - ``EMAIL_HOST`` - e.g. ``smtp.office365.com``
   - ``EMAIL_PORT`` - e.g. ``587``
   - ``FAKE_PASS`` - password to give to fake users created with ``/tests/utils/setupDB.js``

> outlook suggested over gmail, since gmail no longer allows direct nodemailer connection

## Usage

```sh
npm i  # install dependencies
npm start  # run app
```
