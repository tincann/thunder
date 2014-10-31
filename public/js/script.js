/**
 * Created by daniel.bronk on 10/31/14.
 */

$(document).ready(function(){

    //geslacht radio buttons
    $('#gender').buttonset();

    //leeftijd slider
    $('#age').slider({
        range: true,
        min: 18,
        max: 99,
        values: [ 25, 35 ],
        slide: function( event, ui ) {
            $('#age_min').val(ui.values[0]);
            $('#age_max').val(ui.values[1]);
        }
    });

    //Ophalen van lat en lng en autocomplete adres
    var autocomplete = new google.maps.places.Autocomplete((document.getElementById('location_input')),{ types: ['geocode'] });
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        $('#location_lat').val(place.geometry.location.lat());
        $('#location_lng').val(place.geometry.location.lng());
    });

    //Afstand slider
    $('#range').slider({
        min: 0,
        max: 500,
        values: [50],
        slide: function( event, ui ) {
            $('#rangekm').val(ui.values[0]);
        }
    });

    //Afstand slider
    $('#sample').slider({
        min: 0,
        max: 500,
        values: [50],
        slide: function( event, ui ) {
            $('#samplesize').val(ui.values[0]);
        }
    });

});
