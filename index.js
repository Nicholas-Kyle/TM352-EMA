

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
            // checks salesId, password and clientId with current values, 
            // returns true and sets values to variables if they are different
            // returns false if they are the same
            function newCredentials() {
                if (salesId != document.getElementById("salesId").value
                        || password != document.getElementById("password").value
                        || clientId != document.getElementById("clientId").value) {
                    salesId = document.getElementById("salesId").value;
                    password = document.getElementById("password").value;
                    clientId = document.getElementById("clientId").value;
                    return true;
                } else {
                    return false
                }
            }

            // STEP 1: checks salesId, password and clientId with current values
            // if they are different procede STEP 2 else procede to STEP 7
            // STEP 2: checks salesId is of a valid format
            // STEP 2.1: stores salesId as variable salesId
            // STEP 3: stores password as variable password
            // STEP 4: stores clientId as variable clientId
            // STEP 5: calls API to return all widgets details
            // STEP 6: stores all widget IDs in an array and sets nextWid variable to 0
            // and prevWid to size of array - 2
            // STEP 7: calls API to return widget details corresponding to nextWidget
            // STEP 8: displays widget image, description and asking price
            // STEP 9: increments nextWidget and prevWidget values
            //             

            this.nextWidget = function () {
                if (validUserFormat('salesId')) {
                if (newCredentials()) {
                    //get data, create and array of widget ids
                    $.get('http://137.108.93.222/openstack/api/widgets/?OUCU=' + salesId + '&password=' + password,
                        function (data) {
                            alert( "Data Loaded: " + data );
                        });
                }
                    
                        
                        //    var obj = $.parseJSON(data);
                        //    if (obj.status == "fail") {
                        //    alert(obj.data[0].reason);
                        //    } else {
                        //    $.each(obj.data, function (index, value) {

                            

                            

                            // calls API to return all widgets details
                            // STEP 6: stores all widget IDs in an array and sets nextWid variable to 0
                            // and prevWid to size of array - 2


                            else {
                            console.log("same");
                            }
                        } else {
                        alert("Sales ID incorrect format")
                    }

                }
                ;
                }
                this.megaMaxSale = new MegaMaxSale();
            }
        };
        app.initialize();