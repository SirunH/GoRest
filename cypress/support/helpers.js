let randomNumber = Math.round(Math.random())

module.exports = {
    getRandomGender() {
        if (randomNumber === 0)
            return 'male';
        else
            return 'female'
    },

    getRandomStatus() {
        if (randomNumber === 0)
            return 'active';
        else
            return 'inactive'
    }
}
