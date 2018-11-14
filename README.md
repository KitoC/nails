### Problem/solution

---

At Coder Academy we learned how to use Ruby on Rails (RoR), React, and NodeJS.

I really enjoyed the development experience of RoR, using the command line to generate generic templates of code, migrations and perform database operations form the command line. But when it came to learning React and NodeJS I enjoyed the freshness of a newer technology and more dynamic UI (with React) and I enjoyed the freedom of having control over how the architecture of the NodeJS backend played out and being able to separate front end from backend.

I took on the challenge of building a full stack framework for Javascript (JS) because I could see how powerful RoR was with the ability of rapidly generating applications and I wanted to create a similar experience with a JS framework.

Nails is an attempt at creating a solution and adding to the growing open source pool of frameworks and packages of the Javascript community. It is my attempt at creating a solid software architecture that is tightly integrated with a framework that helps you easily and rapidly generate boiler plate code and perform database operations from the command line.

With future iterations I plan to add more features to make the framework more robust and powerful and a valuable tool for the JS community to make use of.

### Choices I made in the design process of this project

---

This project has been an iterative process of figuring how to structure my code efficiently to make it easily understandable and as dry as possible. I enjoy creating software and apps that are modular in nature. I have had to firstly build up a complete folder/file structure for both BE and FE as a template for the nails app to be able to generate apps. I then had to figure out how to make it modular enough that I could run generations on the command line and have whatever is generated from the Nails framework plug in easily to the application structure.

A particular challenge has been integrating and maintaining database operations to keep the application in line with the migrations that have been generated and run. To address this problem I created an ORM that currently only works with Postgres and Sqlite but will in the future support more database adaptors such as MongoDB and Mysql. Hammered (the ORM I created) provides an interface that the Nails framework can use to create/drop tables, add/remove columns, drop the whole database and then create table models/classes from with generalised methods that are tailored to the database being used. e.g. `Posts.create()` will create an entry for any of the database types integrated with Hammered.

**Nails is a WIP. There are definitely going to be bugs in the code, refactors that need to be made and unused code lying around from previous attempts at getting the framework to work properly.**

### Usage

---

If you would like to see it in action, please follow these steps:

1. clone the repo
2. run `yarn` or `npm install` (NOTE: it only works with Node v10 currently)
3. run `npm link` in the nails root directory (so you can run the commands globally)

Now you should (hopefully) be able to run the nails commands from terminal.

To generate an app.

1. cd into the directory where to want to generate the app
2. run `nails create <project_name>` from terminal (this will copy the application structure from Nails into your chose project name's directory)
3. cd into `server` && `client` and run yarn to install the packages.
4. spin up the server with `nodemon` and the client with `yarn start`
5. Now that you have the application running you can see how when you create new models and migrate them, it updates the client dynamically using web sockets.

To scaffold a model

1. From the root directory of your project run `nails g scaffold <model_name> <column_name>:<data_type>` e.g. `nails g scaffold posts title:text body:text` (note: not all datatypes have properly been tested witht he new Hammered ORM yet.)
2. run `nails db migrate` and the table will be created and relevant files will be copied form Nails into your project directory.

Other commands that are currently working

1. `nails g model <model_name> <column_name>:<data_type>`
2. `nails g migration addColumnsTo<model_name> <column_name>:<data_type>` e.g. `nails g migration addColumnsToPosts likes:number`
3. `nails db rollback` (rolls back 1 migration at a time)
4. `nails db rollback step=n` rolls back however many migrations determined by the steps you provide
