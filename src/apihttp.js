import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import logger from 'winston'
import colors from 'colors' //Mantener en Scope. Permite cambiar el color a los console.log()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import https from 'https'
import fs from 'fs'

import { ApiServer } from './apiserver'
import { createMiddleware as createPrometheusMiddleware } from '@promster/express'
import { createServer } from '@promster/server'

const HEADERS = { 'Content-Type': 'application/json' }

export function makeHTTPServer(config) {

    // initalizing express instance.
    logger.info('http - makeHTTPServer --> Initalizing Server Core')

    const app = express()
    logger.info('http - makeHTTPServer --> Express instance: ' + 'OK')

    const corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    app.use(bodyParser.json({ limit: "50mb" }))
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
    app.use(express.json())
    app.use(cors(corsOptions))
    logger.info('http - makeHTTPServer --> CORS: ' + 'OK')
    app.use(cookieParser())
    logger.info('http - makeHTTPServer --> Cookie Parser: ' + 'OK')
    app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

    logger.info('http - makeHTTPServer --> Mounting Server Services')
    logger.info('http - makeHTTPServer --> Server Services: ' + 'OK')

    app.route('/api').get((req, res) => {
        logger.info('http - makeHTTPServer --> Usuario accede por browser')
        res.json({message: "Welcome to Apis Crosscheck for MongoDB"});
    })

    const server = new ApiServer(config)

    if (config.prometheus && config.prometheus.start && config.prometheus.port) {

        app.use(createPrometheusMiddleware({
            app,
            options: {
                normalizePath: (path) => {
                    if (path.startsWith('/api/save')) {return '/api/save'}
                    if (path.startsWith('/api/readbyfilename')) {return '/api/readbyfilename'}
                    if (path.startsWith('/api/remove')) {return '/api/remove'}
                    if (path.startsWith('/api/removebyid')) {return '/api/removebyid'}
                    if (path.startsWith('/api/modify')) {return '/api/modify'}
                    return path
                }
            }
        }))
        const port = config.prometheus.port
        const httpsOptions = {
            key: fs.readFileSync('/etc/letsencrypt/live/domains.paradigma.global/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/domains.paradigma.global/fullchain.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/domains.paradigma.global/chain.pem')
        }
        logger.info(`http - makeHTTPServer --> \nServer Certificates: ${httpsOptions}`)
        https.createServer(httpsOptions, server).listen(port, () => {
            logger.info(`http - makeHTTPServer --> @promster/server started on port ${port}.`)
        })
    }

     app.get('/api', (req, res) => {
          res.json({message: "Welcome to Apis Crosscheck for MongoDB"});
     })

     app.post('/api/save', (req, res) => {
        const { username, filename, moduleapp, dataobject, options } = req.body;
        server.save(
                username,
                filename,
                moduleapp,
                dataobject,
                options
             )
            .then((response) => {
                res.send(response)
                res.end()
            })
            .catch((err) => {
                res.write(err)
                res.end()
            })
    })

    app.post('/api/readbyfilename', (req, res) => {
       const { username, filename } = req.body;
       server.readbyfilename(
               username,
               filename
            )
           .then((response) => {
               res.send(response)
               res.end()
           })
           .catch((err) => {
               res.write(err)
               res.end()
           })
   })

   app.post('/api/remove', (req, res) => {
      const { username, filename } = req.body;
      server.remove(
              username,
              filename
           )
          .then((response) => {
              res.send(response)
              res.end()
          })
          .catch((err) => {
              res.write(err)
              res.end()
          })
  })

  app.get('/api/removebyid/:id', (req, res) => {
     const { id } = req.params;
     server.removebyid(
             id
          )
         .then((response) => {
             res.send(response)
             res.end()
         })
         .catch((err) => {
             res.write(err)
             res.end()
         })
   })

   app.post('/api/modify', (req, res) => {
      const { id, username, filename, moduleapp, dataobject, options } = req.body;
      server.modify(
              id,
              username,
              filename,
              moduleapp,
              dataobject,
              options
           )
          .then((response) => {
              res.send(response)
              res.end()
          })
          .catch((err) => {
              res.write(err)
              res.end()
          })
  })

  return server.initializeServer()
        .then(() => {})
        .then(() => app)

}
