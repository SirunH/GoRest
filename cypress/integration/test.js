/// <reference types="cypress" />

import requests from '../support/requests/requests'

describe('API testing on GoRest.io', () => {
    it('API testing on Users ', () => {
        requests.getAllUsersAndCheckInfo();
        requests.getRandomUserAndCheckInfo();
        requests.createUserAndCheckInfo();
        requests.getCreatedUserAndChekInfo();
        requests.editUserInfoWithPatchAndCheckInfo();
        requests.editUserWithPutAndCheckInfo();
        requests.deleteRandomUserAndCheckResults();
        requests.getTooManyRequestsMessage();
    });
})