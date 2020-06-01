import storage from "./storage";

export declare type Session = {
  post: string;
  owner: {
    name: string;
    uin: string;
  };
  uin: string;
  location: {
    latitude: string;
    longitude: string;
  };
  visibility: string;
  ttl: string;

  lastCommand?: string;
  aliases: {
    [key: string]: string;
  };

  waitingForPost: boolean;
  waitingForUIN: boolean;
  waitingForLocation: boolean;
  waitingForContent: boolean;
};

export function defaultSession(): Session {
  return {
    post: undefined,
    owner: undefined,
    uin: undefined,
    location: undefined,

    visibility: "all",
    ttl: "1w",
    aliases: {},

    waitingForPost: false,
    waitingForUIN: false,
    waitingForLocation: false,
    waitingForContent: false,
  };
}

export function getOrDefault(sessionId: string): Session {
  if (!storage.cache.has(sessionId)) {
    return defaultSession();
  };
  return (storage.cache.get(sessionId) as Session);
};

export function set(sessionId: string, session: Session) {
  storage.cache.set(sessionId, session);
};
