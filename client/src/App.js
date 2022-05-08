import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Join from "./components/join/index.js";
import Chat from "./components/chat/index.js";

const App = () => {
  const [name, setName] = useState(null);
  return (
    <Router basename={process.env.APP_BASENAME_PATH || "/tws"}>
      <Route
        path="/"
        exact
        render={(props) => <Join {...props} name={name} setName={setName} />}
      />
      <Route path="/chat" render={(props) => <Chat {...props} />} />
      <Route
        path="*"
        render={({ location }) => (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )}
      />
    </Router>
  );
};

export default App;
