import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function CustomAlert({ type = "info", message, onClose }) {
  return (
    <Alert
      severity={type}
      sx={{ width: "100%", mb: 2 }}
      action={
        <IconButton color="inherit" size="small" onClick={onClose}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {message}
    </Alert>
  );
}

export default CustomAlert;