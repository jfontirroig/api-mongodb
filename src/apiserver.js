/* @flow */
import logger from 'winston'
import AsyncLock from 'async-lock'
import util from 'util'
import axios from 'axios'
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import qs from 'qs'
import FormData from 'form-data'
import fs from 'fs'

//import { RegistrarQueueDB } from './db'

const mongoose = require("mongoose");
const Standard = require('./models/standardSchema');
const punycode = require('punycode/');

const QUEUE_LOCK = 'queue'

export class ApiServer {
    //db_sqlite: RegistrarQueueDB;
    lock: AsyncLock;

    constructor(config: {
        dbLocation: string,
        mongodb_uri: string
    }) {
        //this.db_sqlite = new RegistrarQueueDB(config.dbLocation)
        const db_mongodb = mongoose
          .connect(config.mongodb_uri)
          .then(() => logger.info("index  --> Connected to MongoDB "))
          .catch((error) => logger.info(`index  --> Conection Error MongoDB --> ${error}`));
        this.lock = new AsyncLock()
    }

    async initializeServer() {
        //await this.db.initialize()
    }

    async save(
        username: string,
        filename: string,
        moduleapp: string,
        dataobject: string,
        options: string
    ): Promise < void > {
        let respuesta = ''
        try {
          const standard = new Standard({username: username, filename: filename, moduleapp: moduleapp, dataobject: dataobject, options: options});
          await standard.save();
          respuesta = JSON.stringify({success: true, message: "Success Save Register MongoDB", code: 1, data: standard});
        } catch (error) {
          respuesta = JSON.stringify({
              success: false,
              message: "Failure Save Register MongoDB",
              code: 2,
              data: error})
        }
        //shutdown_sqlite()
        //shutdown_mongodb()
        return respuesta
    }

    async readbyfilename(
        username: string,
        filename: string
    ): Promise < void > {
        let respuesta = ''
        try {
          const standard = await Standard.findOne({username, filename});
          respuesta = JSON.stringify({success: true, message: "Success Read All Register MongoDB", code: 1, data: standard});
        } catch (error) {
          respuesta = JSON.stringify({
              success: false,
              message: "Failure Read All Register MongoDB",
              code: 2,
              data: error})
        }
        //shutdown_sqlite()
        //shutdown_mongodb()
        return respuesta
    }

    async remove(
        username: string,
        filename: string
    ): Promise < void > {
        let respuesta = ''
        try {
          const standard = await Standard.deleteOne({username, filename});
          respuesta = JSON.stringify({success: true, message: "Success Remove Register MongoDB", code: 1, response: standard, data: {username, filename}});
        } catch (error) {
          respuesta = JSON.stringify({
              success: false,
              message: "Failure Remove Register MongoDB",
              code: 2,
              data: error})
        }
        //shutdown_sqlite()
        //shutdown_mongodb()
        return respuesta
    }

    async removebyid(
        id: string
    ): Promise < void > {
        let respuesta = ''
        try {
          const standard = await Standard.findByIdAndDelete(id);
          respuesta = JSON.stringify({success: true, message: "Success Remove By Id Register MongoDB", code: 1, data: standard});
        } catch (error) {
          respuesta = JSON.stringify({
              success: false,
              message: "Failure Remove By Id Register MongoDB",
              code: 2,
              data: error})
        }
        //shutdown_sqlite()
        //shutdown_mongodb()
        return respuesta
    }

    async modify(
        id: string,
        username: string,
        filename: string,
        moduleapp: string,
        dataobject: string,
        options:string
    ): Promise < void > {
        let respuesta = ''
        try {
          const standard = await Standard.findByIdAndUpdate(id, { username, filename, moduleapp, dataobject, options});
          respuesta = JSON.stringify({success: true, message: "Success Modify Register MongoDB", code: 1, data: standard});
        } catch (error) {
          respuesta = JSON.stringify({
              success: false,
              message: "Failure Modify Register MongoDB",
              code: 2,
              data: error})
        }
        //shutdown_sqlite()
        //shutdown_mongodb()
        return respuesta
    }

    shutdown_sqlite() {
        //return this.db_sqlite.shutdown()
    }

    shutdown_mongodb() {
        //return this.db_mongodb.disconnect();
    }

}
