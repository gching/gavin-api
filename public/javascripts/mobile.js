// mobile.js
// Main javascript file for mobile devices.

var setupBackgroundVideo = function setupBackgroundVideo(callback){
  $('#my-video').backgroundVideo({
    $videoWrap: $('#video-wrap'),
    $outerWrap: $('#outer'),
    preventContextMenu: true,
    parallax: false
    //parallaxOptions: { effect: 1.7 }
  });
  callback();
};

var getHashValue = function getHashValue(key) {
  return location.hash.match(new RegExp(key+'=([^&]*)'))[1];
};

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

var everythingReady = function everythingReady(){
  $('.loader-body').addClass('loaded');

  // Enable tabs
  $('ul.tabs').tabs();

  // Enable sticky tabs
  $('#stickTabs').stick_in_parent();
  //$('#stickTabs').pushpin({top: "100"});

  // Enable materialbox
  $('.materialboxed').materialbox();

  // Enable materialize parallax if it is not mobile
  // As well, only enable scrollfire for anything other then mobile
  $('.parallax img').addClass("parallaxMobile");
  $('#summary li').css("opacity", 10);
  $('#generalNerd li').css("opacity", 10);
  $('.whereCards').css("opacity", 10);
  $('.whyCards').css("opacity", 10);

  // Enable Scrollspy
  $('.scrollspy').scrollSpy({
    offsetTop: 470
  });

  // On arrowClick on video banner, trigger scroll spy to meSect by clicking.
  $('#arrowClick').on('click', function(e){
    $('a[href=#meSect]').trigger('click');
  });

  $('#contactButton').on('click', function(e){
    $('a[href=#contactSect]').trigger('click');
  });

  // Logic for going to CV section with possible toast.
  if (window.location.hash == "#cv"){
    // Trigger click on CV sect
    $('a[href=#cvSect]').trigger('click');
    // Send a toast saying hi name given params if it is there
    // Also, change the name on the HTML to say name
    var toast_string;

    if (urlParams.name){
      var escaped_name = $('<div>').text(urlParams.name).html();
      toast_string = 'Hi ' + escaped_name + '! ';
      $('#nameCV').html('<strong>' + escaped_name + '</strong>');
    } else {
      toast_string = 'Hi! ';
    }

    toast_string += 'Welcome to my page and CV!';

    Materialize.toast(toast_string, 6000);
    setTimeout(function(){
      var contactString = 'Do contact me if you have any questions!';
      Materialize.toast(contactString, 6000, 'rounded');
    }, 3000);
  } else {
    setTimeout(function(){
      Materialize.toast("By the way!", 6000, 'rounded');
      Materialize.toast("I can bring your idea into life!", 6000, 'rounded');
      Materialize.toast("Contact me!", 6000, 'rounded');
    }, 5000);
  }


};

$(document).ready(function(){
  setupBackgroundVideo(function(){
    setTimeout(function(){
      everythingReady();
    }, 1000);

  });


});
