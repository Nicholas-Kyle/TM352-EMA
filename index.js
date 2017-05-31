
// FR1.1 Returns true if a given string is a letter
function isLetter(str) {
    var letter = /^[a-z]+$/;
    if ((str.match(letter))) {
        return true;
    } else {
        return false;
    }
}

// FR1.1 Returns true if a given string is a number
function isNumber(str) {
    var number = /^[0-9]+$/;
    if ((str.match(number))) {
        return true;
    } else {
        return false;
    }
}

// FR1.1 Returns true if a string starts with a letter and ends with a number
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

            // FR1.2 gets widget objects and adds widget ids to widArray
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

            // FR1.2 updates the asking price, description and widget image
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

            // FR1.2 requests the next widget to be loaded
            this.nextWidget = function () {
                if (validUserFormat('salesId')) {
                    if (newCredentials()) {
                        setCredentials();
                        getWidgetIds();
                        loadMap();
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

            // FR1.2 requests the previous widget to be loaded
            this.prevWidget = function () {
                if (validUserFormat('salesId')) {
                    if (newCredentials()) {
                        setCredentials();
                        getWidgetIds();
                        loadMap();
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

            // FR1.3 updates order details locally
            this.addToOrder = function () {
                var order = {widget_id: widArray[currentWid],
                    number: document.getElementById("numWid").value,
                    pence_price: document.getElementById("priceWid").value};
                orders.push(order);
                displayCost();
            };

            // FR1.4 displays the cost of order, VAT for order and total cost including VAT
            function displayCost() {
                var cost = 0.0;
                $.each(orders, function (i, j) {
                    cost += (j.number * j.pence_price);
                });
                document.getElementById("subtotal").innerHTML = "Subtotal: &pound" + (cost / 100);
                document.getElementById("vat").innerHTML = "VAT: &pound" + (cost / 500);
                document.getElementById("total").innerHTML = "Total: &pound" + (cost * 1.2 / 100);
            };

            // FR2.1 loads map to current location
            function loadMap() {
                var onSuccess = function (position) {
                    var div = document.getElementById("mapCanvas");
                    var map = plugin.google.maps.Map.getMap(div);
                    map.on(plugin.google.maps.event.MAP_READY, onMapInit);
                    function onMapInit(map) {
                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;
                        var currentLocation = {"lat": lat, "lng": lng};
                        map.setCenter(currentLocation);
                        map.setZoom(15);
                        map.refreshLayout();
                    }
                };
                function onError(error) {
                    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                }
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }

            // FR2.2 
            // creates a new order, adds order items to it, requests markers to be displayed
            // on map for order locations for current day
            this.placeOrder = function () {
                getAddress();
            };

            // FR2.2 gets address for specified client id and calls clientLatLong
            function getAddress() {
                $.get("http://137.108.93.222/openstack/api/clients/" + clientId + "?OUCU=" + salesId + "&password=" + password,
                        function (data) {
                            if (data.status == "success") {
                                clientLatLong(data.data[0].address);
                            } else {
                                alert("Error: " + data.status);
                            }
                        }, "json");

            }

            // FR2.2 gets the latitude and longitude for specified client address and calls createOrder
            function clientLatLong(address) {
                setTimeout(function () {
                    $.get("http://nominatim.openstreetmap.org/search/" + address + "?format=json&countrycodes=gb",
                            function (data) {
                                createOrder(data[0].lat, data[0].lon);
                            });
                }
                , 1000);
            }

            // FR2.2 creates a new order and calls addOrderItems
            function createOrder(lat, lng) {
                $.post("http://137.108.93.222/openstack/api/orders",
                        {
                            OUCU: salesId,
                            password: password,
                            client_id: clientId,
                            latitude: lat,
                            longitude: lng
                        }, function (data)
                {
                    addOrderItems(data.data[0].id);
                }, "json");
            }

            // FR2.2 adds items to new order and calls displayMarkers
            function addOrderItems(orderId) {
                $.each(orders, function (i, j) {
                    $.post("http://137.108.93.222/openstack/api/order_items",
                            {
                                OUCU: salesId,
                                password: password,
                                order_id: orderId,
                                widget_id: j.widget_id,
                                number: j.number,
                                pence_price: j.pence_price
                            }, function (data)
                    {
                        displayMarkers();
                    }, "json");
                });
            }

            // FR2.2 displays markers on map
            function displayMarkers() {
                //TODO
            }
        }
        this.megaMaxSale = new MegaMaxSale();
    }
};
app.initialize();