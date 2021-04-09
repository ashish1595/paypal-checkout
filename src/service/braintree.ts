import braintree from 'braintree';
import Transaction from '../repo/Transaction'

function processBraintreePayment(formBody: any, res: any) {
    const gateway = new braintree.BraintreeGateway({
        environment: braintree.Environment.Sandbox,
        merchantId: process.env.MERCHANT_ID,
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY
    });

    gateway.customer.create({
        firstName: formBody.fullname,
        lastName: "Smith",
        company: "Braintree",
        email: "jen@example.com",
        phone: "312.555.1234",
        fax: "614.555.5678",
        website: "www.example.com"
      }).then(result => {
        const creditCardParams = {
            customerId: result.customer.id,
            number: formBody.cardnumber,
            expirationDate: formBody.expmonth + "/" + formBody.expyear,
            cvv: formBody.cvv
        };
        gateway.creditCard.create(creditCardParams).then(response => {
            console.log("braintree resp ", response);
            const transaction = new Transaction();
            transaction.insert({
                "paymentId": "braintree",
                "amount": formBody.amount,
                "cardNumber": formBody.cardnumber,
                "currency": formBody.currency
            });
            if (response.success === false)
                res.render('error')
            else
                res.render('success');
        });
      });
}

export default processBraintreePayment;