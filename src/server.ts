import log4js from  "./helpers/logger";
const logger = log4js.getLogger();

import mongoose from "mongoose";
import mongoConfig from "./config/mongo";
import * as DB from "./db/db";

import * as IBMCloudEnv from "ibm-cloud-env";
(global as NodeJS.Global).cloudEnv = IBMCloudEnv;
((global as NodeJS.Global).cloudEnv as typeof IBMCloudEnv).init("/credentials/mapping.json");

import app from "./app";
import bot from "./bot";
import crawler from "./crawler";

//list the longitude first and then latitude:

function getPolygonCenter(polygonCoordinates:any[][]): {longitude: number; latitude: number} {
  const longitudes: number[] = polygonCoordinates[0].map((_item) => (_item[0] as number));
  const latitudes: number[] = polygonCoordinates[0].map((_item) => _item[1] as number);

   // sort the arrays low to high
   longitudes.sort();
   latitudes.sort();

   // get the min and max of each
   const lowy = latitudes[0];
   const highy = latitudes[latitudes.length - 1];

   const lowX = longitudes[0];
   const highX = longitudes[latitudes.length - 1];

   // center of the polygon is the starting point plus the midpoint
   const centerX = lowX + ((highX - lowX) / 2);
   const centerY = lowy + ((highy - lowy) / 2);

   return {
     longitude: centerX,
     latitude: centerY
   };
}

(async function(){
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const MS_IN_DAY = 24*60*60*1000;

  try {
    const environment = (global as NodeJS.Global).cloudEnv.getString("environment") || "development";
    logger.info(`MongoDB environment: ${environment}`);
    await mongoose.connect((mongoConfig as Record<string, string>)[environment], {useNewUrlParser: true});
    await DB.GeoNoteModel.createIndexes();
  }
  catch(ex) {
    logger.error(`Unable connect to a DB: ${ex?.message}`);
  }

  const server = app.listen(
    app.get("port"),
    app.get("host"),
    function () {
      const {address, port} = this.address();
      logger.info(`App is running at http://${address}:${port} in ${app.get("env")} mode`);
    }
  );
  bot.startPolling();

  process.on("SIGTERM", () => {
    bot.stopPolling();
    crawler.stopCrawling();
    server.close(() => {
      logger.info("Server has been terminated");
    });
  });
})();

//export default server;