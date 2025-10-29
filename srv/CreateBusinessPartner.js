const cds = require('@sap/cds')

module.exports = class CreateBusinessPartner extends cds.ApplicationService {
    init() {
        const { BusinessPartners } = this.entities

        this.before('CREATE', BusinessPartners, this.checkBusinessPartnerData)

        this.before('CREATE', BusinessPartners, this.setValidationStatus)

        //this.on('CREATE', BusinessPartners, this.sendBP)

        this.after('CREATE', BusinessPartners, this.emitEvent.bind(this))

        return super.init()
    }

    async emitEvent(data) {
        await this.emit('BusinessPartnerCreated', { ID: data.ID })
    }

    checkBusinessPartnerData(req) {
        const { bpType, firstName, lastName, name1, name2, birthDate, legalForm } = req.data
        const bp = req.data
        const birth = new Date(birthDate)

        //Prüfung bpType-Felder
        if (bpType === 1) {
            if (!firstName || !lastName) {
                req.error('Der Geschäftspartnertyp 1 erfordert einen Vornamen und einen Nachnamen.')
                return
            }

            if (!birth) {
                req.error('Der Geschäftspartnertyp 1 erfordert ein Geburtsdatum')
                return
            }
        } else if (bpType === 2) {
            if (!name1 && !name2) {
                req.error('Der Geschäftspartnertyp 2 erfordert einen Namen')
            } else if (!name1) {
                if (name2) {
                    bp.name1 = name2
                    bp.name2 = ''
                }
            }

            if (!legalForm) {
                req.error('Der Geschäftspartnertyp 2 erfordert eine Rechtsform')
            }
        }
    }

    async setValidationStatus(req) {
        const { checkIban, checkAdress } = require('./APIs/api')
        const { iban, bpRole, AdressData, email, creditLimit, firstName, lastName, name1, name2 } = req.data
        const bp = req.data

        let validation_status_iban = 0
        let validation_status_iban2 = 0
        let validation_status_adress = 0
        let validation_status_email = 0
        let validation_status_credit = 0
        let validation_status_screening = 0
        let validation_status = 0
        let apiNotice_intern = 'Api-Aufruf war erfolgreich'
        let plz = AdressData[0].plz
        let city = AdressData[0].city

        //Überprüfung Adresse und ggf. Korrektur
        async function getAdressStatus(plz) {
            try {
                let status_adress = 0
                const response = await checkAdress(plz)
                if (response.result && response.result.length > 0) {
                    const placeName = response.result[0].attributes.placeName

                    if (placeName.toLowerCase() !== city.toLowerCase()) {
                        status_adress = 10
                    } else {
                        status_adress = 0
                    }
                    return status_adress
                } else {
                    apiNotice_intern = 'Kein Treffer'
                }
            } catch (e) {
                apiNotice_intern = 'Api-Aufruf war nicht erfolgreich'
            }
        }

        validation_status_adress = await getAdressStatus(plz)

        //Überprüfung IBAN
        async function getIbanStatus(iban) {
            try {
                let status_iban = 0
                const response = await checkIban(iban)
                if (response !== true) {
                    status_iban = 10
                } else {
                    status_iban = 0
                }
                return status_iban
            } catch (e) {
                apiNotice_intern = 'Api-Aufruf war nicht erfolgreich'
            }
        }

        if (iban) {
            validation_status_iban = await getIbanStatus(iban)
        }

        //Überprüfung Email
        if (email) {
            const emailRegex = /^(?!.*\s)[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/
            if (!emailRegex.test(email)) {
                validation_status_email = 10
            }
        }

        if (validation_status_adress === 0 && validation_status_iban === 0 && validation_status_email === 0) {
            //bp.validationStatus_ID = 20;
            validation_status = 20 //valide
        } else {
            //bp.validationStatus_ID = 10;
            validation_status = 10 // nicht valide
        }

        //Prüfungen für 4-Augen-Prinzip nur wenn die Daten valide sind
        if (validation_status === 20) {
            if (bpRole === 2 && iban) {
                validation_status_iban2 = 30
            }

            if (creditLimit > 10000) {
                validation_status_credit = 30
            }

            //Sanktionslistenscreening
            const fs = require('fs/promises')

            async function screening(fn, ln, n1, n2) {
                try {
                    const jsonobject = await fs.readFile('./srv/JSON/screening.json', 'utf-8')
                    const screeningList = JSON.parse(jsonobject)

                    for (const object of screeningList.sdnEntry) {
                        if (
                            object.firstName === fn ||
                            object.lastName === ln ||
                            object.firstName === n1 ||
                            object.firstName === n2 ||
                            object.lastName === n1 ||
                            object.firstName === n2
                        ) {
                            bp.screeningStatus = 2
                            validation_status_screening = 2
                            break
                        } else {
                            bp.screeningStatus = 1
                            validation_status_screening = 1
                        }
                    }
                } catch (e) {
                    apiNotice_intern = 'Json-Datei konnte nicht gelesen werden'
                }
            }

            screening(firstName, lastName, name1, name2)

            if (validation_status_iban2 !== 0 || validation_status_credit !== 0 || validation_status_screening === 2) {
                //bp.validationStatus_ID = 30;
                validation_status = 30
            }

            bp.validationStatus_ID = validation_status
        }
        validation_status = 10 // Test!!!!
        bp.validationStatus_ID = validation_status
        bp.apiNotice = apiNotice_intern
    }

    /* Do not call this here, call it after it being reviewed and validated
    async callBPAPI(req) {
        if (!req) {
            return
        }
        const bp = req
        let apiNotice
        if (bp.validationStatus_ID === 20) {
            //Senden an BP-Api

            try {
                const API_BP = await cds.connect.to('API_BUSINESS_PARTNER')

                const payload = {
                    bpType: bp.bpType,
                    bpRole: bp.bpRole,
                    firstName: bp.firstName,
                    lastName: bp.lastName,
                    birthDate: bp.birthDate,
                    legalForm: {
                        ID: bp.legalForm.ID,
                    },
                    SalesAreaData: [
                        {
                            salesOrg: bp.SalesAreaData.salesOrg,
                            distributionChannel: bp.SalesAreaData.distributionChannel,
                            divison: bp.SalesAreaData.divison,
                            customerGroup: bp.SalesAreaData.customerGroup,
                        },
                        {
                            salesOrg: bp.SalesAreaData.salesOrg,
                            distributionChannel: bp.SalesAreaData.distributionChannel,
                            divison: bp.SalesAreaData.distributionChannel,
                            customerGroup: bp.SalesAreaData.customerGroup,
                        },
                    ],
                    CompanyCodeData: [
                        {
                            CompanyCode: bp.CompanyCodeData.CompanyCode,
                            reconciliationAccount: bp.CompanyCodeData.reconciliationAccount,
                            paymentTerm: bp.CompanyCodeData.paymentTerm,
                        },
                        {
                            CompanyCode: bp.CompanyCodeData.CompanyCode,
                            reconciliationAccount: bp.CompanyCodeData.reconciliationAccount,
                            paymentTerm: bp.CompanyCodeData.paymentTerm,
                        },
                    ],
                    AdressData: [
                        {
                            street: bp.AdressData[0].street,
                            houseNumber: bp.AdressData[0].houseNumber,
                            plz: bp.AdressData[0].plz,
                            country: {
                                code: bp.AdressData[0].country.code,
                            },
                            city: bp.AdressData[0].city,
                            phoneNumber: bp.AdressData[0].phoneNumber,
                            email: bp.AdressData[0].email,
                        },
                    ],
                }

                await API_BP.create('BusinessPartners', payload)
            } catch (e) {
                apiNotice = 'BP-API konnte nicht gerufen werden'
            }
        } else {
            return
        }
    }
    */
}
