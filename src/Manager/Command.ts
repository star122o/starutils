import { readdirSync } from 'fs';
import { join } from 'path';
import Logger from './Logger';
import type { Message } from 'discord.js-selfbot-v13';

type CommandType = {
    name: string;
    exec: (args: string[]|number[]|boolean[], executor: string, message: Message) => void;
}

const commands: CommandType[] = []

class CommandManager {
    private static instance: CommandManager;

    public static init(): void {
        if (!CommandManager.instance) {
            CommandManager.instance = new CommandManager();
            CommandManager.loadCommands();
        }
    }

    private static async loadCommands(): Promise<void> {
        const commandsPath = join(__dirname, '..', 'Commands');
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.mjs'));
    
        let successLoad = 0;
        let errorLoad = 0;
    
        const loadPromises = commandFiles.map(async (file) => {
            try {
                const commandModule = await import(join(commandsPath, file));
                if (!commandModule.name || !commandModule.exec) {
                    Logger.Error(`${file} is missing ${(!commandModule.name ? 'name' : '')}${(!commandModule.exec ? 'exec' : '')} property`);
                    errorLoad++;
                    return;
                } else {
                    if (/^[A-Z0-9!@#$%^&*(),.?":{}|<>]/.test(commandModule.name) || commandModule.name.startsWith(' ')) {
                        Logger.Error(`${file} command name should not start with a capital letter, symbol or number`);
                        errorLoad++;
                        return;
                    }
    
                    if (commandModule.name.includes(' ')) {
                        Logger.Error(`${file} command name should not contain spaces`);
                        errorLoad++;
                        return;
                    }
    
                    for (const command of commands) {
                        if (command.name === commandModule.name) {
                            Logger.Error(`${file} command name already exists`);
                            errorLoad++;
                            return;
                        }
                    }
    
                    const command: CommandType = {
                        name: commandModule.name,
                        exec: commandModule.exec
                    };
                    commands.push(command);
                    Logger.Log(`Command loaded: ${command.name}`);
                    successLoad++;
                }
            } catch (error) {
                Logger.Error(`Failed to load command from file ${file}: ${error}`);
                errorLoad++;
            }
        });
    
        await Promise.all(loadPromises);
    
        Logger.Log(`✅ ${successLoad} commands loaded successfully.`);
        Logger.Log(`❌ ${errorLoad} commands failed to load.`);
    }    

    public static execCommand(commandName: string, commandArgs: string[]|number[]|boolean[], executor: string, message: Message): void {
        Logger.Log(`User ID ${executor} executed command: ${commandName} with args: ${commandArgs}`);

        const command = commands.find(cmd => cmd.name === commandName);

        if (!command) {
            Logger.Error(`Command ${commandName} not found`);
            return;
        }

        try {
            command.exec(commandArgs, executor, message);
        } catch (error) {
            Logger.Error(`Error executing command ${commandName}: ${error}`);
        }
    }
}

export default CommandManager;