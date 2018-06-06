$(document).ready(function () {

    $reloadDiv = $('#reload');

    $reloadDiv.hover(function () {
        $('#reload svg').addClass('fa-spin');
    }, function () {
        $('#reload svg').removeClass('fa-spin');
    });

});