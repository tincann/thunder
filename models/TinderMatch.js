function TinderMatch(facebookAccountId, userInfo){
    this.FacebookAccountId = facebookAccountId;
    this.UserInfo = userInfo;
    this.TinderId = userInfo._id;

}

module.exports = TinderMatch;
