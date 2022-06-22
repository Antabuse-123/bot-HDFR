# Bot HDFR

- [Bot HDFR](#bot-hdfr)
  - [Description](#description)
  - [Features](#features)
  - [Setup](#setup)
    - [Docker](#docker)
    - [bare-metal](#bare-metal)
  - [Contributting](#contributting)
    - [How to contribute](#how-to-contribute)
      - [By doing a pull request](#by-doing-a-pull-request)
      - [By creating an issue](#by-creating-an-issue)
  
## Description

This is yet another discord bot. This ons has been created for the discord server of **HDFR** (a CTF team).

## Features

Being a bot for a CTF team he has obviously some CTF specific features.

-  Pulling the 5 next CTF for the week to come
-  Pulling the Top 10 of best Teams from a certain country
-  Create a vote for the next CTF to do
-  Follow the progress of people on the website [Root-me](https://www.root-me.org/)
-  Get the info of some challenges and users from [Root-me](https://www.root-me.org/)

## Setup

### Docker

```bash
git clone https://github.com/Antabuse-does-something/bot-HDFR.git
cd bot-HDFR
touch config.json
```

Don't forget to fill the config according to the template the exectute the following commands

```bash
docker build -t bot-hdfr .
docker run -d bot-hdfr
```

### bare-metal

You will need at least Node.js Version 16.x.x or higher.

```bash
git clone https://github.com/Antabuse-does-something/bot-HDFR.git
cd bot-HDFR
touch config.json
npm install
```

Then you will have to fill the config file according to the template.

Once this is done you will have to register the commands two options:

-  If the bot has one unique server run :

```bash
npm run local
```

-  If the bot has multiple servers run :

```bash
npm run global
```

Once this is done you have to start the bot:

```bash
npm start
```

## Contributting

Feel free to contribute to this bot.

### How to contribute

#### By doing a pull request

-  Fork the repository
-  Commit your changes
-  Open a pull request

#### By creating an issue
