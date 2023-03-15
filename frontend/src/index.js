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
// import HomePage from "./pages/home.jsx";

export default function MyApp() {
  return (
    <div>
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
          <Route element={<Congrats />} exact path="/congrats"></Route>
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
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyApp />);
