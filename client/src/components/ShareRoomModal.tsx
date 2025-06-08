import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { ContentCopy, Close } from "@mui/icons-material";

interface ShareRoomModalProps {
  open: boolean;
  onClose: () => void;
  roomName: string;
  roomId: string;
}

const ShareRoomModal: React.FC<ShareRoomModalProps> = ({
  open,
  onClose,
  roomName,
  roomId,
}) => {
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const shareableUrl = `${window.location.origin}/room/${roomName}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setShowCopiedToast(true);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowCopiedToast(true);
    }
  };

  const handleToastClose = () => {
    setShowCopiedToast(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        PaperProps={{
          style: {
            backgroundColor: "#2a2a2a",
            color: "white",
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle sx={{ color: "white", position: "relative" }}>
          Share Room
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#64b5f6", mb: 1 }}>
              Room Name
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontFamily: "monospace",
                backgroundColor: "#1a1a1a",
                padding: "0.75rem",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              {roomName}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 1 }}>
              Share this link to invite others:
            </Typography>
            <Box
              sx={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #3a3a3a",
                borderRadius: "8px",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#64b5f6",
                  fontFamily: "monospace",
                  flex: 1,
                  marginRight: "0.5rem",
                  wordBreak: "break-all",
                }}
              >
                {shareableUrl}
              </Typography>
              <IconButton
                onClick={handleCopyLink}
                size="small"
                sx={{
                  color: "#64b5f6",
                  "&:hover": {
                    backgroundColor: "#3a3a3a",
                  },
                }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ color: "#888", fontStyle: "italic" }}>
            Anyone with this link can join the room if they have an account.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCopyLink}
            variant="contained"
            startIcon={<ContentCopy />}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Copy Link
          </Button>
          <Button
            onClick={onClose}
            sx={{ color: "white" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showCopiedToast}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Room link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareRoomModal;