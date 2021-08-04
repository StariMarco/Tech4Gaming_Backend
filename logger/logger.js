const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.Console({colorize: true, prettyPrint: true}),
      new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});

module.exports = logger;