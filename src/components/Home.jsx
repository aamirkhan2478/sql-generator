import React from "react";
import Loader from "./Loader";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Configuration, OpenAIApi } from "openai";
import { CopyAll } from "@mui/icons-material";
const Home = () => {
  const [sqlStatement, setSqlStatement] = React.useState({
    response: "",
  });
  const [sqlerror, setSqlError] = React.useState("");
  const [copySuccess, setCopySuccess] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const onFormSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());
    const configuration = new Configuration({
      apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);
    await openai
      .createCompletion({
        model: "text-curie-001",
        prompt: `${formDataObj.sqlquery}`,
        temperature: 0.7,
        max_tokens: 302,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["#", ";"],
      })
      .then((response) => {
        setSqlStatement({ response: response.data.choices[0].text });
        setIsLoading(false);
      })
      .catch((error) => {
        setSqlError(error);
      });
  };

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(sqlStatement.response);
    setCopySuccess("Copied!");
    setTimeout(() => {
      setCopySuccess("");
      setSqlStatement({ response: "" });
    }, 3000);
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          title="Sql Statement Generator"
          subheader="Enter your english statement and get the SQL statement in return!"
        />
        <CardContent>
          <form onSubmit={onFormSubmit}>
            <TextField
              variant="outlined"
              fullWidth
              name="sqlquery"
              label="Your English Sql Statement"
            />
            <Typography variant="body1" color="text.secondary">
              Example:{" "}
              <span>
                "A sql query to select all the records from the table named
                employee"
              </span>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" type="submit">
              Generate
            </Button>
          </form>
          <Divider sx={{ my: 2 }} />
          {sqlStatement.response.length > 0 ? (
            <>
              {copySuccess ? (
                <Alert severity="success" color="info">
                  {copySuccess}
                </Alert>
              ) : (
                <Container
                  sx={{
                    bgcolor: "black",
                    color: "blue",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 100,
                  }}
                >
                  <Typography>{sqlStatement.response}</Typography>
                  <IconButton onClick={copyToClipboard}>
                    <CopyAll color="primary"/>
                  </IconButton>
                </Container>
              )}
            </>
          ) : isLoading ? (
            <Loader />
          ) : (
            <Typography>{sqlerror}</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
