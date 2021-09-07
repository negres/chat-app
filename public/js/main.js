const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Obter usuário e sala a partir da URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Entrar na sala
socket.emit('joinRoom', { username, room });

// Obter usuário e sala
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Mensagem do servidor
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scrollar do chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Enviar mensagem
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Mensagem
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emitir mensagem para servidor
  socket.emit('chatMessage', msg);

  // Limpar o input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Adicionar sala
function outputRoomName(room) {
  roomName.innerText = room;
}

// Adicionar usuário
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

// Mensagem de prompt quando o usuário solicita deixar a sala
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Quer mesmo sair?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
