import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
let socket = io("localhost:3000");

let form = document.getElementById('form');
let input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});