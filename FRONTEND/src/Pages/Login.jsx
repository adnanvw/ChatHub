import React, { useState ,useEffect} from "react";
import { styled } from "styled-components";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { BiErrorCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { url } from "../Components/url";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../Redux/authReducer/action";
import { AiOutlineLoading } from "react-icons/ai";
export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const Nav = useNavigate();
  const dispatch = useDispatch();
  const handleSubmitForm = async (data) => {
    const userData = {
      email: data.email,
      password: data.password,
    };
    setloading(true);
    await axios.post(`${url}/user/login`, userData).then((data) => {
      if (data.data.auth) {
        toast.success(`${data.data.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        dispatch(login(data.data));
        setloading(false);
        setTimeout(() => {
          Nav("/chat");
        }, 1500);
      } else {
        setloading(false);
        toast.error(`${data.data.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    });
  };
    const getBackend = async () => {
    const { data } = await axios.get(`${url}/user/welcome`);
    console.log(data);
  };
  useEffect(() => {
    getBackend();
  }, []);
  return (
    <DIV>
      <div id="main">
        <div id="logo">
          <img src={"https://png.pngtree.com/element_our/png/20181229/vector-chat-icon-png_302635.jpg"} alt="" />
          <h1>ChatHub</h1>
        </div>
        <form action="" onSubmit={handleSubmit(handleSubmitForm)}>
          <OutlinedInput
            sx={{
              border: "2px solid white",
              color: "white",
              borderRadius: "10px",
              "& fieldset": { border: "none" },
            }}
            type={"email"}
            placeholder="Email"
            startAdornment={
              <InputAdornment position="start">
                <MdEmail style={{ color: "white", fontSize: "24px" }} />
              </InputAdornment>
            }
            {...register("email", {
              required: true,
              pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            })}
          />
          {errors?.email?.type === "required" && (
            <p>
              <BiErrorCircle /> This field is required
            </p>
          )}
          {errors?.email?.type === "pattern" && (
            <p>
              <BiErrorCircle /> Invalid email address
            </p>
          )}
          <OutlinedInput
            sx={{
              border: "2px solid white",
              color: "white",
              borderRadius: "10px",
              "& fieldset": { border: "none" },
            }}
            // required
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            startAdornment={
              <InputAdornment position="start">
                <RiLockPasswordFill
                  style={{ color: "white", fontSize: "24px" }}
                />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <MdVisibilityOff style={{ color: "white" }} />
                  ) : (
                    <MdVisibility style={{ color: "white" }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
            {...register("password", {
              required: true,
              minLength: 6,
              maxLength: 6,
            })}
          />
          {errors?.password?.type === "required" && (
            <p>
              <BiErrorCircle /> This field is required
            </p>
          )}
          {errors?.password?.type === "minLength" && (
            <p>
              <BiErrorCircle /> Password must be 6 characters
            </p>
          )}
          {errors?.password?.type === "maxLength" && (
            <p>
              <BiErrorCircle /> Password must be 6 characters
            </p>
          )}
          <button type="submit">
            {loading ? (
              <AiOutlineLoading className="infinity-rotation" />
            ) : (
              "LOGIN"
            )}
          </button>
          <div
            style={{
              display: "flex",
              fontSize: "16px",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h7>Don't have an account?</h7>
            <h7
              style={{
                color: "#017fd3",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => Nav("/register")}
            >
              Register Now
            </h7>
          </div>
        </form>
      </div>
    </DIV>
  );
}
const DIV = styled.div`
  width: 30%;
  margin: auto;
  padding-top: 10%;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .infinity-rotation {
    animation: spin infinite 1s linear;
    font-size: 18px;
  }
  #main {
    color: white;
    background-color: #00192a;
    height: max-content;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px,
      rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
    border-radius: 0px;
  }
  #logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 20px;
    gap: 10px;
    font-size: 20px;
    img {
      width: 20%;
    }
  }
  form {
    color: white;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: auto;
    width: 80%;
    gap: 20px;
    p {
      display: flex;
      font-size: 14px;
      color: red;
      align-items: center;
      gap: 3px;
      svg {
        font-size: 18px;
      }
    }
    input {
      font-family: "Comfortaa", cursive;
      font-size: 18px;
    }
    button[type="submit"] {
      background-color: #2caafe;
      font-size: 18px;
      font-weight: 900;
      width: 50%;
      margin: auto;
      padding: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      border-radius: 10px;
      border: 0;
      cursor: pointer;
    }
  }
  .row {
    height: 120px;
  }
  .profile-pic {
    width: 200px;
    max-height: 200px;
    display: inline-block;
  }
  .file-upload {
    display: none;
  }
  .circle {
    border-radius: 100% !important;
    overflow: hidden;
    width: 120px;
    height: 120px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    margin: auto;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  .p-image {
    position: relative;
    left: 60%;
    top: -25px;
    color: #666666;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
  }
  .p-image:hover {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .upload-button {
    font-size: 1.5em;
  }
  .upload-button:hover {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: #999;
  }
  @media screen and (min-width: 866px) and (max-width: 1024px) /* Laptop */ {
    width: 40%;
  }
  @media screen and (min-width: 481px) and (max-width: 865px) /* Tablet */ {
    width: 50%;
  }
  @media screen and (max-width: 480px) /* Mobile */ {
    width: 90%;
  }
`;
