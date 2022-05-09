import { useCallback, useState } from "react";
import "./App.css";
import ChatWindow from "./modules/ChatWindow";
import Login from "./modules/Login";
import { UserLogin } from "./types/User";
import ChatData from "./data/chats.json";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import client from "./websocket/socketClient";
import { Message } from "./types/Message";
import { Button } from "@mui/material";

function App() {
  const [isLogIn, setIsLogIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>();

  const onLogIn = (userLogin: UserLogin) => {
    client.connect(userLogin.port);
    const session = localStorage.getItem(`session${userLogin.username}`);
    const initSessionStorageData = session && JSON.parse(session);
    const messages: Message[] = [];
    ChatData.forEach((chatData) => {
      const data = [...chatData.messages];
      messages.push(...data);
    });
    const data = {
      username: userLogin.username,
      port: userLogin.port,
      messages: initSessionStorageData?.messages || messages,
    };
    localStorage.setItem(`session${data.username}`, JSON.stringify(data));
    setUserName(data.username);
    setIsLogIn(true);
  };

  const onBack = useCallback(() => {
    client.close();
    setIsLogIn(false);
  }, []);

  return (
    <div className="App">
      <Login isLoggedIn={isLogIn} onLogIn={onLogIn} />
      <ChatWindow isLoggedIn={isLogIn} userName={userName} />
      {isLogIn && (
        <Button variant="contained" className="buttonBack" onClick={onBack}>
          BACK
        </Button>
      )}
    </div>
  );
}

export default App;
