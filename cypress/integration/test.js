/// <reference types="cypress" />

import requests from '../support/requests/requests'

describe('API testing on GoRest.io', () => {
    before(() => {
        // requests.createDataBase();
        // requests.getAllUsersPerPageAndAddInfoToDatabase(); //Don't run this code, it will take 20 minutes!!!!
        requests.getAllUsersAndCheckInfo();
    })

    it('API testing on Users ', () => {
        requests.getRandomUserAndCheckInfo();
        // requests.createUserAndCheckInfo();
        // requests.getCreatedUserAndChekInfo();
        // requests.editRandomUserInfoWithPatchAndCheckInfo();
        // requests.editRandomUserWithPutAndCheckInfo()
        // requests.deleteUserInfoFromDataBase(4625);
        // requests.getTooManyRequestsMessage();
    });
})