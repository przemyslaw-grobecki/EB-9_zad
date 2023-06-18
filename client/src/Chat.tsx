import * as React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Message {
  id: number;
  text: string;
  sender: string;
}

const messages : Array<Message> = [
  { id: 1, text: "Hi there!", sender: "bot" },
  { id: 2, text: "Hello!", sender: "user" },
  { id: 3, text: "How can I assist you today?", sender: "bot" },
];

const ChatUI = () => {
  const [input, setInput] = React.useState("");
  const [isGettingResponseFromChat, setIsGettingResponseFromChat] = React.useState(false);
  const [chat, setChat] = React.useState(messages)

  const fetchGptAnswer = async (input: string) => {
    setIsGettingResponseFromChat(true);
    const response = await fetch("http://locahost:5000/ask_gpt", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({question: input})
    });
    setChat([...chat, { id: chat.length + 1, text: (await response.json()).answer, sender: "bot" }]);
    setIsGettingResponseFromChat(false);
  }

  const handleSend = async () => {
    if (input.trim() !== "") {
      setChat([...chat, { id: chat.length + 1, text: input, sender: "user" }]);
      setInput("");
      fetchGptAnswer(input);
    }
  }

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {chat.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </Box>
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              disabled={isGettingResponseFromChat}
              fullWidth
              placeholder="Type a message"
              value={input}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const Message = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isBot ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          backgroundColor: isBot ? "primary.light" : "secondary.light",
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
      </Paper>
    </Box>
  );
};

export default ChatUI;