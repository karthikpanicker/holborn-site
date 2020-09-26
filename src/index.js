import 'bootstrap/dist/js/bootstrap.min';
import 'popper.js';
const QRious = require('qrious/dist/qrious');
import 'jquery/dist/jquery.slim';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import './meyer-reset.css';
window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
window.castReceiverManager.start();
window.castReceiverManager.onSenderDisconnected = function (event) {
    if (window.castReceiverManager.getSenders().length == 0 &&
        event.reason == cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
        window.close();
    }
};
(function() {
    function fetchRoomInfo() {
        fetch('http://10.0.0.7:8001/launcher/roominfo')
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    var image = document.getElementById('qr-code');
                    image.src = "placeholder.png";
                    document.getElementById("code-span").textContent = "";
                }
            })
            .then(function (myJson) {
                if (myJson) {
                    const url = new URL(myJson);
                    document.getElementById("code-span").textContent = "Fill in your room details and enter code: "+url.searchParams.get("passcode");
                    var qr = new QRious({
                        element: document.getElementById('qr-code'),
                        value: myJson,
                        size: 250,
                    });
                    document.getElementById("room-number").textContent = url.searchParams.get("roomno");
                    document.getElementById("code-span").textContent = "Fill in your room details and enter code: "+ url.searchParams.get("passcode");
                }
            })
            .catch(function (error) {
                console.log("Unable to connect to connect server.")
            });
    }
    fetchRoomInfo();
    window.setInterval(fetchRoomInfo, 10000);
})();
