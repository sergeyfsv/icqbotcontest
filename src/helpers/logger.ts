import log4js from "log4js";

log4js.configure({
 appenders: {
     errors: { type: "stderr" },
     out: { type: "stdout" },
     errorsFilter: { type: "logLevelFilter", appender: "errors", level: "error" }
    },
 categories: {
     default: {
         appenders: ["out", "errorsFilter"], level: "debug"
        }
    }
});

export default log4js;