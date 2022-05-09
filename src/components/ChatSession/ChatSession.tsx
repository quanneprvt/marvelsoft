import React, { useCallback, useEffect, useRef } from "react";
import {
  Button,
  ListItem,
  Typography,
  Avatar,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import styles from "./ChatSession.module.scss";
import moment from "moment";
import {
  ChatSession as ChatSessionType,
  MessageData,
} from "../../types/Message";
import client from "../../websocket/socketClient";

interface ChatSessionProps {
  userChats?: ChatSessionType;
  onSendMessage?: (message: MessageData) => void;
}

const ChatSession: React.FC<ChatSessionProps> = ({
  userChats,
  onSendMessage,
}) => {
  const messagesContainer = useRef<HTMLDivElement>(null);
  const messageTextRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    const messsageContainerElement = messagesContainer?.current;
    messsageContainerElement &&
      messsageContainerElement.children[
        messsageContainerElement.children.length - 1
      ] &&
      messsageContainerElement.children[
        messsageContainerElement.children.length - 1
      ].scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = useCallback(() => {
    const messageContentValidateFormat = messageTextRef.current?.value.replace(
      " ",
      ""
    );
    if (messageContentValidateFormat?.length === 0) return;
    const sendData: MessageData = {
      senderName: userChats?.username || "",
      room: userChats?.port || 0,
      content: messageTextRef.current?.value || "",
      createdAt: Date.now(),
    };
    client.sendData(JSON.stringify(sendData));
    onSendMessage && onSendMessage(sendData);
    messageTextRef.current && (messageTextRef.current.value = "");
  }, [onSendMessage, userChats?.port, userChats?.username]);

  useEffect(() => {
    userChats?.messages && scrollToBottom();
  }, [userChats?.messages]);

  return (
    <>
      <div className={styles.messageListContainer} ref={messagesContainer}>
        {(userChats?.messages || []).map((msgs, i: any) => {
          return (
            <ListItem key={i}>
              {msgs.senderName.toLowerCase() !==
              userChats?.username.toLowerCase() ? (
                <>
                  <ListItemText
                    className={`${styles.chat}  ${styles.senderChat}`}
                    primary={msgs.content}
                    secondary={
                      <Typography
                        key={i}
                        component="span"
                        variant="caption"
                        color="inherit"
                      >
                        <br />
                        {moment(new Date(msgs.createdAt).toString()).format(
                          "hh:mmA"
                        )}
                      </Typography>
                    }
                  />

                  <ListItemAvatar>
                    <Avatar className={styles.avatar}>
                      {msgs.senderName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <br />
                </>
              ) : (
                <>
                  <ListItemAvatar>
                    <Avatar className={styles.avatar}>
                      {userChats?.username.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    className={styles.chat}
                    primary={msgs.content}
                    secondary={
                      <Typography
                        key={i}
                        component="span"
                        variant="caption"
                        color="inherit"
                      >
                        <br />
                        {moment(new Date(msgs.createdAt).toString()).format(
                          "hh:mmA"
                        )}
                      </Typography>
                    }
                  />
                </>
              )}
            </ListItem>
          );
        })}
      </div>

      <div className={styles.sendMessageContainer}>
        <TextField
          label="Message"
          placeholder="Enter message"
          fullWidth
          inputRef={messageTextRef}
        />

        <Button
          className={`${styles.button} ${styles.sendButton}`}
          variant={"contained"}
          onClick={sendMessage}
        >
          SEND
        </Button>
      </div>
    </>
  );
};

export default ChatSession;
