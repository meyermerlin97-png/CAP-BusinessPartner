sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"validatebp/test/integration/pages/BusinessPartnersList",
	"validatebp/test/integration/pages/BusinessPartnersObjectPage"
], function (JourneyRunner, BusinessPartnersList, BusinessPartnersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('validatebp') + '/test/flp.html#app-preview',
        pages: {
			onTheBusinessPartnersList: BusinessPartnersList,
			onTheBusinessPartnersObjectPage: BusinessPartnersObjectPage
        },
        async: true
    });

    return runner;
});

