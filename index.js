
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
            var currentWid;
            var widArray = [];
            var orders = [];

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

            // sets salesId, password and clientId with current values and clears orders
            function setCredentials() {
                salesId = document.getElementById("salesId").value;
                password = document.getElementById("password").value;
                clientId = document.getElementById("clientId").value;
                orders = [];
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
                                currentWid = 0;
                                updateWidget(currentWid);
                            }
                        });
            }

            // updates the asking price, description and widget image
            function updateWidget(index) {
                $.get('http://137.108.93.222/openstack/api/widgets/' + widArray[index] + '?OUCU=' + salesId + '&password=' + password,
                        function (data) {
                            var obj = JSON.parse(data);
                            if (obj.status == "error") {
                                alert(obj.message);
                            } else {
                                document.getElementById("image").src = obj.data[0].url;
                                document.getElementById("description").innerHTML = "Description: " + obj.data[0].description;
                                document.getElementById("askingPrice").innerHTML = "Asking Price: " + obj.data[0].pence_price;
                            }
                        });
            }

            // requests the next widget to be loaded
            this.nextWidget = function () {
                if (validUserFormat('salesId')) {
                    if (newCredentials()) {
                        setCredentials();
                        getWidgetIds();
                    } else {
                        if (currentWid >= (widArray.length - 1)) {
                            currentWid = 0;
                        } else {
                            currentWid++;
                        }
                        updateWidget(currentWid);
                    }
                } else {
                    alert("Sales ID incorrect format");
                }
            };
            
            // requests the previous widget to be loaded
            this.prevWidget = function () {
                if (validUserFormat('salesId')) {
                    if (newCredentials()) {
                        setCredentials();
                        getWidgetIds();
                    } else {
                        if (currentWid == 0) {
                            currentWid = widArray.length - 1;
                        } else {
                            currentWid--;
                        }
                        updateWidget(currentWid);
                    }
                } else {
                    alert("Sales ID incorrect format");
                }
            };
            
            // updates order details locally
            this.addToOrder = function () {
                var order = {widget_id: widArray[currentWid], 
                    number: document.getElementById("numWid").value,
                    pence_price: document.getElementById("priceWid").value};
                orders.push(order);
            };
        }
        this.megaMaxSale = new MegaMaxSale();
    }
};
app.initialize();