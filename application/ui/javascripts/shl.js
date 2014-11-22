
$(function() {
    var button = $("#opener");
    $( "#dialog-1" ).dialog({
        autoOpen: false,
        hide: { effect: "explode", duration: 500 },
        show: { effect: "drop", duration: 350 },
        position: { my: "left-top+20", at: "bottom+55", of: button}
    });

    button.click(function() {
        $( "#dialog-1" ).dialog( "open" );
    });
});
$(function() {
    var button = $("#opener2");
    $( "#dialog-2" ).dialog({
        autoOpen: false,
        hide: { effect: "explode", duration: 500 },
        show: { effect: "drop", duration: 350 },
        position: { my: "left-top+20", at: "bottom+55", of: button}
    });
    button.click(function() {
        $( "#dialog-2" ).dialog( "open" );
    });
});
//DatePicker

$(function() {
    $("#date").datepicker({dateFormat: 'M dd, yy'});
});