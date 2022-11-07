const { v4: uuidv4 } = require('uuid');
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

    const requestBody = event.data.object
    if (requestBody.status = "paid" && requestBody.lines.data[0].type == "subscription") {

        // get post params from request body
        const customerName = requestBody.customer_name

        const email = event.data.object.customer_email;
        let firstName = 'John', lastName = '_';
        if (customerName != "") {
            const nameParts = customerName.split(' ');
            firstName = nameParts[0];
            if (nameParts.length > 1) {
                lastName = nameParts[1];
            }
        }
        const subscriptionId = event.data.object.subscription;

        // create license user
        const userBody = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: uuidv4(),
            role: 'user'
        };
        const user = await CryptlexApi.createUser(userBody);

        // create license
        const licenseBody = {
            productId: productId,
            userId: user.id,
            metadata: []
        };
        licenseBody.metadata.push({ key: 'subscription_id', value: subscriptionId, visible: false });
        const license = await CryptlexApi.createLicense(licenseBody);
        console.log("License created successfully!");
        res.json({ key: license.key });
    }
    else {
        return res.json({ "error": "Invalid event!" });
    }
}