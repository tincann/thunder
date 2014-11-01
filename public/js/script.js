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
                                        +'<div class="button"><div id="'+el.match_id+'" class="getstatus">Status: '+ el.status +'</div></div></div>'
                                  +'</div>';

                        $('#matchlist').append(html);
                        $('.'+hide).delay(150*index).fadeIn();
                    });

                    $('.getstatus').click(function () {
                        var id = $(this).attr('id');
                        $('#panel, #panelbg').fadeIn();
                        $.ajax({
                            url:'/status/getmatch?order_id='+searchId+'&match_id='+id,
                            success:function(data){

                                console.log(data);

                                var message = '<div class="response_text" style="color: #f15a24;">'+data.pickupline+'</div>';
                                $(data.responses).each( function( index, txt ) {
                                    message += '<div class="response_text">'+txt+'</div>';
                                });

                                var html_match = '<div class="match">'
                                    +'<div class="photo_wrap">'
                                    +'<div style="background-image: url('+ data.photo +');" class="photo"></div></div>'
                                    +'<div class="wrap_text">'
                                    +'<div class="text">'
                                    +'<div class="name">'+ data.name + ' | ' + data.age + ' | ' + data.gender +'</div>'
                                    +'<div class="bio">'+ data.bio +'</div>'
                                    +'<div>'+ Math.round((data.distance * 1.609344)) +' KM</div>'
                                    +'</div>'
                                    +'</div>'
                                    //+'<div class="button">Status: '+ data.status +'</div></div>'
                                    +'</div>'
                                    +'<div class="text_response">'+message+'</div>'
                                    +'<div class="knop_response">Goed - Fout</div>';

                                $('#panel').html(html_match);

                            }
                        });

                    });

                });
            }
        });
    }

    $('#reload').click(function () {
        getAllMatchData();
    });

    $('#panelbg').click(function () {
        $('#panel, #panelbg').fadeOut();
    });

});

/*
age: 22
bio: "Slide slide slide. If we match, you matched a cow. Psychology/traveling/guitar/friends/food."
distance: 52.800000000000004
gender: "m"
match_id: "5251dfbe02233e53560004c2"
name: "René"
order_id: "5454aa65fbf120f01e252e81"
photo: "http://images.gotinder.com/5251dfbe02233e53560004c2/b184457b-6c2a-4071-a99f-b6cda9d0ad39.jpg"
responses
    */