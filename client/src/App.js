import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Join from "./components/join/index.js";
import Chat from "./components/chat/index.js";

const App = () => {
  const [name, setName] = useState(null);
  return (
    <Router>
      <Route
        path="/"
        exact
        render={(props) => <Join {...props} name={name} setName={setName} />}
      />
      <Route path="/chat" render={(props) => <Chat {...props} />} />
    </Router>
  );
};

export default App;
