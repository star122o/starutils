class Logger {
    public static Log(message: string|string[]) {
        const timeDateUTC = new Date().toUTCString();

        if (typeof message === 'string') {
            console.log(`ℹ️ ${timeDateUTC} | ${message}`);
            return 0;
        } else if (Array.isArray(message)) {
            message.forEach((msg) => {
                console.log(`ℹ️ ${timeDateUTC} | ${msg}`);
            });
            return 0;
        }
    }

    public static Error(message: string|string[]) {
        const timeDateUTC = new Date().toUTCString();

        if (typeof message === 'string') {
            console.error(`❌ ${timeDateUTC} | ${message}`);
            return 0;
        } else if (Array.isArray(message)) {
            message.forEach((msg) => {
                console.error(`❌ ${timeDateUTC} | ${msg}`);
            });
            return 0;
        }
    }

    public static Warn(message: string|string[]) {
        const timeDateUTC = new Date().toUTCString();

        if (typeof message === 'string') {
            console.warn(`⚠️ ${timeDateUTC} | ${message}`);
            return 0;
        } else if (Array.isArray(message)) {
            message.forEach((msg) => {
                console.warn(`⚠️ ${timeDateUTC} | ${msg}`);
            });
            return 0;
        }
    }
}

export default Logger;