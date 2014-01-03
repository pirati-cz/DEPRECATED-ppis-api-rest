module.exports = User;
// your model functions here

User.prototype.getUppercaseUsername = function() {
    return this.username.toUpperCase();
};
