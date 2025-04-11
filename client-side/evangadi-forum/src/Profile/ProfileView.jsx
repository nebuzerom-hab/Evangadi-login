import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import profileService from "../services/profileService";
import { appState } from "../App";

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token } = useContext(appState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile(token);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 7 }}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <List>
            <ListItem>
              <ListItemText primary="Username" secondary={profile.user_name} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="First Name"
                secondary={profile.first_name}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Last Name" secondary={profile.last_name} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Email" secondary={profile.email} />
            </ListItem>
          </List>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/change-password")}
              sx={{
                "&:hover": {
                  color: "orange",
                  borderColor: "red",
                },
              }}
            >
              Change Password
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileView;
