import dotenv from "dotenv"
import prisma from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: '.env'
})

const port = process.env.PORT || 3000;
//connection to the database
(async () => {
    try {
      await prisma.$connect();
      app.listen(port, () => {
        console.log(`Server is listening at port ${port}`);
      });
    } catch (err) {
      console.error("Unable to connect :", err);
    }
  })();





