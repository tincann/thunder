/**
 * Created by daniel.bronk on 10/31/14.
 */

$(document).ready(function(){

    var searchId = $('.searchdrop').val();

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

    //ander zoekopdracht
    $('.searchdrop').change(function () {
        searchId = this.value;
        console.log(searchId);

        /*
        $.ajax({
            url:'url??',
            success:function(data){
                console.log('succes!');
        }});
        */

    });

    function getAllMatchData(){
        $.ajax({
            url:'/status/getMatchesList?id=' + searchId,
            success:function(data){
                $('#matchlist').fadeOut(function(){
                    $('#matchlist').html('');
                    $('#matchlist').show();
                    $(data).each( function( index, el ) {

                        console.log(el);

                        var gender = el.gender;
                        if(gender == 'm'){
                            gender = ' Guy';
                        }else{
                            gender = ' Girl';
                        }

                        var hide = 'hidden_'+index;
                        var html = '<div style="display: none;" class="match '+hide+'">'
                                    +'<div class="photo_wrap">'
                                        +'<div style="background-image: url('+ el.photo +');" class="photo"></div></div>'
                                    +'<div class="wrap_text">'
                                        +'<div class="text">'
                                        +'<div class="name">'+ el.name + ' | ' + el.age + ' | ' + gender +'</div>'
                                        //+'<div>'+ el.age + gender +'</div>'
                                        +'<div>'+ el.bio +'</div>'
                                        +'<div>'+ Math.round((el.distance * 1.609344)) +' KM</div>'
                                        +'</div>'
                                        +'<div class="button">'+ el.status +'</div></div>'
                                  +'</div>';

                        //input(type='submit', id="12345" class="submit_btn openmatch", name='select' value='open')

                        $('#matchlist').append(html);
                        $('.'+hide).delay(150*index).fadeIn();
                    });
                });
            }
        });
    }

    $('#reload').click(function () {
        getAllMatchData();
    });

});
