import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as routes from "./routes";
import bodyParser from 'body-parser';
import paypal from 'paypal-rest-sdk';

// initialize configuration
dotenv.config();

// port
const port = process.env.SERVER_PORT;

const app = express();

paypal.configure({
    'mode': process.env.MODE, // sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
  });

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


routes.register( app );

// start the express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
