const winston = require('winston')
const morgan = require('morgan')
const moment = require('moment')
const config = require('../configuration/config')

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
}

winston.addColors(colors)

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `[${info.level}]: ${info.message}`)
)

const fileFormat = winston.format.combine(
  winston.format.json()
)

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: consoleFormat
    }),
    new winston.transports.File({
      filename: './logs/' + config.get('logger.filename'),
      format: fileFormat
    })
  ]
})

logger.stream = {
  write: (message) => {
    logger.info(message)
  }
}

const morganLogger = (req, res, next) => {
  const requestLogFormat = {
    date: ':date',
    method: ':method',
    url: ':url',
    status: ':status',
    payload: ':payload',
    responseTime: ':response-time ms'
  }

  morgan.token('date', (req, res, tz) => {
    return moment().tz('Asia/Calcutta').format()
  })

  morgan.token('payload', () => {
    return JSON.stringify(req.body)
  })

  morgan(JSON.stringify(requestLogFormat), {
    stream: logger.stream
  })(req, res, next)
}

module.exports = {
  logger,
  morganLogger
}