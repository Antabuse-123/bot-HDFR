# Bot HDFR

- [Bot HDFR](#bot-hdfr)
  - [Description](#description)
  - [Features](#features)
  - [Setup](#setup)
  - [Contributting](#contributting)
    - [How to contribute](#how-to-contribute)
      - [By doing a pull request](#by-doing-a-pull-request)
      - [By creating an issue](#by-creating-an-issue)
  
## Description

This is yet another discord bot. This ons has been created for the discord server of **HDFR** (a CTF team).

## Features

Being a bot for a CTF team he has obviously some CTF specific features.

- Pulling the 5 next CTF for the week to come
- Pulling the Top 10 of best Teams from a certain country
- Create a vote for the next CTF to do

## Setup

You will need at least Node.js Version 16.9.x or higher.

```bash
git clone https://github.com/Antabuse-does-something/bot-HDFR.git
cd bot-HDFR
npm install
touch config.json
```

Then you will have to fill the config file according to the template.

Once this is done you will have to register the commands two options:

- If the bot is on one unique server run :

```bash
npm run local
```

- If the bot is on multiple servers run :

```bash
npm run prod
```

Once this is done you just have to start the bot with :

```bash
npm start
```

## Contributting

Feel free to contribute to this bot.

### How to contribute

#### By doing a pull request

- Fork the repository
- Commit your changes
- Open a pull request

#### By creating an issue
