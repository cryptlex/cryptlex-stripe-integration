const CryptlexApi = require('./_utils/CryptlexApi');
const config = require('./_utils/config.js');

const productId = config.productId;

module.exports = async (req, res) => {
    let event = req.body;
    if( event == null || event.type == null) {
        return res.status(400).json({"error" : "Invalid request!"});
    }
    switch (event.type) {
        case 'invoice.payment_succeeded':
            break;
        default:
            return res.json({ event : event.type});
    }
    const invoice = event.data.object;

    // renew license expiry
    const license = await CryptlexApi.renewLicense(productId, 'customer_id', invoice.customer);

    // return new expiry date
    res.json({ message: `License new expiry date: ${license.expiresAt}` });
}