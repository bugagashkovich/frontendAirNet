import { useState } from "react";

import Calendar from "./components/calendar";
import User from "./components/user";

import "./styles/App.css";
import "./styles/calendar.css";
import "./styles/modal.css";

function App() {
  const [user, setUser] = useState(null);

  function handleUser(user) {
    setUser(user);
  }
  return (
    <div className="App">
      <User handleUser={handleUser} />
      <Calendar user={user} />
    </div>
  );
}

export default App;
