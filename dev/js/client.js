let Chattr = (() => {
  /*
    CHAT_MESSAGES is the local cache for the messages broadcasted by the server.
    There is no limit specified for local chat buffer
  */
  let CHAT_MESSAGES = [];

  /*
    Specify the URI for the server that is hosting the chat
  */
  const SERVER = {
    connected: false,
    protocol:'http://',
    host:'$__host__',
    port: '$__port__'
  };

  if ( SERVER.host === "172.18.212.54") {
    SERVER.host = "chattr-node-js.herokuapp.com";
  }
  // socket
  let socket = null;
  let SOCKET_CALLBACKS = {};

  /*
    SOCKET_CALLBACKS.onMessage receives a chata message broadcasted
    by the server, create a new chat message element from it and
    add it to the DOM
  */
  SOCKET_CALLBACKS.onMessage = ( message ) => {
    CHAT_MESSAGES.push( message );
    let chatItem = createChatMessage( message );
    UI_CHATLIST.appendChild(chatItem);
    chatItem.scrollIntoView();
  };

  /*
    SOCKET_CALLBACKS.onLoadChat receives and Array of the Cached messages
    Stored in the server. The server only keeps track of a specified number
    of messages. It sets it as the local message cache and adds all the new
    messges to the DOM
  */
  SOCKET_CALLBACKS.onLoadChat = ( chattrBuffer ) => {
    CHAT_MESSAGES = chattrBuffer;
    UI_CHATLIST.innerHTML = "";
    console.log(chattrBuffer);
    CHAT_MESSAGES.forEach( ( message ) => {
      let chatItem = createChatMessage( message );
      UI_CHATLIST.appendChild(chatItem);
    });
  };
  /*
    SOCKET_CALLBACKS.onConnected receives confirmation that we have successfully
    connected to the chat server and sends back the username we wish the server
    to use
  */
  SOCKET_CALLBACKS.onConnected =  () => {
    let username = INPUT_USERNAME.value;
    socket.emit('joined', username );
  };


  /*
    Initialize all UI COMPONENTS into constants for later use
  */
  const INPUT_USERNAME = document.getElementById('username');
  const UI_CONNECT = document.getElementById('connect');
  const UI_CHATBOX = document.getElementById('chatbox');
  const UI_CHATBOX_SEND = document.getElementById('chatboxSend');
  const UI_CHATLIST = document.getElementById('chatList');



  /*
    Create the Click listener if user decides to connect
  */
  let connect = () => {
    /*
      Check if there is an existing connection to the server
      and return if there is.
    */
    if ( socket ) {
      return;
    }
    /*
      Create a new socket to connect to the server
    */
    socket = io.connect( SERVER.protocol + SERVER.host + ':' + SERVER.port );
    /*
      Add the event listeners to the cosket
    */
    socket.on('connected', SOCKET_CALLBACKS.onConnected );
    socket.on( 'loadChat' , SOCKET_CALLBACKS.onLoadChat );
    socket.on( 'message' , SOCKET_CALLBACKS.onMessage );

    /*
      Disable the username textfield, set the connection button to
      disconnect, and enable the chatbox
    */
    INPUT_USERNAME.disabled = true;
    UI_CONNECT.innerText = "Disconnect";
    UI_CONNECT.removeEventListener('click', connect );
    UI_CONNECT.addEventListener('click', disconnect);
    UI_CHATBOX.disabled = false;
    UI_CHATBOX_SEND.disabled = false;

  };


  /*
    Create Disconnect click listener  if user decides to disconnect
  */
  let disconnect = () => {
    /*
      return if there isn't an existing connection
    */
    if ( !socket ) {
      return;
    }
    /*
      disconnect from the socket
    */
    socket.disconnect();
    /*
      Set socket to null as an indicator that we do not have a connection.
      The Connect click listener will Initialize it again if needed.
    */
    socket = null;

    /*
        Enable the username textfield, set the connection button to Connect,
        and disabled the chatbox
    */
    INPUT_USERNAME.disabled = false;
    UI_CONNECT.innerText = "Connect";
    UI_CONNECT.removeEventListener('click', disconnect);
    UI_CONNECT.addEventListener('click', connect);
    UI_CHATBOX.disabled = true;
    UI_CHATBOX_SEND.disabled = true;
  };

  /*
    Send Message Click listener sneds a message object to the server
  */
  let sendMessage = () => {
    /*
      Ensures that there is an existing connection
    */
    if ( !socket ) {
      return;
    }
    /*
      Extracts the contets of the message from the DOM
    */
    let message = UI_CHATBOX.value;
    let username = INPUT_USERNAME.value;
    /*
      Sends message Through the socket
    */
    socket.emit('message', {
      username: username,
      data: message
    });
  };


  /*
    Add the Click listeners to UI Buttons
  */
  UI_CONNECT.addEventListener('click', connect );
  UI_CHATBOX_SEND.addEventListener('click', sendMessage);

  /*
    Return a globally accessible API for the Chattr application
  */
  return {
    connect: connect,
    disconnect: disconnect
  }


  /****************************************************************************
    Some Helper functions
  *****************************************************************************/



  /*
    function createChatMessage
    params: (message)
    description: helper function that creates a chat message element to add to
                 the UI_CHATLIST element
  */
  function createChatMessage( message ) {
    /*
      Create a new element for the chatItem
    */
    let chatItem = document.createElement('div');

    let chatItem__header = document.createElement('div');
    chatItem__header.classList.add('chatItem__header');
    chatItem__header.innerText = `${message.username}:`;

    chatItem.appendChild( chatItem__header );

    let chatItem__message = document.createElement('div');
    chatItem__message.classList.add('chatItem__message');
    chatItem__message.innerText = message.data;

    chatItem.appendChild( chatItem__message );
    /*
      If the username in the message object matches the active username,
      identify message as .own_message for styling purposes
    */
    if (message.username === INPUT_USERNAME.value) {
      chatItem.classList.add('own_message');
    }
    /*
      Add the chatItem class to the element
    */
    chatItem.classList.add('chatItem');

    return chatItem;
  };
})();
