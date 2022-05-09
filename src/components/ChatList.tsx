import React, { useCallback, useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import Circle from "@mui/icons-material/Circle";
import moment from "moment";
import client from "../websocket/socketClient";
import { IMessageEvent } from "websocket";

interface ChatListProps {
  userName?: string;
  lastDate?: number;
  lastMessage?: string;
  roomName?: number;
}

const ChatList: React.FC<ChatListProps> = ({
  userName,
  lastDate,
  lastMessage,
  roomName,
}) => {
  const lastReceived = moment(lastDate && new Date(lastDate)).format("hh:mmA");
  const [isOnline, setIsOnline] = useState<boolean>();
  const onHandleNewMessage = useCallback((message: IMessageEvent) => {
    const messageJson = JSON.parse(message.data.toString());
    if (messageJson.closed !== undefined) setIsOnline(!messageJson.closed);
  }, []);

  useEffect(() => {
    client.addOnMessageHandler("ChatList", onHandleNewMessage);
  }, [onHandleNewMessage]);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{userName?.charAt(0)}</Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={`${userName} on ${lastReceived} in ${roomName}`}
        secondary={
          <Typography
            component="span"
            variant="body2"
            style={{ display: "inline" }}
          >
            <br />
            {lastMessage}
          </Typography>
        }
      />

      <ListItemIcon>
        <Circle color={isOnline ? "success" : undefined} />
      </ListItemIcon>
    </ListItem>
  );
};

export default ChatList;
