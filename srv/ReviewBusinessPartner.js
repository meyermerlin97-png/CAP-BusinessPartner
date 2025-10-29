const cds = require('@sap/cds');
const DEBUG = cds.debug('review');

module.exports = class ReviewBusinessPartner extends cds.ApplicationService {

    init() {
        const { BusinessPartners } = this.entities;

        this.after('CREATE', BusinessPartners, req => {
            DEBUG?.('Reviewing Business Partner:', req);
        })

        return super.init();
    }
}