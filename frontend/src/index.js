import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import ProtectedRoute from "./components/protectedroute.jsx";
import KickPage from "./pages/remove.jsx";
import MessagePage from "./pages/message.jsx";
import AdminDashboard from "./pages/admin.jsx";
import Congrats from "./pages/congrats.jsx";
import AmongUs from "./pages/amongus.jsx";
import NotFound from "./pages/notfound.jsx";
import FakePage from "./pages/fake.jsx";
import Coins from "./pages/coins.jsx";
import Card from "./pages/pokerCard.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import './pages/theme.css'


// import HomePage from "./pages/home.jsx";

export default function MyApp() {
  return (
    <div className="">
      <div className = "balloonsbox">
      <div className="container-balloon">
        <div className="balloons">
        <div></div>
        <div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div>
      </div>
    </div>
    <div className="front">
      
      <BrowserRouter>
        <Routes>
          <Route
            element={<AmongUs />}
            exact
            path="/remove/:location/:member"
          ></Route>
          <Route element={<LoginPage />} exact path="/login/:location"></Route>
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route element={<AdminDashboard />} exact path="/admin"></Route>
          </Route>
          <Route element={<KickPage />} exact path="/vote/:location"></Route>
          <Route element={<Congrats />} exact path="/congrats/:location"></Route>
          <Route element={<Coins/>} exact path = "/coins"></Route>
          <Route
            element={<MessagePage />}
            exact
            path="/message/:location"
          ></Route>
          <Route element={<FakePage/> } exact path="/fakemessage"></Route>
          <Route element = {<NotFound/>} exact path = "*"></Route>
        </Routes>
      </BrowserRouter>
    </div>
    </div>
    </div>

  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyApp />);
