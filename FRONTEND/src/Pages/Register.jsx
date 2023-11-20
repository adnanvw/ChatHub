import React, { useState } from "react";
import { styled } from "styled-components";

import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { url } from "../Components/url";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [profilePic, setProfilePic] = useState(
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );
  const [loading, setloading] = useState(false);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePic(e.target.result);
    };
    reader.readAsDataURL(file);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "chatHub");
    data.append("cloud_name", "CLOUD_NAME");
    fetch(`https://api.cloudinary.com/v1_1/CLOUD_NAME/image/upload`, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setProfilePic(data.url));
  };
  const handleUploadClick = () => {
    document.querySelector(".file-upload").click();
  };
  const Nav = useNavigate();
  const handleSubmitForm = (data) => {
    setloading(true);
    const userData = {
      email: data.email,
      password: data.password,
      name: data.name,
      profilePicture: profilePic,
    };
    axios.post(`${url}/user/register`, userData).then((data) => {
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
        setloading(false);
        setTimeout(() => {
          Nav("/");
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
  return (
    <DIV>
      <div id="main">
        <div id="logo">
          <img src={"https://png.pngtree.com/element_our/png/20181229/vector-chat-icon-png_302635.jpg"} alt="" />
          <h1>ChatHub</h1>
        </div>
        <form action="" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="row">
            <div className="circle">
              <img className="profile-pic" src={profilePic} alt="Profile" />
            </div>
            <div className="p-image">
              <AiFillCamera
                onClick={handleUploadClick}
                className="upload-button"
              />
              <input
                className="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <OutlinedInput
            sx={{
              border: "2px solid white",
              color: "white",
              borderRadius: "10px",
              "& fieldset": { border: "none" },
            }}
            autoComplete="off"
            type={"text"}
            placeholder="Username"
            startAdornment={
              <InputAdornment position="start">
                <FaUserAlt style={{ color: "white", fontSize: "22px" }} />
              </InputAdornment>
            }
            {...register("name", {
              required: true,
              maxLength: 20,
              minLength: 3,
              pattern: /^[A-Za-z\s]+$/i,
            })}
          />
          {errors?.name?.type === "required" && (
            <p>
              <BiErrorCircle /> This field is required
            </p>
          )}
          {errors?.name?.type === "maxLength" && (
            <p>
              <BiErrorCircle /> Username cannot exceed 20 characters
            </p>
          )}
          {errors?.name?.type === "minLength" && (
            <p>
              <BiErrorCircle /> Username must be at 3 characters
            </p>
          )}
          {errors?.name?.type === "pattern" && (
            <p>
              <BiErrorCircle /> Alphabetical characters only
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
              "Register"
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
            <h7>Already have an account?</h7>
            <h7
              style={{
                color: "#017fd3",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => Nav("/")}
            >
              Login Now
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
  padding-top: 1%;
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
    padding-bottom: 10px;
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
    gap: 10px;
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
