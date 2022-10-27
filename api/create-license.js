const { v4: uuidv4 } = require('uuid');
const CryptlexApi = require('./_utils/CryptlexApi');
const config = require('./_utils/config.js');

const productId = config.productId;

module.exports = async (req, res) => {
    let event = req.body;

    if( event == null || event.type == null) {
        return res.status(400).json({"error" : "Invalid request!"});
    }

    switch (event.type) {
        case 'customer.created':
            break;
        default:
            return res.json({ event : event.type});
    }

    // get post params from request body
    const customer = event.data.object;
    const email = customer.email;
    let firstName = 'John', lastName = '_';
    if (customer.name) {
        const nameParts = customer.name.split(' ');
        firstName = nameParts[0];
        if (nameParts.length > 1) {
            lastName = nameParts[1];
        }
    }
    const customerId = customer.id;

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
    licenseBody.metadata.push({ key: 'customer_id', value: customerId, visible: false });
    const license = await CryptlexApi.createLicense(licenseBody);
    console.log("License created successfully!");
    res.json({ key: license.key });
}