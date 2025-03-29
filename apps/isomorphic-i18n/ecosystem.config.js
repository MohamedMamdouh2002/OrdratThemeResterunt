module.exports = {
  apps: [
    {
      name: 'theme-ordrat',
      script: 'server.js',

      // PM2 config for scalability and performance
      instances: 'max',
      exec_mode: 'cluster',
      interpreter: '/opt/plesk/node/22/bin/node', // or just 'node' if it's global and symlinked properly
      interpreter_args: '--max-old-space-size=2048',

      watch: false,
      autorestart: true,
      max_memory_restart: '2048M',

      env: {
        NODE_ENV: 'production',
        PORT: 3001
        // Remove NODE_OPTIONS here!
      },

      error_file: '/var/www/vhosts/ordrat.com/theme.ordrat.com/logs/err.log',
      out_file: '/var/www/vhosts/ordrat.com/theme.ordrat.com/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },

    // Optional Warm-up Process (runs once)
    {
      name: 'theme-ordrat-warmup',
      script: '/var/www/vhosts/ordrat.com/theme.ordrat.com/warmup.sh',
      interpreter: '/bin/bash',
      exec_mode: 'fork',
      autorestart: false,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

