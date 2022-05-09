import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ChatWindow.module.scss";
import ChatsWrapper from "../components/ChatWrapper/ChatsWrapper";
import { AppBar, Tabs, Tab, Grid, Box } from "@mui/material";
import { ChatSession, MessageData } from "../types/Message";
import { IMessageEvent } from "websocket";
import client from "../websocket/socketClient";

interface ChatWindowProps {
  isLoggedIn?: boolean;
  userName?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isLoggedIn, userName }) => {
  const [userChats, setUserChats] = useState<ChatSession>();
  const session = localStorage.getItem(`session${userName}`);
  const localStorageData = useMemo(() => {
    return session && JSON.parse(session);
  }, [session]);

  const setMessageData = useCallback(
    (message: MessageData) => {
      const data = {
        ...localStorageData,
        messages: [
          ...localStorageData.messages,
          {
            senderName: message.senderName,
            content: message.content,
            createdAt: message.createdAt,
          },
        ],
      };
      localStorage.setItem(`session${userName}`, JSON.stringify(data));
      setUserChats(data);
    },
    [localStorageData, userName]
  );

  const onSendMessage = useCallback(
    (message: MessageData) => {
      setMessageData(message);
    },
    [setMessageData]
  );

  const onHandleNewMessage = useCallback(
    (message: IMessageEvent) => {
      const messageJson = JSON.parse(message.data.toString());
      messageJson.content && setMessageData(messageJson);
    },
    [setMessageData]
  );

  useEffect(() => {
    localStorageData && setUserChats(localStorageData);
  }, [localStorageData]);

  useEffect(() => {
    client.addOnMessageHandler("ChatWindow", onHandleNewMessage);
  }, [onHandleNewMessage]);

  if (!isLoggedIn) return null;

  return (
    <>
      <div className={styles.mainRaised}>
        <AppBar className={styles.appBar} position="static">
          <Tabs value={0} variant={"fullWidth"} className={styles.appBarTabs}>
            <Tab label="ROOM" />
            <Tab label="MESSAGES" />
          </Tabs>
        </AppBar>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container columns={3} className={styles.chatContainer}>
            <ChatsWrapper userChats={userChats} onSendMessage={onSendMessage} />
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default ChatWindow;
