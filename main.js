var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
var random;
var captcha = '';

var loadFile = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};

function splash() {
    for (i=0; i<6; i++){
        random = Math.floor((Math.random() * 61) + 1);
        captcha+=letters.charAt(random)
    }
    document.getElementById('captcha_text').innerHTML = captcha;
    console.log(captcha)
    if (localStorage.getItem('name') != null) {
        document.getElementById('name').innerHTML = localStorage.getItem('name');
        document.getElementById('ouptut').src = localStorage.getItem('dp');
    }
}