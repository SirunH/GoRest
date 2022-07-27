
let randomNumber = Math.round(Math.random())

module.exports = {
    getRandomGender(randomNumber) {
        if (randomNumber === 0)
            return 'male';
        else
            return 'female'
    },

    getRandomStatus(randomNumber) {
        if (randomNumber === 0)
            return 'active';
        else
            return 'inactive'
    }
}
