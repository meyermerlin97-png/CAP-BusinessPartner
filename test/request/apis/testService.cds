@protocol: 'rest'
service TestService {
    action validateIBAN(iban: String) returns Boolean;
    action validateAddress(plz: String) returns Map;
}
