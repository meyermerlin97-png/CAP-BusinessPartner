using de.cronos.businesspartner as db from '../db/BusinessPartner2';

service ValidateBusinessPartner {
    @odata.draft.enabled
    @Core.OptimisticConcurrency : ['modifiedAt'] 
    @Capabilities.UpdateRestrictions.Updatable : true
    entity BusinessPartners as projection on db.BusinessPartners 
    { *, @odata.etag modifiedAt } where validationStatus.ID = 10;
    
}
