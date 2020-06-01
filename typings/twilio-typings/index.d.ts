// <reference path="./twilio.d.ts"/>

//declare module twilio {
  declare namespace twilio {
    export interface SMSRequest {
      AccountSid: string;
      ApiVersion: string;
      Body: string;
      From: string;
      MessageSid: string;
      NumMedia: string;
      NumSegments: string;
      SmsMessageSid: string;
      SmsSid: string;
      SmsStatus: string;
      To: string;
    }
  }
  export = twilio;
//}