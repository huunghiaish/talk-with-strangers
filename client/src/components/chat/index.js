import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

// eslint-disable-next-line no-unused-vars
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./index.css";
let socket;

// typing

const Chat = () => {
  let history = useHistory();
  const [currentUser, setCurrentUser] = useState({})
  const [stranger, setStranger] = useState({})
  const [userInRooms, setUserInRooms] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isStrangerTyping, setIsStrangerTyping] = useState([]);
  const SERVER_URI_PRODUCTION =
    "https://server.talk-with-strangers.huunghianguyen.com/";
  const SERVER_URI =
    process.env.NODE_ENV === "production"
      ? SERVER_URI_PRODUCTION
      : process.env.SERVER_URI;

  useEffect(() => {
    if (history?.location?.state) {
      const { name, idUser, avatar, country } = history.location.state;
      socket = io(SERVER_URI);
      socket.emit("join", { name, idUser, avatar, country }, (error) => {
        if (error) {
          alert(error);
        }
      });
      socket.on("serverData", ({ totalUsers }) => {
        setTotalUsers(totalUsers);
      });
      setCurrentUser({
        name, idUser, avatar
      })
    } else {
      history.push("/");
    }
  }, [history, SERVER_URI]);

  useEffect(() => {
    if(socket && currentUser?.idUser){
      if (message.length > 0) {
        socket.emit("typing", { idUser: currentUser?.idUser, isTyping: true }, (error) => {
          if (error) {
            alert(error);
          }
        });
      } else {
        socket.emit("typing", { idUser: currentUser?.idUser, isTyping: false }, (error) => {
          if (error) {
            alert(error);
          }
        });
      }
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, currentUser?.idUser])

  useEffect(() => {
    if (currentUser?.idUser) {
      socket.on("message", (message) => {
        setMessages((messages) => [...messages, message]);
      });

      socket.on("roomData", ({ users }) => {
        setUserInRooms(users);
        const stranger = users.find((user) => {
          return user?.idUser !== currentUser?.idUser;
        });
        setStranger({
          idUser: stranger?.idUser, name: stranger?.name, avatar: stranger?.avatar, country: stranger?.country
        })
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.idUser]);

  useEffect(() => {

    if (stranger?.idUser) {
      socket.on("userTypings", ({ userTypings }) => {
        const strangerTyping = userTypings?.find((user) => {
          return user?.idUser === stranger?.idUser;
        })
        setIsStrangerTyping(!!strangerTyping?.isTyping);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stranger?.idUser]);

  const sendMessage = () => {
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="total-user"> {`${totalUsers} stranger online`} </div>
      {userInRooms.length > 1 ? (
        <MainContainer className="container">
          <ConversationHeader>
            <ConversationHeader.Back
              onClick={() => {
                window.location.href = '/';
              }}
            />
            <Avatar
              name={stranger?.name}
              src={stranger?.avatar}
              status={userInRooms.length > 1 ? "available": "invisible"}
            />
            <ConversationHeader.Content
              info={
                <>
                  Stranger from{" "}
                  <span
                    className={`fi fi-${stranger?.country || "vn"}`}
                    style={{ marginLeft: 2 }}
                  ></span>
                </>
              }
              userName={stranger?.name}
            />
            <ConversationHeader.Actions>
              <VoiceCallButton title="Start voice call" />
              <VideoCallButton title="Start video call" />
              <InfoButton title="Show info" />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <ChatContainer>
            <MessageList
              style={{ height: 387}}
              typingIndicator={
                isStrangerTyping ? <TypingIndicator content={`${stranger?.name} is typing`} /> : <></>
              }
            >
              {messages.map((message, i) => (
                <Message
                  key={i}
                  model={{
                    message: message?.text,
                    sentTime: "just now",
                    sender: message?.name,
                    direction:
                    currentUser?.idUser === message?.idUser ? "outgoing" : "incoming",
                  }}
                >
                  {currentUser?.idUser === message?.idUser ? (
                    <Avatar
                      name={currentUser?.name}
                      src={currentUser?.avatar}
                    />
                  ) : (
                    <Avatar
                      name={stranger?.name}
                      src={stranger?.avatar}
                    />
                  )}
                </Message>
              ))}
            </MessageList>
            <MessageInput
              autoFocus
              placeholder="Type message here"
              value={message}
              onChange={(value) => setMessage(value)}
              onSend={(value) => {
                sendMessage(value);
              }}
            />
          </ChatContainer>
        </MainContainer>
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
