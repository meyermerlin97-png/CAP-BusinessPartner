using CreateBusinessPartner as service from '../../srv/CreateBusinessPartner';
annotate service.BusinessPartners with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'bpType',
                Value : bpType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'bpRole',
                Value : bpRole,
            },
            {
                $Type : 'UI.DataField',
                Label : 'firstName',
                Value : firstName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'lastName',
                Value : lastName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'name1',
                Value : name1,
            },
            {
                $Type : 'UI.DataField',
                Label : 'name2',
                Value : name2,
            },
            {
                $Type : 'UI.DataField',
                Label : 'birthDate',
                Value : birthDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'legalForm_ID',
                Value : legalForm_ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'iban',
                Value : iban,
            },
            {
                $Type : 'UI.DataField',
                Label : 'creditLimit',
                Value : creditLimit,
            },
            {
                $Type : 'UI.DataField',
                Label : 'apiNotice',
                Value : apiNotice,
            },
            {
                $Type : 'UI.DataField',
                Label : 'screeningStatus',
                Value : screeningStatus,
            },
            {
                $Type : 'UI.DataField',
                Label : 'validationStatus_ID',
                Value : validationStatus_ID,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },{
            $Type : 'UI.ReferenceFacet',
            Target : 'AdressData/@UI.LineItem',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'bpType',
            Value : bpType,
        },
        {
            $Type : 'UI.DataField',
            Label : 'bpRole',
            Value : bpRole,
        },
        {
            $Type : 'UI.DataField',
            Label : 'firstName',
            Value : firstName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'lastName',
            Value : lastName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'name1',
            Value : name1,
        },
    ],
);
annotate service.Addresses with @(

    UI.LineItem: [{
        $Type : 'UI.DataField',
        Value : ID,
    },]
);

annotate CreateBusinessPartner with @(Capabilities: {
    InsertRestrictions.Insertable: true,
    UpdateRestrictions.Updateble: true,
    DeleteRestrictions.Deletable: true
}) {
    
}