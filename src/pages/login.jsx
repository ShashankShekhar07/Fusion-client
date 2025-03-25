import {
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { setName } from "../redux/userslice";
import { loginRoute } from "../routes/globalRoutes";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(loginRoute, {
        username,
        password,
      });

      if (response.status === 200) {
        dispatch(setName(username));
        notifications.show({
          title: "Login Successful",
          message: "You have been successfully logged in.",
          color: "green",
        });
        const { token } = response.data;

        localStorage.setItem("authToken", token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 400) {
        notifications.show({
          title: "Login Failed",
          message:
            "Invalid username or password ! Please use correct credentials.",
          color: "red",
          position: "top-center",
          withCloseButton: false,
        });
      } else {
        notifications.show({
          title: "Error",
          message: "Something went wrong. Please try again later.",
          color: "red",
          position: "top-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center w="100%">
      <Container w={420} my={100}>
        <Title ta="center">Welcome to Fusion!</Title>

        <Paper
          withBorder
          shadow="lg"
          p={30}
          mt={40}
          radius="md"
          style={{ border: "2px solid #15ABFF" }}
        >
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Username/Email"
              placeholder="username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <PasswordInput
              label="Password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              mt="lg"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              fullWidth
              size="md"
              mt="xl"
              bg="#15ABFF"
              type="submit"
              loading={loading}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}

export default LoginPage;
