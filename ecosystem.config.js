module.exports = {
    apps: [
        {
            name: 'eliza-assistant',
            script: 'pnpm',
            args: 'start',
            watch: false,
            instances: 1,
            autorestart: true,
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
                PORT: 8080,
                ELIZA_DB_PATH: '/data/db'
            }
        }
    ]
}; 