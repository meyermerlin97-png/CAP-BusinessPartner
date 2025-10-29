"use strict"
const axios = require("axios");

module.exports.checkIban = function checkIban(iban) {
    return axios.get("https://api.ibantest.com/v1/validate_iban/" + iban, {
        params: {
            token: "5df8045269df137316e111bde690acfc"
        }
    })
    .then((response) => response.data['valid'])
}

module.exports.checkAdress = function checkAdress(plz) {
    return axios.get("https://zip-api.eu/api/v2/info/zip", {
        headers: {
            Authorization: 'Bearer RH54olaetGGz8nIpYsbe0ff7zTrs30UWC7FUlPmpxIDBTFD0'
        },
        params: {
            countryCode: 'DE',
            postalCode: plz,
        }
    })
    .then((response) => response.data)
}