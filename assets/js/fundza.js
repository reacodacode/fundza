$(document).ready(function () {
    $('select').material_select();

    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 15,
        today: 'Today',
        clear: 'Clear',
        close: 'ok',
        closeOnSelect: false
    });

    $('.modal').modal({
        dismissible: true,
        opacity: 0.7,
        inDuration: 300,
        outDuration: 200,
        startingTop: '4%',
        endingTop: '10%'
    });

    $('.collapsible').collapsible();

});