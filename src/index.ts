import express, {NextFunction, Express, Request, Response} from 'express';
import * as dotenv from 'dotenv'; dotenv.config();
import stripes from 'stripe';
import stripe from './services/stripe';

const PORT = process.env.PORT || 4000;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripeCharge = (res: Response):any =>(stripeErr: stripes.StripeError, stripeRes: stripes.StripeResource):any=>{
    if(stripeErr){
        return res.status(500).send({error: stripeRes});
    }else{
        return res.status(200).send({success: stripeRes});
    }
};

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response)=>{
    return res.status(200).send("This is the Home page");
});


app.post('/stripe', async(req: Request, res: Response)=>{
    const prod = await stripe.products.create({
        name: req.body.helper_uid 
    });
    const price = await stripe.prices.create({
        product: prod.id,
        unit_amount:Number.parseInt(req.body.price) * 100,
        currency: 'usd'
    });
    const customer = await stripe.customers.create({
        email: 'email@customer.com',
        payment_method:'pm_card_visa',
    });

    const session = await stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        line_items:[
            {
                price: price.id,
                quantity: 1,
                
            }
        ],
        mode: 'payment',
      });
      return res.status(200).json(session);
});

app.listen(PORT, (): void=>{console.log(`http://host:${PORT}/`);});

