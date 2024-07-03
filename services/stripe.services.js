const stripe = require('stripe')(process.env.STRIPE_SERECT_KEY)


module.exports = {
    depositStripe:async(amount,currency)=>{
        try {
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    token:'tok_visa'
                },
            });
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, 
                currency: currency, 
                payment_method: paymentMethod.id, 
                confirm: true,
                return_url:"http://localhost:8888/stripe"
            })
            return paymentIntent
        } catch (error) {
            console.log(error)
        }
    }
}