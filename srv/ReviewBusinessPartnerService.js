const cds = require('@sap/cds');


class ReviewBusinessPartner extends cds.ApplicationService {

    init() {
        const { BusinessPartners } = this.entities;

        this.after('CREATE', BusinessPartners, this.setValidationStatus)

        return super.init();
    }
}