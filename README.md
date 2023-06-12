<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
https://docs.nestjs.com/  documentation of the Nestjs

## Installation

```bash

$ npm install

If the nestjs is not instelled on the computer 
$ npm install -g @nestjs/cli

Be sure to check the version of "@nestjs/common" and "@nestjs/core". It should be "^8.0.0". 
If version : "^9.0.0" is automatically installed: uninstall exit 
$ npm uninstall @nestjs/common^9.0.0
$ npm uninstall @nestjs/core^9.0.0
And install version 8
$ npm install @nestjs/common^8.0.0
$ npm install @nestjs/core^8.0.0
```

## Information on Prisma integration

```bash
https://docs.nestjs.com/recipes/prisma

```

## Applications (orders) received from the database

```bash
mysql: https://drive.google.com/file/d/1_5elESLEi3Lb_QFgDoo2NNsiP-n5O0Ow/view?
usp=sharing

```

## Folder Structure:

prisma:

migrations: Prisma Migrate generates SQL migration files for your declarative data model definition in the Prisma schema.

schema.prisma: Table for the database.

src: 

   auth: Everything you need to register, log in adn guard.

   core: General purpose files for the project are placed here.

   orders: Serving the module: 'orders' entity through the 'CRUD' script.

   users: Serving the module: 'users' entity through the 'CRUD' script.

   main: The central file from which the API is launched.

   Final-Project.postman_collection.json: Collection of the Postman json format. 


## Running the app

```bash
# watch mode
$ npm run start:dev

```

## Postman

In file 'Final-Project.postman_collection.json' contains a working collection of request for the project


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
