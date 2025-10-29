namespace de.cronos.businesspartner;

using {
  de.cronos.businesspartner as db
} from '../db/BusinessPartner2'; // Pfad ggf. anpassen

// ---------- Child-Strukturen (spiegeln deine Compositions) ----------

type SalesAreaInput : {
  salesOrg            : String(4);
  distributionChannel : String(2);
  divison             : String(2);
  customerGroup       : String(10);
}

type CompanyCodeInput : {
  CompanyCode           : String(4);
  reconciliationAccount : Integer;
  paymentTerm           : db.paymentTerm;      // Enum aus dem DB-Modell wiederverwenden
}

type AddressInput : {
  city         : String(40);
  street       : String(40);
  plz          : String(5);
  houseNumber  : String(5);
  country_code : String(2);                    // Association -> Schlüsselwert (countries.code)
  phoneNumber  : Integer;
  email        : String(30);
}

// ---------- Root-Struktur (spiegelt BusinessPartners ohne cuid/managed/Associations) ----------

type BusinessPartnerInput : {
  bpType             : db.bpType;              // Enum wiederverwenden
  bpRole             : db.bpRole;              // Enum wiederverwenden

  firstName          : String(40);
  lastName           : String(40);
  name1              : String(40);
  name2              : String(40);
  birthDate          : Date;

  legalForm_ID       : String(4);              // Association LegalForm -> Schlüssel (legalForms.ID)
  iban               : String(40);
  creditLimit        : Integer;
  apiNotice          : String(50);
  screeningStatus    : db.screeningStatus;     // Enum wiederverwenden
  validationStatus_ID: String(15);             // Association validationStatus -> Schlüssel (validationStatus.ID)

  // Compositions als Collections von ComplexTypes:
  SalesAreaData      : many SalesAreaInput;
  CompanyCodeData    : many CompanyCodeInput;
  AdressData         : many AddressInput;      // Feldname wie in deinem Modell (mit einem "d")
}
