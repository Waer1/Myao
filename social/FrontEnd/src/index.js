import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./Utilities/normalize.css";
import App from "./App";
import theme from "./Utilities/Theme";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Store/Store";
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
