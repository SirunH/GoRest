/// <reference types="cypress" />

import requests from '../support/requests/requests'

describe('API testing on GoRest.io', () => {
    before(() => {
        // requests.createDataBase(); // Run this code only once, as it creates Data Base
        // requests.getAllUsersPerPageAndAddInfoToDatabase(); //Don't run this code, it may take 20 minutes!!!! It will get all users info from all pages and add it to Data Base.
        requests.addAllUsersInfoToDataBase();
        requests.getAllUsersAndCheckInfo();
    })

    it('API testing on Users ', () => {
        requests.getRandomUserAndCheckInfo();
        requests.createUserAndCheckInfo();
        requests.getCreatedUserAndChekInfo();
        requests.editRandomUserInfoWithPatchAndCheckInfo();
        requests.editRandomUserWithPutAndCheckInfo()
        requests.deleteRandomUserAndCheckResults();
        requests.getTooManyRequestsMessage();
    });
})