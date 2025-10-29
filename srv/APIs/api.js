'use strict'

module.exports.checkIban = async function checkIban(iban) {
    const iban_service = await cds.connect.to('iban_test')
    return iban_service.get(`/${iban}`).then(
        (data) => data['valid']
    )
}

module.exports.checkAdress = async function checkAdress(plz) {
    const address_service = await cds.connect.to('plz_test')
    return address_service.get(`/zip`, { params: { countryCode: 'DE', postalCode: plz } })
}
