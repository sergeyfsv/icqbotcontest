/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as quertystring from "querystring";
import * as qs from "qs";

const asyncWriteFile = util.promisify(fs.writeFile);
const asyncReadFile = util.promisify(fs.readFile);

import axios, {AxiosInstance, AxiosResponse} from "axios";
import {BotInterface, EventsResponse, Button, SendTextResponse} from "./types";
import {Dispatcher} from "./dispatcher";

import log4js from  "./../helpers/logger";
import {RequestLoggerInterceptor} from "./../helpers/logger-interceptor";
const logger = log4js.getLogger("bot");

enum TimeConversion {
  _1sec_to_ms = 1000,
  _1min_to_sec = 60
};

const DEFAULT_POLL_TIMEOUT_SEC = 60;
const DEFAULT_WAIT_TIMEOUT_SEC = 20;
const EVENTID_STORAGE_FILENAME = path.join(__dirname, "lastEventId.dat");

export class Bot implements BotInterface {
  private waitTimeoutMs: number;
  private pollTimeoutMs: number;
  private isRunning: boolean;
  private lastEventId: number;
  private axiosInstance: AxiosInstance;
  public dispatcher: Dispatcher;
  constructor(private token: string, private baseURL: string) {
    this.waitTimeoutMs = DEFAULT_WAIT_TIMEOUT_SEC * TimeConversion._1sec_to_ms;    
    this.pollTimeoutMs = DEFAULT_POLL_TIMEOUT_SEC * TimeConversion._1sec_to_ms; 
    this.isRunning = false;
    this.lastEventId = 0;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.pollTimeoutMs + this.waitTimeoutMs,
/*
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paramsSerializer: (params: any): string => {
          return qs.stringify(params, {
            arrayFormat: "repeat"
          });
      }
*/      
    });
    this.axiosInstance.interceptors.request.use(RequestLoggerInterceptor);
    this.dispatcher = new Dispatcher(this);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEvents(): Promise<AxiosResponse<EventsResponse>> {
    return this.axiosInstance.get("/events/get", {
      params: {
        token: this.token,
        pollTime: this.pollTimeoutMs / TimeConversion._1sec_to_ms,
        lastEventId: this.lastEventId
      }
    });
  }
  sendAnswerCallback(queryId: string, text?: string, showAlert?: boolean, url?:string): Promise<AxiosResponse<SendTextResponse>> {
    const params: Record<string, string | boolean> = {
      token: this.token,
      queryId,
    };
    if (text) {
      params.text = text;
    }
    if (url) {
      params.url = url;
    }
    if (showAlert) {
      params.showAlert = showAlert;
    }
    return this.axiosInstance.get("/messages/answerCallbackQuery", {
      params
    });
  }
  deleteMessage(
    chatId: string,
    msgId: string): Promise<AxiosResponse<SendTextResponse>>
  {
    const params: {[key: string]: string | number | boolean | string[] | number[] | boolean[] | undefined | null} = {
      token: this.token,
      msgId: msgId,
      chatId
    };
    return this.axiosInstance.get(`/messages/deleteMessages`, {
      params
    });
  }
  editText(
    chatId: string,
    msgId: string,
    text: string,
    inlineKeyboardMarkup?: Array<Array<Button>>): Promise<AxiosResponse<SendTextResponse>> {
    const params: {[key: string]: string | number | boolean | string[] | number[] | boolean[] | undefined | null} = {
      token: this.token,
      msgId,
      chatId,
      text
    };
    if (inlineKeyboardMarkup) {
      //const inlineKeyboardMarkupEncoded = quertystring.stringify({a: JSON.stringify(inlineKeyboardMarkup)});
      //inlineKeyboardMarkupEncoded.split("=")[1];
      params.inlineKeyboardMarkup = JSON.stringify(inlineKeyboardMarkup); 
    };
    return this.axiosInstance.get(`/messages/editText`, {
      params
    });
  }
  sendText(
    chatId: string,
    text: string,
    inlineKeyboardMarkup?: Array<Array<Button>>): Promise<AxiosResponse<SendTextResponse>> {
    const params: {[key: string]: string | number | boolean | string[] | number[] | boolean[] | undefined | null} = {
      token: this.token,
      chatId,
      text
    };
    if (inlineKeyboardMarkup) {
      //const inlineKeyboardMarkupEncoded = quertystring.stringify({a: JSON.stringify(inlineKeyboardMarkup)});
      //inlineKeyboardMarkupEncoded.split("=")[1];
      params.inlineKeyboardMarkup = JSON.stringify(inlineKeyboardMarkup); 
    };
    return this.axiosInstance.get(`/messages/sendText`, {
      params
    });
  }
  async doPolling(): Promise<void> {
    if (!this.isRunning) {
      return;
    }
    try {
      const response = await this.getEvents();
      response.data.events.forEach(event => {
        if (event.eventId > this.lastEventId) {
          this.lastEventId = event.eventId;
        }
        try {
          logger.debug(`Event(id: ${event.eventId}, type: ${event.type}): ${JSON.stringify(event.payload)}`);
          this.dispatcher.dispatch(event);
        }
        catch (ex) {
          logger.error(`Failed to dispatch event(${event.type}, ${event.eventId}). error: ${ex.message}`);
        }
      });
      try {
        await asyncWriteFile(EVENTID_STORAGE_FILENAME, "" + this.lastEventId);  
      }
      catch (ex) {
        logger.error(`Failed to store lastEventId to the permanent storage. Error: ${ex.message}`);
        this.lastEventId = 0;
      }
      logger.debug(`Events count: ${response.data.events.length}, lastEventId: ${this.lastEventId}`);
      setTimeout(() => {
          this.doPolling();
        }, 0);
    }
    catch (error) {
      if (this.isRunning/* &&
        error.response &&
        error.response.status !== 500*/) {
          logger.warn(`Events polling error. http status: ${error?.response?.status}, restart polling ...`);
          setTimeout(() => {
            this.doPolling();
          }, 0);
      }
      else {
        logger.error(`Events polling error. message: ${error.message}`);
        throw error;
      }
    }
  }
  async startPolling() {
    this.isRunning = true;
    try {
      const buffer = await asyncReadFile(EVENTID_STORAGE_FILENAME);
      const lastEventId = parseInt(buffer.toString(), 10);
      this.lastEventId = isNaN(lastEventId) ? 0 : lastEventId;
      logger.debug(`Restore lastEventId: ${this.lastEventId}`);
    }
    catch(ex) {
      this.lastEventId = 0;
    }
    return this.doPolling();
  }
  stopPolling() {
    this.isRunning = false;
  }
}

export default Bot;