$(window).scroll(function(){
    if ($(this).scrollTop() > 50) {
       $('#dynamic').addClass('opaque-navbar');
    } else {
       $('#dynamic').removeClass('opaque-navbar');
    }
});


// figure out how to convert the html to readable format