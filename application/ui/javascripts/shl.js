/**
 * Cancel Button
 * @return {Boolean} false
 */
$(function() {
    $('.cancel-btn').click(function() {
        $( "#dialog-3" ).dialog( "close" );
        return false;
    });
});


$(function() {
    var button = $(".delete");
    $( "#dialog" ).dialog({
        autoOpen: false,
        hide: { effect: "explode", duration: 500 },
        show: { effect: "drop", duration: 350 },
        position: { my: "left-top+20", at: "bottom+55", of: button}
    });
    button.click(function() {
        var id = $(this).closest('td').find('.id').val();
        $('.delete-item')[0].setAttribute('action', "/news/" + id + "?_method=DELETE");
        $( "#dialog" ).dialog( "open" );
    });
});

$(function() {
    var button = $("#opener3");
    $( "#dialog-3" ).dialog({
        autoOpen: false,
        hide: { effect: "explode", duration: 500 },
        show: { effect: "drop", duration: 350 },
        width: 500
    });
    button.click(function() {
        $( "#dialog-3" ).dialog( "open" );
    });
});
//DatePicker
$(function() {
    $("#date").datepicker({dateFormat: 'M dd, yy'});
});

$(document).ready(function () {
    eventFields();
    $("#type").change(function () {
        eventFields();
    });
});

function eventFields() {
    if ($("#type").val() === "Event") {
        $("#eventForm").show();
        $("#msgForm").hide();
    } else {
        $("#eventForm").hide();
        $("#msgForm").show();
    }
}
