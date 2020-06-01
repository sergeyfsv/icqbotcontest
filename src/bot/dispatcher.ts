import {Event, DispatcherInterface, HandlerInterface, BotInterface} from "./types";

import log4js from  "./../helpers/logger";
const logger = log4js.getLogger("bot-dispatcher");

export class Dispatcher implements DispatcherInterface{
  public handlers: HandlerInterface[];
  constructor(public bot: BotInterface) {
    this.handlers = [];
  }
  addHandler(handler: HandlerInterface): void {
    this.handlers.push(handler);
  }
  removeHandler(handler: HandlerInterface): void {
    this.handlers = this.handlers.filter( item =>  item !== handler);
  }
  dispatch(event: Event): void {
    this.handlers.filter(handler => handler.check(event, this)).forEach(handler => {
      try {
        handler.handle(event, this);
      }
      catch(ex) {
        logger.error(`Failed to dispatch event(${event.type}, ${event.eventId}). error: ${ex.message}`);
      }
    });
  }
};
