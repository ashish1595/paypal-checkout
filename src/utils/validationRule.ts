function validationRule(body: any) {
    // implement rule engine like drools
    const cardType = getCardType(body.cardnumber);
    if (cardType === 'AMEX' && body.currency !== 'USD')
      return "amex_error";
    if (body.currency === 'USD' || body.currency === 'EUR' || body.currency === 'AUD')
      return "paypal";
    else
      return "braintree"
  }

  function getCardType(cardNumber: string) {
    const re = new RegExp("^3[47]");
    if (cardNumber.match(re) != null)
        return "AMEX";
    else
        return "";
}

export default validationRule;