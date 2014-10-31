function TinderMatch(facebookAccountId){
    this.UserInfo = {};
    this.FacebookAccountId = facebookAccountId;
}

TinderMatch.prototype.mapFromApi = function(userInfo) {
    this.UserInfo = userInfo;
};

module.exports = TinderUser;