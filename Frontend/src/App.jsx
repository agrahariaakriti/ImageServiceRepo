import { Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery.jsx";
import Connect from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import { UploadImage } from "./pages/UploadFile.jsx";
import Documentation from "./pages/Documentation.jsx";
import { EditImage } from "./pages/Edit.jsx";
import { api } from "./stores/api.service.js";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await api.get("/users/refresh");
        console.log("mncvfdvsdvdgfwqf.....", res.data.user);

        setUser(res.data);
      } catch (error) {
        console.log(error);

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route
          path="/about"
          element={<Connect user={user} setUser={setUser} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/uploadImage" element={<UploadImage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/documentation"
          element={<Documentation user={user} setUser={setUser} />}
        />
        <Route
          path="/gallery"
          element={<Gallery user={user} setUser={setUser} />}
        />
        <Route
          path="/editimage"
          element={<EditImage user={user} setUser={setUser} />}
        />
      </Routes>
    </>
  );
}

export default App;

// {/* <Home /> */}
// {/* <Connect /> */}
// <Register />
// {/* <Login /> */}
// {/* <Documentation /> */}
// {/* <Gallery /> */}
