import type { Message } from "discord.js-selfbot-v13";

export const name: string = "info";
export const exec = (args: string[], userId: string, message: Message): void => {
    const platformMap: Record<string, string> = {
        darwin: "macOS",
        win32: "Windows",
        linux: "Linux",
        aix: "AIX",
        freebsd: "FreeBSD",
        openbsd: "OpenBSD",
        sunos: "SunOS",
    };

    const platform = platformMap[process.platform] || "Unknown";

    message.reply(`
# Bot info
- Bot uptime: ${Math.floor(process.uptime() / 60)} minutes
- Ping: ${Math.floor(message.client.ws.ping)}ms

# System info
- Platform: ${platform} (${process.platform})
- Node.js version: ${process.version}
- System architecture: ${process.arch}
- Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
- CPU usage: ${Math.round(process.cpuUsage().system / 1024 / 1024)}MB
    `);
};