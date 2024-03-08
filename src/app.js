var stompClient = null;
var socket = null;

function setConnected(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  if (connected) {
    $("#conversation").show();
  } else {
    $("#conversation").hide();
  }
  $("#greetings").html("");
}

function connect() {
  socket = new SockJS("/chat");
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    setConnected(true);
    console.log("Connected: " + frame);
    stompClient.subscribe("/topic/guestchats", function (greeting) {
      showGreeting(JSON.parse(greeting.body).content);
    });

    stompClient.subscribe("/topic/guestupdates", function (greeting) {
      showTyping(JSON.parse(greeting.body).content);
    });
  });
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  setConnected(false);
  console.log("Disconnected");
}

function sendName() {
  stompClient.send("/app/guestchat", {}, JSON.stringify({ message: $("#message").val() }));
}

function showGreeting(message) {
  $("#greetings").append("<tr><td>" + message + "</td></tr>");
  $("#typingUpdates").html("<tr><td>&nbsp;</td></tr>");
}

function showTyping(message) {
  $("#typingUpdates").html("<tr><td>Someone is typing...</td></tr>");
}

$(function () {
  $("form").on("submit", function (e) {
    e.preventDefault();
  });
  $("#connect").click(function () {
    connect();
  });
  $("#disconnect").click(function () {
    disconnect();
  });
  $("#send").click(function () {
    sendName();
  });

  $("#message").keyup(function (e) {
    console.log("user is typing");
    stompClient.send("/app/guestupdate", {}, JSON.stringify({ message: $("#message").val() }));
  });
});
