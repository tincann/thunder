function MatchCriteria(gender, age_min, age_max, location_lat, location_long, city, range, complete){
    this.Gender = gender;
    this.Age = {min: age_min, max: age_max};
    this.Location = {lat: location_lat, long: location_long};
    this.City = city,
    this.Range = range;
    this.Complete = complete;
}

module.exports = MatchCriteria;
