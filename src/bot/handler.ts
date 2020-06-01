import {Event, HandlerInterface, DispatcherInterface, EventFilterInterface, EventCallbackHandler} from "./types";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const EMPTY_CALLBACK_HANDLER = (): Promise<void> => { return Promise.resolve(); };

export class HandlerBase implements HandlerInterface{
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private filters: EventFilterInterface[] = [],
    private callback: EventCallbackHandler = EMPTY_CALLBACK_HANDLER) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check(event: Event, dispatcher: DispatcherInterface): boolean {
    let result = true;
    this.filters.forEach(item => {
      result = result && item.filter(event);
    });
    return result;
  }
  handle(event: Event, dispatcher: DispatcherInterface): void {
    this.callback(event, dispatcher.bot);
  }
};

export class RegexMessageHandler extends HandlerBase {
  _regex: any;
  constructor(private regex: string) {
    super([]);
    this._regex = new RegExp(regex);
  }
  check(event: Event, dispatcher: DispatcherInterface): boolean {
    return this._regex.test(event?.payload.text) && super.check(event, dispatcher);
  }
}

export class NewMessageHandler extends HandlerBase {
  check(event: Event, dispatcher: DispatcherInterface): boolean {
    return super.check(event, dispatcher) && (event.type === "newMessage");
  }
};

export class CommandHandler extends NewMessageHandler {
  constructor(
    private command: string, 
    filters: EventFilterInterface[] = [],
    callback: EventCallbackHandler = EMPTY_CALLBACK_HANDLER) {
      super(filters, callback);
      this.command = command;
  }
  check(event: Event, dispatcher: DispatcherInterface): boolean {
    if (!super.check(event, dispatcher)) {
      return false;
    }
    const tokens: string[] = event.payload.text?.split(" ");
    if (tokens?.length > 0) {
      const command = tokens[0].slice(1).toLowerCase();
      return command === this.command.toLowerCase();
    }
    return false;
  }
};

export class NewChatMembersHandler extends HandlerBase {
  check(event: Event, dispatcher: DispatcherInterface): boolean {
    return super.check(event, dispatcher) && (event.type === "newChatMembers");
  }
};

export class LeftChatMembersHandler extends HandlerBase {
  check(event: Event, dispatcher: DispatcherInterface): boolean {
    return super.check(event, dispatcher) && (event.type === "leftChatMembers");
  }
};

export class CallbackQueryHandler extends HandlerBase {
  check(event: Event, dispatcher: DispatcherInterface): boolean {
    return super.check(event, dispatcher) && (event.type === "callbackQuery");
  }
};