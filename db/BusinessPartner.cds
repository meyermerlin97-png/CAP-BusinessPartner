namespace de.cronos.businesspartner;

using { 
    managed,
    cuid,
    sap.common.CodeList
 } from '@sap/cds/common';

 entity BusinessPartners : cuid, managed {
    bpType: bpType @mandatory;
    bpRole: bpRole @mandatory;
    firstName : String(40);
    lastName : String(40);
    name1: String(40);
    name2: String(40);
    birthDate: Date;
    legalForm: LegalForm;
    iban: String(40);
    creditLimit: Integer;
    apiNotice: String(50);
    screeningStatus: screeningStatus;
    validationStatus: Association to validationStatus;
    SalesAreaData: Composition of many SalesAreas on SalesAreaData.bp = $self;
    CompanyCodeData: Composition of many CompanyCodes on CompanyCodeData.bp = $self;
    AddressData: Composition of many Addresses on AddressData.bp = $self
 }

 aspect validateable {
   
 }

 type bpType : Integer @assert.range enum {
    person = 1;
    organization = 2
 }

 type bpRole : Integer @assert.range enum {
    customer = 1;
    supplier = 2
 }

 type screeningStatus : Integer @assert.range enum {
   passed = 1;
   failed = 2;
 }

entity SalesAreas : managed {
    key bp: Association to BusinessPartners;
    key salesOrg: String(4) @mandatory;
    key distributionChannel : String(2) @mandatory;
    key division : String(2) @mandatory;
    customerGroup: String (10)
}

entity CompanyCodes : managed {
    key bp : Association to BusinessPartners @mandatory;
    key CompanyCode: String(4) @mandatory;
    reconciliationAccount: Integer;
    paymentTerm: paymentTerm;
}

type paymentTerm : Integer @assert.range enum {
   barzahler = 1;
   kredit = 2
}

entity Addresses : cuid, managed {
    key bp : Association to BusinessPartners @mandatory;
    city: String(40) @mandatory;
    street: String(40) @mandatory;
    plz: String(5) @mandatory;
    houseNumber: String(5) @mandatory;
    country: Country;
    phoneNumber: Integer;
    email: String(30);
}

entity validationStatus : CodeList {
   key ID: Integer
}

type LegalForm : Association to legalForms;

entity legalForms : CodeList {
   key ID: String(4)
}

type Country : Association to Countries;

entity Countries : CodeList {
   key code: String(2)
}
 



