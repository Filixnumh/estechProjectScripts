jQuery.extend(jQuery.validator.messages, {
    required: "El campo no puede estar vacio.",

    email: "El formato del correo electronico no es correcto.",

});
var v = $("#form-form").validate({
    rules: {

        f_username: {
            required: true
        },
        f_sex: {
            required: true
        },
        f_genre: {
            required: true
        },
        f_fullname: {
            required: true
        },
        f_email: {
            required: true,
            email: true
        }

    },
    errorElement: "span",
    errorClass: "error",
    errorPlacement: function (error, element) {
        error.hide(100).show(500).insertBefore(element);
    }
});

$(".next-btn1").click(function () {
    if (v.form()) {
        $(".tab-pane").hide();
        $("#step2").show(500).fadeIn(1000);
        $('.progressbar-dots').removeClass('active');
        $('.progressbar-dots:nth-child(2)').addClass('active');
    } else {

        shake($(".next-btn"));
    }
});
$(".next-btn2").click(function () {
    if (v.form()) {
        $(".tab-pane").hide();
        $("#step3").show(500).fadeIn(1000);
        $('.progressbar-dots').removeClass('active');
        $('.progressbar-dots:nth-child(3)').addClass('active');
    } else {

        shake($(".next-btn"));
    }
});

$(".submit-btn").click(function () {
    if (v.form()) {
        $("#loader").show(500);
        $(".submit-btn").hide(500);
        setTimeout(function () {
            $("#form-form").hide(0).html("<h2>Enhorabuena " + $("#usr").val() + " has sido registrado con exito!</h2>").show(500);
        }, 5000);
        return false;
    } else {

        shake($(".submit-btn"));
    }
});



function shake(div) {
    var interval = 100;
    var distance = 10;
    var times = 4;

    $(div).css('position', 'relative');

    for (var iter = 0; iter < (times + 1); iter++) {
        $(div).animate({
            left: ((iter % 2 == 0 ? distance : distance * -1))
        }, interval);
    }
    $(div).animate({ left: 0 }, interval);
}


