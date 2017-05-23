
// Returns true if a given string is a letter
function isLetter(str) {
    var letter = /^[a-z]+$/;
    if ((str.match(letter))) {
        return true;
    } else {
        return false;
    }
}

// Returns true if a given string is a number
function isNumber(str) {
    var number = /^[0-9]+$/;
    if ((str.match(number))) {
        return true;
    } else {
        return false;
    }
}

// Returns true if a string starts with a letter and ends with a number
function validUserFormat(userName) {
    var value = $('#' + userName).val();
    return (isLetter(value.charAt(0)) && isNumber(value.charAt(value.length - 1)));
}

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        function MegaMaxSale() {

            var salesId;
            var password;
            var clientId;
            var nextWid;
            var prevWid;
            var widArray = [];

            // checks salesId, password and clientId with current values, 
            // returns true if they are different
            // returns false if they are the same
            function newCredentials() {
                if (salesId != document.getElementById("salesId").value
                        || password != document.getElementById("password").value
                        || clientId != document.getElementById("clientId").value) {
                    return true;
                } else {
                    return false
                }
            }

            // sets salesId, password and clientId with current values
            function setCredentials() {
                salesId = document.getElementById("salesId").value;
                password = document.getElementById("password").value;
                clientId = document.getElementById("clientId").value;
            }

            // gets widget objects and adds widget ids to widArray
            function getWidgetIds() {
                widArray = [];
                $.get('http://137.108.93.222/openstack/api/widgets/?OUCU=' + salesId + '&password=' + password,
                        function (data) {
                            var obj = JSON.parse(data);
                            if (obj.status == "error") {
                                alert(obj.message);
                            } else {
                                $.each(obj.data, function (i, widObj) {
                                    widArray.push(widObj.id);
                                });
                                nextWid = 0;
                                prevWid = widArray.length - 2;
                                displayNext(nextWid);
                            }
                        });
            }

            function displayNext(index) {
                console.log(index);
                                        //    when printing info to html!!!!!!
                        //          document.getElementById("subTotal").innerHTML = "out";

            }

            this.nextWidget = function () {
                if (validUserFormat('salesId')) {
                    if (newCredentials()) {
                        setCredentials();
                        getWidgetIds();
                    } else {
                        prevWid = nextWid;
                        if (nextWid >= (widArray.length - 1)) {
                            nextWid = 0;
                        } else {
                            nextWid++;
                        }
                        displayNext(nextWid);
                    }
                } else {
                    alert("Sales ID incorrect format");
                }
            };
        }
        this.megaMaxSale = new MegaMaxSale();
    }
};
app.initialize();