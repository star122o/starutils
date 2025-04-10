# Starutils

Written with love by [Luckless](https://github.com/star122o).

## Description
Starutils is a lightweight, fast and feature rich pre-built Discord self-bot, with great plugins support.

## Features
- Logging
- Info commands
- More soon.

## Warning
This self-bot is against Discord's Terms of Service. Use at your own risk. I am not responsible for any bans or issues that may arise from using this bot.

## Requirements
- [Bun](https://bun.sh/) - A fast JavaScript runtime like Node.js, but faster.
- [Discord](https://discord.com/) - The app you will be using the self-bot on.
- [Git](https://git-scm.com/) - A version control system to clone the repository.
- A supported operating system
  - Linux (Debian, Ubuntu, Arch, etc.)
  - Windows
  - macOS
  - Alpine Linux
- Supported architectures
  - x64
  - arm64
- Lastly, a brain 🧠

## Installation - Production
- First, clone the Git repository:
```bash
git clone https://github.com/star122o/starutils.git --branch main --single-branch --depth 1
```

- Then, navigate to the cloned directory:
```bash
cd starutils
```

- Install the required dependencies:
```bash
bun install --production --frozen-lockfile
```

- Configure the bot:
  - Rename `.env.example` to `.env` and fill in the required values.
  - Follow the instructions in the `.env` file to set up your bot token and other configurations.
  - Make sure to set the `NODE_ENV` variable to `production` in the `.env` file.
  - You can also set the `DEBUG` variable to `false` to disable debug logging.
  - Next, configure `config.json`
  - And voila, you are ready to go!

- Finally, run the bot:
```bash
bun run start
```

## Installation - Development
- First, clone the Git repository:
```bash
git clone https://github.com/star122o/starutils.git --depth 1
```

- Then, navigate to the cloned directory:
```bash
cd starutils
```

- Install the required dependencies:
```bash
bun install
```

- Configure the bot:
  - Rename `.env.example` to `.env` and fill in the required values.
  - Follow the instructions in the `.env` file to set up your bot token and other configurations.
  - Make sure to set the `NODE_ENV` variable to `development` in the `.env` file.
  - You can also set the `DEBUG` variable to `true` to enable debug logging.
  - Next, configure `config.json`
  - And voila, you are ready to go!

- Finally, run the bot:
```bash
bun run dev
```