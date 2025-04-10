import WhitelistManager from "@/Manager/Whitelist";
import type { Message } from "discord.js-selfbot-v13";

type Command = {
    command: "add" | "remove" | "list";
}

export const name: string = "whitelist";
export const exec = (args: string[], userId: string, message: Message): void => {
    if (args.length === 0) {
        message.reply("Please provide a command: add, remove, or list.");
        return;
    }

    if (args[0] !== "add" && args[0] !== "remove" && args[0] !== "list") {
        message.reply("Invalid command. Use add, remove, or list.");
        return;
    }

    const userTarget = args[1]
        ? args[1].replaceAll('<', '')
                 .replaceAll('@', '')
                 .replaceAll('>', '')
        : null;

    const command: Command = {
        command: args[0] as Command["command"]
    };

    const whitelistManager = new WhitelistManager();

    switch (command.command) {
        case "add":
            if (args.length < 2) {
                message.reply("Please provide a user ID to add to the whitelist.");
                return;
            }
            
            if (userTarget) {
                whitelistManager.add(userTarget);
                message.reply(`User ID ${userTarget} has been added to the whitelist.`);
            } else {
                message.reply("Invalid user ID.");
            }
            message.reply(`User ID ${userTarget} has been added to the whitelist.`);
            break;

        case "remove":
            if (args.length < 2) {
                message.reply("Please provide a user ID to remove from the whitelist.");
                return;
            }

            if (userTarget) {
                whitelistManager.remove(userTarget);
                message.reply(`User ID ${userTarget} has been removed from the whitelist.`);
            } else {
                message.reply("Invalid user ID.");
            }
            break;

        case "list":
            const whitelistedUsers = whitelistManager.getAll();
            const userList = whitelistedUsers.map((user: { id: string }) => user.id).join(", ");
            message.reply(`Whitelisted users: ${userList || "None"}`);
    }
};