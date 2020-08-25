import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
// import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../inforBar/index.js";
import Input from "../Input/Input";

import "./index.css";
let socket;

const Chat = () => {
  let history = useHistory();
  const [idUser, setIdUser] = useState(null);
  const [name, setName] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ENDPOINT = process.env.ENDPOINT || "localhost:5000";
  useEffect(() => {
    if (history?.location?.state) {
      const { name, idUser } = history.location.state;
      socket = io(ENDPOINT);

      socket.emit("join", { name, idUser }, (error) => {
        if (error) {
          alert(error);
        }
      });
      setName(name);
      setIdUser(idUser);
    } else {
      history.push("/");
    }
  }, [history, ENDPOINT]);

  useEffect(() => {
    if (name && idUser) {
      socket.on("message", (message) => {
        setMessages((messages) => [...messages, message]);
      });

      socket.on("roomData", ({ users }) => {
        setUsers(users);
      });

      socket.on("serverData", ({ totalUsers }) => {
        setTotalUsers(totalUsers);
      });
    }
  }, [name, idUser]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div style={{ color: "white" }}> {`${totalUsers} user online`} </div>
      {users.length > 1 ? (
        <div className="container">
          <InfoBar />
          <Messages messages={messages} name={name} idUser={idUser} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      ) : (
        <div className="container">Finding</div>
      )}
    </div>
  );
};

export default Chat;
