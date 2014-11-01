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
        values: [ $('#age_min').val(), $('#age_max').val() ],
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
        values: [$('#rangekm').val()],
        slide: function( event, ui ) {
            $('#rangekm').val(ui.values[0]);
        }
    });

    //Afstand slider
    $('#sample').slider({
        min: 0,
        max: 500,
        values: [$('#samplesize').val()],
        slide: function( event, ui ) {
            $('#samplesize').val(ui.values[0]);
        }
    });

    //submit uitgeschakeld
    $('#filterform').bind("keyup keypress", function(e) {
        if($('#location_input').is(":focus")){
            var code = e.keyCode || e.which;
            if (code  == 13) {
                e.preventDefault();
                return false;
            }
        }
    });

    //label ook aanklikbaar
    $('#loginlist p').click(function(){
        var select = $(this).prev();
        select.trigger('click');
    });

    //open match informatie
    $('.openmatch').click(function(){

        var id = $(this).attr('id');
        console.log(id);

    });

});
