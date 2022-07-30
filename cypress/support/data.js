import helpers from './helpers';

const faker = require('@faker-js/faker').faker;



let name = faker.internet.userName();
let email = faker.internet.email();
let gender = helpers.getRandomGender();
let status = helpers.getRandomStatus();

module.exports = {
    token: 'caab1a95912d433aa042414ebb5e92071b4adb2d6f1dc9d74ca184d4e585aedb',
    userName: name,
    userEmail: email,
    userGender: gender,
    userStatus: status,
    userPostTitle: postTitle,
    userPostContent: postContent
}