import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiInputBase: {
      defaultProps: {
        size: "small",
      }
    },
    MuiInputLabel: {
      defaultProps: {
        size: "small",
      }
    },
    MuiTable: {
      defaultProps: {
        size: "small",
      }
    }
  }
});