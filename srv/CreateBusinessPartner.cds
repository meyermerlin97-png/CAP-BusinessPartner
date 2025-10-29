
using de.cronos.businesspartner as db from '../db/BusinessPartner2';

service CreateBusinessPartner {
    @odata.draft.enabled
    entity BusinessPartners as projection on db.BusinessPartners;
}

