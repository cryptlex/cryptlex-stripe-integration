const CryptlexApi = require('./_utils/CryptlexApi');
const config = require('./_utils/config.js');

const productId = config.productId;

module.exports = async (req, res) => {
    let event = req.body;
    if (event == null || event.type == null) {
        return res.status(400).json({ "error": "Invalid request!" });
    }
    switch (event.type) {
        case 'invoice.paid':
            break;
        default:
            return res.json({ event: event.type });
    }
    const invoice = event.data.object;

    if (invoice.status == "paid" && invoice.billing_reason == "subscription_cycle") {

        // renew license expiry
        const license = await CryptlexApi.renewLicense(productId, 'subscription_id', invoice.subscription);

        // return new expiry date
        res.json({ message: `License new expiry date: ${license.expiresAt}` });
    }
    else{
        return res.json({ "Message": "Non renewal payment!" }); // need to discuss
    }
    
}