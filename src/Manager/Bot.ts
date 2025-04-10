import { config } from 'dotenv';
import { prefix, verbose } from '../../config.json';
import Logger from './Logger';
import CommandManager from './Command';
import { Client } from 'discord.js-selfbot-v13';
import WhitelistManager from './Whitelist';

class BotManager {
    private client: Client;
    private token: string | undefined;

    constructor() {
        this.client = new Client();
        this.token = process.env.TOKEN;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.client.once('ready', () => {
            Logger.Log(`Logged in as ${this.client.user?.tag ?? 'Unknown User'}.`);
            CommandManager.init();
        });

        this.client.on('messageCreate', (message) => {
            try {
                const whitelistManager = new WhitelistManager();
                if (!whitelistManager.getUser(message.author.id) && message.author.id !== this.client.user?.id) return;
            } catch (e) {
                Logger.Error(`Error in whitelist check: ${e}`);
                return;
            }

            if (!message.content.startsWith(prefix)) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/).slice(1);
            const command = (message.content?.split(' ')[0]?.slice(prefix.length).toLowerCase() ?? '');

            CommandManager.execCommand(command, args, message.author.id, message);
        });

        if (verbose) {
            this.setupVerboseListeners();
        }
    }

    private setupVerboseListeners(): void {
        Logger.Log('Verbose mode is enabled.');

        this.client.on('debug', (info) => Logger.Log(`DEBUG: ${info}`));
        this.client.on('warn', (info) => Logger.Warn(`WARN: ${info}`));
        this.client.on('error', (error) => Logger.Error(`ERROR: ${error}`));
        this.client.on('rateLimit', (info) => Logger.Warn(`Rate limit: ${JSON.stringify(info)}`));
        this.client.on('reconnecting', () => Logger.Log('Reconnecting...'));
        this.client.on('reconnect', () => Logger.Log('Reconnected.'));
        this.client.on('resume', () => Logger.Log('Resumed.'));
        this.client.on('disconnect', () => Logger.Log('Disconnected.'));
        this.client.on('ready', () => Logger.Log('Ready.'));
        this.client.on('raw', (packet) => Logger.Log(`Raw packet: ${JSON.stringify(packet)}`));
        this.client.on('messageDelete', (message) => Logger.Log(`Message deleted: ${message.content}`));
        this.client.on('messageDeleteBulk', (messages) => Logger.Log(`Bulk message deleted: ${messages.map(msg => msg.content).join(', ')}`));
        this.client.on('messageUpdate', (oldMessage, newMessage) => Logger.Log(`Message updated: ${oldMessage.content} -> ${newMessage.content}`));
        this.client.on('messageReactionAdd', (reaction, user) => Logger.Log(`Reaction added: ${reaction.emoji.name} by ${user.tag}`));
        this.client.on('messageReactionRemove', (reaction, user) => Logger.Log(`Reaction removed: ${reaction.emoji.name} by ${user.tag}`));
        this.client.on('messageReactionRemoveAll', (message) => Logger.Log(`All reactions removed from message: ${message.content}`));
        this.client.on('messageReactionRemoveEmoji', (reaction) => Logger.Log(`Reaction emoji removed: ${reaction.emoji.name}`));
        this.client.on('guildCreate', (guild) => Logger.Log(`Joined guild: ${guild.name}`));
        this.client.on('guildDelete', (guild) => Logger.Log(`Left guild: ${guild.name}`));
        this.client.on('guildMemberAdd', (member) => Logger.Log(`Member joined: ${member.user.tag}`));
        this.client.on('guildMemberRemove', (member) => Logger.Log(`Member left: ${member.user.tag}`));
        this.client.on('guildMemberUpdate', (oldMember, newMember) => Logger.Log(`Member updated: ${oldMember.user.tag} -> ${newMember.user.tag}`));
        this.client.on('guildMemberAvailable', (member) => Logger.Log(`Member available: ${member.user.tag}`));
        this.client.on('guildMemberUnavailable', (member) => Logger.Log(`Member unavailable: ${member.user.tag}`));
        this.client.on('guildMembersChunk', (members) => Logger.Log(`Guild members chunk: ${members.map(member => member.user.tag).join(', ')}`));
        this.client.on('guildBanAdd', (ban) => Logger.Log(`User banned: ${ban.user.tag} in guild: ${ban.guild.name}`));
        this.client.on('guildBanRemove', (ban) => Logger.Log(`User unbanned: ${ban.user.tag} in guild: ${ban.guild.name}`));
        this.client.on('guildEmojiCreate', (emoji) => Logger.Log(`Emoji created: ${emoji.name}`));
        this.client.on('guildEmojiDelete', (emoji) => Logger.Log(`Emoji deleted: ${emoji.name}`));
        this.client.on('guildEmojiUpdate', (oldEmoji, newEmoji) => Logger.Log(`Emoji updated: ${oldEmoji.name} -> ${newEmoji.name}`));
        this.client.on('guildRoleCreate', (role) => Logger.Log(`Role created: ${role.name}`));
        this.client.on('guildRoleDelete', (role) => Logger.Log(`Role deleted: ${role.name}`));
        this.client.on('guildRoleUpdate', (oldRole, newRole) => Logger.Log(`Role updated: ${oldRole.name} -> ${newRole.name}`));
        this.client.on('guildChannelCreate', (channel) => Logger.Log(`Channel created: ${channel.name}`));
        this.client.on('guildChannelDelete', (channel) => Logger.Log(`Channel deleted: ${channel.name}`));
        this.client.on('guildChannelUpdate', (oldChannel, newChannel) => Logger.Log(`Channel updated: ${oldChannel.name} -> ${newChannel.name}`));
        this.client.on('guildChannelPinsUpdate', (channel, time) => Logger.Log(`Channel pins updated: ${channel.name} at ${time}`));
        this.client.on('guildIntegrationsUpdate', (guild) => Logger.Log(`Guild integrations updated: ${guild.name}`));
        this.client.on('guildWebhooksUpdate', (guild) => Logger.Log(`Guild webhooks updated: ${guild.name}`));
        this.client.on('guildStickerCreate', (sticker) => Logger.Log(`Sticker created: ${sticker.name}`));
        this.client.on('guildStickerDelete', (sticker) => Logger.Log(`Sticker deleted: ${sticker.name}`));
        this.client.on('guildStickerUpdate', (oldSticker, newSticker) => Logger.Log(`Sticker updated: ${oldSticker.name} -> ${newSticker.name}`));
        this.client.on('guildScheduledEventCreate', (event) => Logger.Log(`Scheduled event created: ${event.name}`));
        this.client.on('guildScheduledEventDelete', (event) => Logger.Log(`Scheduled event deleted: ${event.name}`));
    }

    public start(): void {
        const redactedToken = this.token ? `${this.token.slice(0, 6)}${'*'.repeat(this.token.length - 6)}` : '';
        Logger.Log(`Attempting to login with token: ${redactedToken}`);

        this.client.login(this.token).then(() => {
            Logger.Log(`Logged in with token: ${redactedToken}`);
        }).catch((error) => {
            Logger.Error(`Failed to login: ${error}`);
            process.exit(1);
        });
    }
}

export default BotManager;
