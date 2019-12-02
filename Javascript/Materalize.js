document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
        preventScrolling: true,
        opacity: 0.6,
        endingTop: '25%'
    });
});


//validation of password;
function validate() {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    var password = document.getElementById('password').value;

    if (!strongRegex.test(password)) {
        document.getElementById('pshow').innerHTML = 'password must contain 8 letters,1 upper & lower case contain 1 digit,1 special character'
        return false;
    }

}