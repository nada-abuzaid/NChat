/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LOGIN } from "../utils/APIRoutes";
import { FormContainer } from "./styled";

export default function Login() {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem(import.meta.env.REACT_APP_LOCALHOST_KEY!)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event: any) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, username } = values;
     if (username === "") {
      toast.error(
        "Username and password is required",
        toastOptions as any
      );
      return false;
    } else if (password === "") {
      toast.error(
        "Username and password is required",
        toastOptions as any
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(LOGIN, {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions as any);
      }

      if (data.status === true) {
        localStorage.setItem(
          import.meta.env.REACT_APP_LOCALHOST_KEY!,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>NChat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Login</button>
          <span>
            don't have an account? <Link to="/signup">Signup</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
