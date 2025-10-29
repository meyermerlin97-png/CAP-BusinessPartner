const cds = require('@sap/cds')
const { checkIban, checkAdress } = require('../../../srv/APIs/api')
const { protocols } = require('@sap/cds/lib/env/defaults')

module.exports = class TestService extends cds.ApplicationService {
    async init() {
        this.on('validateIBAN', async (req) => {
            const { iban } = req.data
            const isValid = await checkIban(iban)
            return isValid
        })

        this.on('validateAddress', async (req) => {
            const { plz } = req.data
            return checkAdress(plz)
        })
    }
}