// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: `"Shorai Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: `"Shorai Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          fontFamily: `"Shorai Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: `"Shorai Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: `"Shorai Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`,
        },
      },
    },
  },
});

export default theme;
