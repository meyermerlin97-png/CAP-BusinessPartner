const cds = require('@sap/cds');
//const { val } = require('@sap/cds/lib/ql/cds-ql');

class ReviewBusinessPartner extends cds.ApplicationService {

    init() {
        const { BusinessPartners } = this.entities;

        this.on('SAVE', BusinessPartners, this.sendBP)

        return super.init();
    }

    async sendBP (req, next) {
        const { checkIban, checkAdress } = require('./APIs/api')
        const bp = req.data
        const plz = bp.AdressData[0].plz
        const iban = bp.iban

        let validation_status_adress = 0;
        let validation_status_credit = 0;
        let validation_status_iban = 0;
        let validation_status_general = 0;
        let review_status_general = 0;
        let apiNotice_intern = "API Aufruf war erfolgreich"
        let city = bp.AdressData[0].city

        //Überprüfung Validierung
        async function getAdressStatus(plz) {
            try {
                let status_adress = 0;
                const response = await checkAdress(plz);
                if (response.result && response.result.length > 0) {
                const placeName = response.result[0].attributes.placeName;

                if (placeName.toLowerCase() !== city.toLowerCase()) {
                    status_adress = 10;
                }
                else {
                    status_adress = 0;
                }
                return status_adress;
            } else {
                apiNotice_intern = "Kein Treffer"
            }
            } catch (e) {
                apiNotice_intern = "Api-Aufruf war nicht erfolgreich"
            }
            
        }

        validation_status_adress = await getAdressStatus(plz)
        
        async function getIbanStatus(iban) {
            try {
                let status_iban = 0;
                const response = await checkIban(iban)
                if (response !== true) {
                    status_iban = 10;
                }
                else {
                    status_iban = 0;
                }
                return status_iban;
            } catch(e) {
                apiNotice_intern = "Api-Aufruf war nicht erfolgreich" 
            }
        }

        if (iban) {
            validation_status_iban = await getIbanStatus(iban)
        }

        validation_status_iban = 1 // Test!!!!
        validation_status_adress = 0 // Test!!!!

        if (validation_status_iban === 0 && validation_status_adress === 0) {
            validation_status_general = 0
        } else {
            validation_status_general = 10
            try {
                const validateService = await cds.connect.to('ValidateService')

                const payload = {
                "bpType": bp.bpType,
                "bpRole": bp.bpRole,
                "firstName": bp.firstName,
                "lastName": bp.lastName,
                "birthDate": bp.birthDate,
                "validationStatus_ID": 10,
                "legalForm": {
                "ID": bp.legalForm_ID
                },
                "SalesAreaData": [
                {
                "salesOrg": bp.SalesAreaData[0].salesOrg,
                "distributionChannel": bp.SalesAreaData[0].distributionChannel,
                "divison": bp.SalesAreaData[0].divison,
                "customerGroup": bp.SalesAreaData[0].customerGroup
                },
                {
                "salesOrg": bp.SalesAreaData[1].salesOrg,
                "distributionChannel": bp.SalesAreaData[1].distributionChannel,
                "divison": bp.SalesAreaData[1].distributionChannel,
                "customerGroup": bp.SalesAreaData[1].customerGroup
                }
                ],
                "CompanyCodeData": [
                    {
                    "CompanyCode": bp.CompanyCodeData[0].CompanyCode,
                    "reconciliationAccount": bp.CompanyCodeData[0].reconciliationAccount,
                    "paymentTerm": bp.CompanyCodeData[0].paymentTerm
                    },
                    {
                    "CompanyCode": bp.CompanyCodeData[1].CompanyCode,
                    "reconciliationAccount": bp.CompanyCodeData[1].reconciliationAccount,
                    "paymentTerm": bp.CompanyCodeData[1].paymentTerm
                    }
                ],
                "AdressData": [
                    {
                    "street": bp.AdressData[0].street,
                    "houseNumber": bp.AdressData[0].houseNumber,
                    "plz": bp.AdressData[0].plz,
                    "country": {
                    "code": bp.AdressData[0].country_code
                },
                    "city": bp.AdressData[0].city,
                    "phoneNumber": bp.AdressData[0].phoneNumber,
                    "email": bp.AdressData[0].email
                    }
                ]
            }

            await validateService.create('BusinessPartners', payload )
            return
            } catch(e) {
                apiNotice_intern = 'Validierungsservice konnte nicht gerufen werden'
            }
            
        }

        //Überprüfung 4-Augen nur wenn nicht validiert werden muss
        if (validation_status_general === 0 ) {
            if (bp.creditLimit > 10000) {
            validation_status_credit = 30;
        } else {
            return
        }

        if (validation_status_credit === 0) {
            review_status_general = 0
        } else {
            review_status_general = 30
        }
        }
        if (validation_status_general === 0 && review_status_general === 0) {
            bp.validationStatus_ID = 20;
            return next()
        }

    }

}

module.exports = ReviewBusinessPartner