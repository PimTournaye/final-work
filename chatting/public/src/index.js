
// DOM elements
let input = document.getElementById('input');
let messages = document.getElementById('messages');

// Getting other users' messages through the socket.io server
socket.on('chat message', function (msg) {
  let item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});