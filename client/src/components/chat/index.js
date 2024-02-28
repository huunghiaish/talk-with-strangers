import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
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
  const SERVER_URI_PRODUCTION = "https://server.talk-with-strangers.huunghianguyen.com/"
  const SERVER_URI = process.env.NODE_ENV === 'production' ? SERVER_URI_PRODUCTION : process.env.SERVER_URI
  useEffect(() => {
    if (history?.location?.state) {
      const { name, idUser } = history.location.state;
      socket = io(SERVER_URI);
      console.log('socket', socket)
      socket.emit("join", { name, idUser }, (error) => {

        if (error) {
          alert(error);
        }
      });
      socket.on("serverData", ({ totalUsers }) => {
        setTotalUsers(totalUsers);
      });
      setName(name);
      setIdUser(idUser);
    } else {
      history.push("/");
    }
  }, [history, SERVER_URI]);

  useEffect(() => {
    if (name && idUser) {
      socket.on("message", (message) => {
        setMessages((messages) => [...messages, message]);
      });

      socket.on("roomData", ({ users }) => {
        setUsers(users);
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
      <div className="total-user"> {`${totalUsers} stranger online`} </div>
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
        <div className="find-stranger">
          <div className="loading">
            <ClipLoader size={150} color={"#36D7B7"} loading={true} />
          </div>
          <div className="text">
            <span>Find a stranger ...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
