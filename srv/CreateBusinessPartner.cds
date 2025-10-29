using de.cronos.businesspartner as db from '../db';

service CreateBusinessPartner {
    entity BusinessPartners as
        projection on db.BusinessPartners
        excluding {
            apiNotice,
            screeningStatus,
            validationStatus
        };

    @topic: 'businessPartners/created'
    event businessPartnersCreated {
        ID : type of BusinessPartners : ID;
    }
}
