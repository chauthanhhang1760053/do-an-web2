let linkAPI = "https://side-web2020.herokuapp.com/api"

// page login,active,....
function AddError(txt) {
    $('.form-error').empty();
    $(`  <p style="color: red; margin-top: 10px;">* ${txt}</p>`).appendTo('.form-error');
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}



$('#logout').click(function (e) {
    e.preventDefault();
    $.get("/api/logout",
        function (data, textStatus, jqXHR) {
            if (data) {
                $(location).attr('href', '/login');
            }
        },
    );
});

$(document).on('click', '#close', function (e) {
    e.preventDefault();
    $('.login').fadeOut(300);
});

