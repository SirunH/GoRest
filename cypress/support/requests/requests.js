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

    getAllUsersAndCheckInfo() {
        this.getAllUsers()
            .then(res => {
                cy.log(res)
                expect(res.body.code).to.eq(200)
                res.body.data.forEach(el => {
                    expect(el.id).not.to.be.null;
                })
                let usersNumber = res.body.data.length;
                let randomIndex = Math.floor(Math.random() * usersNumber);
                let randomUserId = res.body.data[randomIndex].id;
                cy.wrap(randomUserId).as('randomId')
            })
    }

    getUser(id) {
        return cy.request({
            method: 'GET',
            url: `//users/${id}`,
            auth: {
                bearer: data.token
            },
            // failOnStatusCode: false
        })
    }

    getUserAndCheckInfo(id) {
        this.getUser(id).then(res => {
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

    editUserInfoWithPatchAndCheckInfo() {
        cy.get('@randomId').then(id => {
            let controller = Math.round(Math.random() * 3);
            if (controller === 0)
                this.editUserEmailAndCheckInfo(id);
            else if (controller === 1)
                this.editUserNameAndCheckInfo(id);
            else if (controller === 2)
                this.editUserStatusAndCheckInfo(id);
            else
                this.editUserGenderAndCheckInfo(id)
        })
    }

    editUserWithPutAndCheckInfo() {
        let newName = faker.internet.userName();
        let newEmail = faker.internet.email();
        let newGender = helpers.getRandomGender();
        let newStatus = helpers.getRandomStatus();
        cy.get('@randomId').then(id => {
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
    }

    deleteRandomUserAndCheckResults() {
        cy.get('@randomId').then(id => {
            this.deleteUserAndCheckInfo(id);
        })
    }

    getUserPosts(id) {
        cy.request({
            method: 'GET',
            url: `//users/${id}/posts`,
            auth: {
                bearer: data.token
            }
        }).then(res => {
            cy.log(res)
        })
    }

    getAllPosts() {
        cy.request({
            method: 'GET',
            url: `//posts`,
            auth: {
                bearer: data.token
            }
        }).then(res => {
            cy.log(res)
        })
    }

    addPost(id) {
        cy.request({
            method: 'Post',
            url: `//users/${id}/posts`,
            auth: {
                bearer: data.token
            },
            body: {
                "user": id,
                "title": data.userPostTitle,
                "body": data.userPostContent
            }
        }).then(res => {
            cy.log(res)
        })
    }

    addUserPost() {
        cy.get('@randomId').then(id => {
            this.addPost(id)
        })
    }

    getTooManyRequestsMessage() {
        let i;
        for(i = 0; i < 1000; i++) {
            this.getAllUsers().its('body.code').should('not.eq', 429)
        }
    }


}

module.exports = new Requests();
