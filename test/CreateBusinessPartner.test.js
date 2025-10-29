const cds = require('@sap/cds')

describe('CreateBusinessPartner Service', () => {
    const test = cds.test('serve', '--in-memory')
    test.axios.defaults.auth = { username: 'system', password: 'secret' }

    it('should create a Business Partner', async () => {
        const newBP = {
            bpType: 1,
            bpRole: 1,
            firstName: 'John',
            lastName: 'Doe',
            name1: 'Doe Enterprises',
            iban: 'DE89370400440532013000',
            AdressData: [
                {
                    street: 'Main Street',
                    houseNumber: '1',
                    city: 'Berlin',
                    plz: '10115',
                    country_code: 'DE',
                },
            ],
        }

        const res = await test.axios.post('/odata/v4/create-business-partner/BusinessPartners', newBP)

        expect(res.status).toBe(201)
        expect(res.data.bpType).toBe(newBP.bpType)
        expect(res.data.bpRole).toBe(newBP.bpRole)
    })

    it('should fail to create a Business Partner with invalid data', async () => {
        const invalidBP = {
            bpType: 3, // Invalid bpType
            bpRole: 1,
            firstName: 'Jane',
            lastName: 'Doe',
        }

        try {
            await test.axios.post('/odata/v4/create-business-partner/BusinessPartners', invalidBP)
        } catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.response.data.error.target).toMatch(/bpType/)
            expect(error.response.data.error.message).toMatch(/invalid/)
        }
    })
})
