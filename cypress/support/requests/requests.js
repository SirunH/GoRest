/// <reference types="cypress" />

import data from '../data';
import helpers from "../helpers";

const faker = require('@faker-js/faker').faker;

class Requests {
    getAllUsers() {
        return cy.request({
            method: 'GET',
            url: `//users/`,
            auth: {
                bearer: data.token
            }
        })
    }

    getAllUsersPerPageAndAddInfoToDatabase() {
        this.getAllUsers().then(res => {
            let i;
            for (i = 1; i <= res.body.meta.pagination.pages; i++) {
                this.getAllUsersPerPage(i)
            }
        })
    }

    getAllUsersPerPage(page) {
        cy.request({
            method: 'GET',
            url: `//users?page=${page}`,
            auth: {
                bearer: data.token
            }
        }).then(res => {
            res.body.data.forEach(el => {
                this.addUserInfoToDataBase(el.id, el.name, el.email, el.gender, el.status)
            })
        })
    }

    getAllUsersAndCheckInfo() {
        this.getAllUsers().then(res => {
            expect(res.body.code).to.eq(200)
            res.body.data.forEach(el => {
                expect(el.id).not.to.be.null;
            })
            let usersNumber = res.body.data.length;
            let randomIndex = Math.floor(Math.random() * usersNumber);
            let randomUserId = res.body.data[randomIndex].id;
            cy.wrap(randomUserId).as('randomId');
        })
    }

    getUser(id) {
        return cy.request({
            method: 'GET',
            url: `//users/${id}`,
            auth: {
                bearer: data.token
            },
        })
    }

    getUserAndCheckInfo(id) {
        this.getUser(id).then(res => {
            this.getUserInfoFromDataBase(id).then(info => {
                expect(info[0].UserName).to.eq(res.body.data.name);
                expect(info[0].Email).to.eq(res.body.data.email);
                expect(info[0].Gender).to.eq(res.body.data.gender);
                expect(info[0].Status).to.eq(res.body.data.status)
            })
            expect(res.body.data.id).to.eq(id);
            expect(res.body.code).to.eq(200)
        })
    }

    getRandomUserAndCheckInfo() {
        cy.get('@randomId').then(id => {
            this.getUserAndCheckInfo(id);
        })
    }

    createUserAndCheckInfo() {
        cy.request({
            method: 'POST',
            url: `//users/`,
            auth: {
                bearer: data.token
            },
            body: {
                "name": data.userName,
                "gender": data.userGender,
                "email": data.userEmail,
                "status": data.userStatus
            }
        }).then(res => {
            expect(res.body.code).to.eq(201);
            expect(res.body.data.name).to.eq(data.userName);
            expect(res.body.data.gender).to.eq(data.userGender);
            expect(res.body.data.email).to.eq(data.userEmail);
            expect(res.body.data.status).to.eq(data.userStatus);
            cy.wrap(res.body.data.id).as('createdUserId');
            this.addUserInfoToDataBase(res.body.data.id, res.body.data.name, res.body.data.email, res.body.data.gender, res.body.data.status)
        })
    }

    getCreatedUserAndChekInfo() {
        cy.get('@createdUserId').then(id => {
            this.getUserAndCheckInfo(id);
        })
    }

    editUserNameAndCheckInfo(id) {
        let newUserName = faker.internet.userName();
        cy.request({
            method: 'PATCH',
            url: `//users/${id}`,
            auth: {
                bearer: data.token
            },
            body: {
                "name": newUserName
            }
        }).then(res => {
            expect(res.body.data.name).to.eq(newUserName);
            expect(res.body.code).to.eq(200);
        })
    }

    editUserEmailAndCheckInfo(id) {
        let newEmail = faker.internet.email();
        cy.request({
            method: 'PATCH',
            url: `//users/${id}`,
            auth: {
                bearer: data.token
            },
            body: {
                "email": newEmail
            }
        }).then(res => {
            expect(res.body.data.email).to.eq(newEmail);
            expect(res.body.code).to.eq(200);
        })
    }

    defineUserStatus(id) {
        this.getUser(id).then(res => {
            cy.wrap(res.body.status).as('oldStatus')
        })
    }

    defineUserGender(id) {
        this.getUser(id).then(res => {
            cy.wrap(res.body.data.gender).as('oldGender')
        })
    }

    editUserStatusAndCheckInfo(id) {
        this.defineUserStatus(id);
        cy.get('@oldStatus').then(st => {
            if (st === "active")
                this.editUserStatusAndCheckInfo(id, "inactive")
            else
                this.setNewStatusAndChekInfo(id, "active")
        })
    }

    editUserGenderAndCheckInfo(id) {
        this.defineUserGender(id);
        cy.get('@oldGender').then(g => {
            if (g === "male")
                this.setNewGenderAndChekInfo(id, "female")
            else
                this.setNewGenderAndChekInfo(id, "male")
        })
    }


    setNewStatusAndChekInfo(id, newStatus) {
        cy.request({
            method: 'PATCH',
            url: `//users/${id}`,
            auth: {
                bearer: data.token
            },
            body: {
                "status": newStatus
            }
        }).then(res => {
            expect(res.body.data.status).to.eq(newStatus);
            expect(res.body.code).to.eq(200);
        })
    }

    setNewGenderAndChekInfo(id, newGender) {
        cy.request({
            method: 'PATCH',
            url: `//users/${id}`,
            auth: {
                bearer: data.token
            },
            body: {
                "gender": newGender
            }
        }).then(res => {
            expect(res.body.data.gender).to.eq(newGender);
            expect(res.body.code).to.eq(200);
        })
    }

    editUserInfoWithPatchAndCheckInfo(id) {
        let controller = Math.round(Math.random() * 3);
        if (controller === 0)
            this.editUserEmailAndCheckInfo(id);
        else if (controller === 1)
            this.editUserNameAndCheckInfo(id);
        else if (controller === 2)
            this.editUserStatusAndCheckInfo(id);
        else
            this.editUserGenderAndCheckInfo(id);
        this.updateUserInfoInDataBase(id);
    }

    editRandomUserInfoWithPatchAndCheckInfo() {
        cy.get('@randomId').then(id => {
            this.editUserInfoWithPatchAndCheckInfo(id);
        })
    }

    editUserWithPutAndCheckInfo(id) {
        let newName = faker.internet.userName();
        let newEmail = faker.internet.email();
        let newGender = helpers.getRandomGender();
        let newStatus = helpers.getRandomStatus();
        cy.request({
            method: 'PATCH',
            url: `//users/${id}`,
            auth: {
                bearer: data.token
            },
            body: {
                "name": newName,
                "gender": newGender,
                "email": newEmail,
                "status": newStatus
            }
        }).then(res => {
            expect(res.body.code).to.eq(200);
            expect(res.body.data.name).to.eq(newName);
            expect(res.body.data.gender).to.eq(newGender);
            expect(res.body.data.email).to.eq(newEmail);
            expect(res.body.data.status).to.eq(newStatus);
        })
        this.updateUserInfoInDataBase(id)
    }

    editRandomUserWithPutAndCheckInfo() {
        cy.get('@randomId').then(id => {
            this.editUserWithPutAndCheckInfo(id);
        })
    }

    deleteUserAndCheckInfo(id) {
        cy.request({
            method: 'DELETE',
            url: `//users/${id}`,
            auth: {
                bearer: data.token
            }
        }).its('body.code').should('eq', 204)
        this.getUser(id).its("body.code").should("eq", 404)
        this.deleteUserInfoFromDataBase(id);
    }

    deleteRandomUserAndCheckResults() {
        cy.get('@randomId').then(id => {
            this.deleteUserAndCheckInfo
            (id);
        })
    }

    getTooManyRequestsMessage() {
        this.getAllUsers().then(res => {
            if (res.body.code !== 429) {
                this.getTooManyRequestsMessage();
            } else {
                cy.log("429: Too many request!!!")
                expect(res.body.code).to.eq(429)
            }
        })
    }

    createDataBase() {
        cy.task('queryDb', "CREATE TABLE UserInfo (PersonID int NOT NULL , UserName varchar(255) NOT NULL , Email varchar(255) NOT NULL , Gender varchar(20),Status varchar(20))")

    }


    addUserInfoToDataBase(id, name, email, gender, status) {
        cy.task('queryDb', `INSERT INTO UserInfo (PersonID, UserName, Email, Gender, Status) VALUES (${id}, "${name}", "${email}", "${gender}", "${status}");`)
    }

    addAllUsersInfoToDataBase() {
        this.getAllUsers().then(res => {
            res.body.data.forEach(el => {
                this.addUserInfoToDataBase(el.id, el.name, el.email, el.gender, el.status)
            })
        })
    }

    deleteUserInfoFromDataBase(id) {
        cy.task('queryDb', `DELETE FROM UserInfo WHERE PersonID=${id};`)
    }

    updateUserInfoInDataBase(id) {
        this.deleteUserInfoFromDataBase(id);
        this.getUser(id).then(res => {
            this.addUserInfoToDataBase(res.body.data.id, res.body.data.name, res.body.data.email, res.body.data.gender, res.body.data.status)
        })
    }

    getUserInfoFromDataBase(id) {
       return cy.task('queryDb', `SELECT * FROM UserInfo WHERE PersonID=${id};`)
    }
}

module.exports = new Requests();
