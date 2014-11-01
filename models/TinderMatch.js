function TinderMatch(userInfo){
    this.UserInfo = userInfo;
    this.TinderId = userInfo._id;
    this.Liked = false;
    this.LikedBack = false;
    this.PickupLine = null;
    this.Response = [];
    this.Success = null;
}

module.exports = TinderMatch;
