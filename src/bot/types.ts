import {AxiosResponse} from "axios";

export type Chat = {
  chatId: string;
  type: string;
  title: string;
};

export type User = {
  userId: string;
  firstName: string;
  lastName: string;
};

export type Button = {
  text: string;
  url?: string;
  callbackData?: string;
  style?: "primary" | "attention";
};

export type EventType = "private" | "newMessage" | "editedMessage" | "deletedMessage" | "pinnedMessage" | "unpinnedMessage" |
"newChatMembers" | "leftChatMembers" | "callbackQuery";
export type EventPartPayloadType = "inlineKeyboardMarkup" | "mention" | "forward";
export type EventPart = {
  type: EventPartPayloadType;
  payload: any;
};

export type EventMessagePart = {
  msgId: string;
  chat: Chat;
  from?: User;  
  timestamp: number;
  text: string;
  parts?: EventPart[];
}

export type Event = {
  eventId: number;
  type: EventType;
  payload: {
    queryId: string;
    msgId: string;
    timestamp: number;
    text: string;
    chat: Chat;
    from?: User;
    callbackData?: string;
    newMembers?: User[];
    addedBy?: User[];
    leftMembers?: User[];
    removedBy?: User[];
    parts?: EventPart[];
    message?: EventMessagePart;
  };
};

export type EventsResponse = {
  events: Event[];
};

export type GenericResponse = {
  ok: boolean;
};

export type SendTextResponse = GenericResponse &  {msgId: string};

export type EventCallbackHandler = (event: Event, bot: BotInterface) => Promise<void>;
//export type EventFilter = (event: Event) => boolean;

export interface EventFilterInterface {
  filter(event: Event): boolean;
};

export interface BotInterface {
  getEvents(): Promise<AxiosResponse<EventsResponse>>;
  sendAnswerCallback(queryId: string, text?: string, showAlert?: boolean, url?:string): Promise<AxiosResponse<SendTextResponse>>;
  deleteMessage(
    chatId: string,
    msgId: string
  ): Promise<AxiosResponse<SendTextResponse>>;
  sendText(
    chatId: string,
    text: string,
    inlineKeyboardMarkup?: Array<Array<Button>>): Promise<AxiosResponse<SendTextResponse>>;
  editText(
    chatId: string,
    msgId: string,
    text: string,
    inlineKeyboardMarkup?: Array<Array<Button>>): Promise<AxiosResponse<SendTextResponse>>;
  };

export interface HandlerInterface {
  check(event: Event, dispatcher: DispatcherInterface): boolean;
  handle(event: Event, dispatcher: DispatcherInterface): void;
};

export interface DispatcherInterface {
  handlers: HandlerInterface[];
  bot: BotInterface;
  addHandler(handler: HandlerInterface): void;
  removeHandler(handler: HandlerInterface): void;
  dispatch(event: Event): void;
};
