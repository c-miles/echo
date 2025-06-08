import React, { CSSProperties, useEffect, useRef } from "react";
import { Avatar, TextField, Button, Typography, Box } from "@mui/material";
import { ProfileProps } from "../../types/profileTypes";

const Profile: React.FC<ProfileProps> = ({
  username,
  setUsername,
  handleSubmit,
  error,
  userInfo,
  isEditing,
  setIsEditing,
}) => {
  const styles = useStyles();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsEditing]);

  const formatDate = (date?: Date): string => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const joinedDate = formatDate(userInfo?.createdAt);

  return (
    <Box style={styles.container}>
      <Avatar
        alt={userInfo?.username || "User"}
        src={userInfo?.picture}
        style={styles.avatar}
      />
      <Box style={styles.info}>
        <Typography variant="h5">{userInfo?.username}</Typography>
        <Typography variant="body1">Joined yap: {joinedDate}</Typography>
        {!isEditing && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsEditing(true)}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        )}
      </Box>
      {isEditing && (
        <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
            style={styles.input}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={styles.submitButton}
          >
            Update Username
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Profile;

const useStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
  },
  avatar: {
    width: "20%",
    height: "20%",
  },
  editButton: {
    marginTop: 10,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  info: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
    marginTop: "10px",
  },
  input: {
    marginBottom: 10,
  },
  submitButton: {
    marginTop: "10px",
  },
});
