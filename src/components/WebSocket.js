import React from "react";
import { useState, useEffect, useRef } from "react";
import SockJsClient from "react-stomp";
import UsernameGenerator from "username-generator";
import Fetch from "json-fetch";
import { TalkBox } from "react-talk";
import randomstring from "randomstring";

const WebSocket = () => {
  const [messages, setMessages] = useState([]);
  const [clientConnected, setClientConnected] = useState(false);
  const randomUserName = UsernameGenerator.generateUsername("-");
  const randomUserId = randomstring.generate();
  const clientRef = useRef(null);

  useEffect(() => {
    Fetch("/history", {
      method: "GET",
    }).then((response) => {
      setMessages(response.body);
    });
  }, []); // Empty dependency array to run only once on mount

  const onMessageReceive = (msg, topic) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  };

  const sendMessage = (msg, selfMsg) => {
    try {
      clientRef.current.sendMessage("/app/all", JSON.stringify(selfMsg));
      return true;
    } catch (e) {
      return false;
    }
  };

  const wsSourceUrl = window.location.protocol + "//" + window.location.host + "/handler";

  return (
    <div>
      <TalkBox
        topic="react-websocket"
        currentUserId={randomUserId}
        currentUser={randomUserName}
        messages={messages}
        onSendMessage={sendMessage}
        connected={clientConnected}
      />

      <SockJsClient
        url={wsSourceUrl}
        topics={["/topic/all"]}
        onMessage={onMessageReceive}
        ref={clientRef}
        onConnect={() => setClientConnected(true)}
        onDisconnect={() => setClientConnected(false)}
        debug={false}
      />
    </div>
  );
};

export default WebSocket;
