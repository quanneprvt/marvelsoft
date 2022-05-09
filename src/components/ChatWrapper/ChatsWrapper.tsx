import React from "react";
import ChatList from "../ChatList";
import ChatSessionComponent from "../ChatSession/ChatSession";
import { Grid } from "@mui/material";
import styles from "./ChatWrapper.module.scss";
import { ChatSession, MessageData } from "../../types/Message";

interface ChatWrapperProps {
  userChats?: ChatSession;
  onSendMessage?: (message: MessageData) => void;
}

const ChatsWrapper: React.FC<ChatWrapperProps> = ({
  userChats,
  onSendMessage,
}) => {
  return (
    <>
      <Grid
        item
        xs={1}
        className={`${styles.gridItem} ${styles.gridSenderColumn}`}
      >
        <ChatList
          roomName={userChats?.port}
          userName={userChats?.username}
          lastDate={
            userChats?.messages &&
            userChats.messages[userChats.messages.length - 1]?.createdAt
          }
          lastMessage={
            userChats?.messages &&
            userChats.messages[userChats.messages.length - 1]?.content
          }
        />
      </Grid>

      <Grid item xs={2} className={styles.gridItem}>
        <div className={styles.chatSessionContainer}>
          <ChatSessionComponent
            userChats={userChats}
            onSendMessage={onSendMessage}
          />
        </div>
      </Grid>
    </>
  );
};

export default ChatsWrapper;
