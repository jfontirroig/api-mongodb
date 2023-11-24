import winston from 'winston'
import fs from 'fs'

const configDefaults = {
    winstonConsoleTransport: {
        level: 'info',
        handleExceptions: false,
        timestamp: true,
        stringify: true,
        colorize: true,
        json: false
    },
    domainName: 'api.id',
    dbLocation: '/home/api-mongodb/registrar_db/api.db',
    mongodb_uri: 'mongodb://127.0.0.1:27017/crosscheck, { useNewUrlParser: true }',
    port: 3000,
    prometheus: { start: false, port: 0 },
    minBatchSize: 1
}

export function getConfig() {
    let config = Object.assign({}, configDefaults)

    if (process.env.API_DEVELOP) {
        config = Object.assign({}, configDevelopDefaults)
        config.development = true
    }

    if (process.env.API_CONFIG) {
        const configFile = process.env.API_CONFIG
        Object.assign(config, JSON.parse(fs.readFileSync(configFile)))
    }

    config.winstonConfig = {
        transports: [
            new winston.transports.Console(config.winstonConsoleTransport),
            new winston.transports.File({
                maxsize: 5120000,
                maxFiles: 10,
                filename: `${__dirname}/../logs/api.log`,
                level: 'debug',
                handleExceptions: false,
                timestamp: true,
                stringify: true,
                colorize: false,
                json: false
            })
        ]
    }

    return config
}
