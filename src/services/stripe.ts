import configureStripe from 'stripe';
import * as dotenv from 'dotenv';
dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ""; 
const stripe_config: configureStripe.StripeConfig = {
    apiVersion: "2020-08-27"
};
const stripe = new configureStripe(STRIPE_SECRET_KEY, stripe_config); 
export default stripe;