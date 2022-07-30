# API testing on GoRest.io

Find information above for running tests

Node.js v16.14.2 version and version 9.7.0 of Cypress are used

## Setup

## 1. Dependencies

Install [Node.js.](https://nodejs.org/en/)
#### Install the dependencies using
 ```
npm install
 ```

## 2. Data Base Information
#### You should have installed MySQL DB at your local machine.
#### For connection to Data Base, use the following command in MySQL command line:
 ```shell
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
 ```

## 2. Run tests using
#### Run tests in UI mode
 ```shell
npx cypress open
 ```
#### Run tests in Headless mode
 ```shell
npx cypress run
 ```