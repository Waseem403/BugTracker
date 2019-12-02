// Initialize Firebase
var config = {
    apiKey: "AIzaSyCrEvejbtq5KgMACIpqNS1jJHhi31xenwQ",
    authDomain: "bug-tracker-4b4b3.firebaseapp.com",
    databaseURL: "https://bug-tracker-4b4b3.firebaseio.com",
    projectId: "bug-tracker-4b4b3",
    storageBucket: "",
    messagingSenderId: "503534078521"
};
firebase.initializeApp(config);

var database = firebase.database()

//adding event listener for the add function
document.getElementById('add_issues').addEventListener('submit', saveIssue);

function saveIssue(e) {
    e.preventDefault();

    //getting all the field values from the form
    var issueId = chance.guid();
    var badgeId = chance.guid();
    var cpr = document.getElementById("cpr").value
    var catid = document.getElementById("catid").value;
    var description = document.getElementById("description").value
    var asgteam = document.getElementById('asgteam').value;
    var password = document.getElementById("password").value
    var email = document.getElementById('email').value;
    var ind = email.indexOf("@");
    var username = email.slice(0, ind);
    var issueStatus = 'Open';


    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if (!strongRegex.test(password)) {
        document.getElementById('pshow').innerHTML = 'password must contain 8 letters,1 upper & lower case contain 1 digit,1 special character'
        return false;
    } else {
        //calling function which write data into firebase
        writeUserData(issueId, badgeId, cpr, catid, description, asgteam, email, password, username, issueStatus);
    }

    //resetting the form fields to null after submiting data
    document.getElementById('add_issues').reset();
}


//saving issues to firebase database
function writeUserData(issueId, badgeId, cpr, catid, description, asgteam, email, password, username, issueStatus) {
    var Issues = firebase.database().ref('Issues')
    var Issues = Issues.push();
    Issues.set({
        issueId: issueId,
        badgeId: badgeId,
        cpr: cpr,
        catid: catid,
        description: description,
        asgteam: asgteam,
        email: email,
        password: password,
        username: username,
        issueStatus: issueStatus,
        date: Date(Date.now())

    }, function (error) {
        if (error) {
            swal({
                text: "Error in adding issue to server",
                icon: "error",
            });
        } else {
            swal({
                text: "Issue is added to server.",
                icon: "success",
            });
        }

    });

}

//event listener for fecth data from the database
window.addEventListener('load', fetch_issue)

//function which return the data from the firebase
function fetch_issue() {

    var ref = database.ref('Issues');

    ref.on('value', got_data, err_data);

}


//function which fetch the issues from the firebase database
function got_data(Issues) {
    var output = ``
    var Issues = Issues.val();

    if (Issues !== null) {
        var keys = Object.keys(Issues);
        for (var i = 0; i < keys.length; i++) {

            var si = i + 1
            var k = keys[i];
            var issueId = Issues[k].issueId
            var cpr = Issues[k].cpr;
            var catid = Issues[k].catid;
            var description = Issues[k].description;
            var asgteam = Issues[k].asgteam;
            var username = Issues[k].username;
            var date = Issues[k].date;
            var status = Issues[k].issueStatus;
            var badgeId = Issues[k].badgeId;

            output += `<tr> 
         <td>${si}</td>
         <td><a href="https://enable.lrn.com/browse/${cpr}" target="_blank">${cpr}</a></td>
         <td>${catid}</td>
         <td>${description}</td>
         <td>${asgteam}</td>
         <td>${username}</td>
         <td>${date}</td>
         <td><span class="new badge red" style="letter-spacing:1px;" data-badge-caption="" id="${badgeId}">${status} </span> <i class="fas fa-edit" style="color:#82b1ff;cursor:pointer" onclick="setStatusClosed('${issueId}')"   id="${issueId}"></i></td>
         </tr>`

            //showing the result data into the table using tbody
            document.getElementById('tbody').innerHTML = output;
            //hiding the loader  whent the data is retrieving is completed
            document.getElementById("load").style.display = 'none';
        }
    } else if (Issues == null) {
        //showing the result data into the table using tbody
        swal({
            text: "No issues are found in the data-base!",
            icon: "info",
        });
        //hiding the loader  whent the data is retrieving is completed
        document.getElementById("load").style.display = 'none';
    }
    check_status();
}

//function which cathc if any error occured
function err_data() {
    console.log("error")
}


//function which closed the status of the bug

function setStatusClosed(id) {

    swal({
        content: {
            element: "input",
            attributes: {
                placeholder: "Enter Your Password",
                type: "password",

            },
        },
    }).then((password) => {

        var ref = database.ref('Issues');

        ref.on('value', (Issues => {
            var Issues = Issues.val();
            var keys = Object.keys(Issues);
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var password1 = Issues[k].password;
                var issueId = Issues[k].issueId
                var status = Issues[k].issueStatus

                if (issueId == id) {
                    if (password1 === password) {
                        var ref1 = database.ref('Issues/' + k);
                        ref1.update({
                            "issueStatus": "Closed"
                        });
                        swal({
                            text: "Status is closed now",
                            icon: "success",
                        });

                    } else {
                        swal({
                            text: "Invalid password",
                            icon: "error",
                        });
                    }

                }

            }

        }));

    });
}

//event listener for edit_hide function..

window.addEventListener('load', edit_hide)

//function which hide the edit option if the status of the ticket is closed

function edit_hide(id, cat) {
    var Closed = "Closed";
    var ref = database.ref('Issues');

    ref.on('value', Issues => {
        var Issues = Issues.val();
        var keys = Object.keys(Issues);

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var badgeId = Issues[k].badgeId;
            var issueId = Issues[k].issueId;
            var status = Issues[k].issueStatus;
            //  console.log(status + issueId)
            if (status === Closed) {
                document.getElementById(issueId).style.display = 'none';
                document.getElementById(badgeId).className = 'new badge green'
            }

        }
    });


}

//function which check the status and output the total number of tickets open or closed
function check_status() {

    var ref = database.ref('Issues');

    ref.on('value', Issues => {
        var Closed = 0;
        var Opened = 0;
        var Closed1 = 'Closed'
        var Issues = Issues.val();
        var keys = Object.keys(Issues);

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var status = Issues[k].issueStatus;

            if (status === Closed1) {
                Closed++;
            } else if (status !== Closed1) {
                Opened++;
            }

        }

        document.getElementById("open").innerHTML = `<span class="new badge red" style="letter-spacing:1px;" data-badge-caption="">Status opened : ${Opened} Found</span>`;
        document.getElementById("close").innerHTML = `<span class="new badge green" style="letter-spacing:1px;" data-badge-caption="">Status closed : ${Closed} Found</span>`
        Issues.onreadystatechange = function () {
            var state = document.readyState
            if (state == 'complete') {
                document.getElementById('interactive');
                document.getElementById('load').style.visibility = "hidden";
            }
        }
    });


}

//event listener for forget_password form

document.getElementById('forget_password').addEventListener('submit', forget_password)

//function which return the password
function forget_password(e) {
    e.preventDefault();
    var email = document.getElementById('email1').value.toLowerCase();
    var cpr = document.getElementById('cpr1').value.toLowerCase();

    var ref = database.ref('Issues');

    ref.on('value', Issues => {
        var Issues = Issues.val();
        var keys = Object.keys(Issues);

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var emails = Issues[k].email;
            var cprs = Issues[k].cpr.toLowerCase();
            var password = Issues[k].password

            if (cprs == cpr) {
                if (emails == email) {
                    swal({
                        text: "your password is " + password,
                        icon: "success",
                    });
                    break;
                } else {
                    swal({
                        text: "e-mail and cpr number is not matching",
                        icon: 'error'
                    });
                    break;
                }
            } else {
                swal({
                    text: "e-mail and cpr number is not matching",
                    icon: 'error'
                });
            }


        }

    });


    //resetting the form fields to null after submiting data
    document.getElementById('forget_password').reset();
}