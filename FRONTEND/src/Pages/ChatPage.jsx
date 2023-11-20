import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import {
  IoNotificationsSharp,
  IoAttach,
  IoDocumentText,
} from "react-icons/io5";
import { BsSendFill } from "react-icons/bs";
import { BiDotsVerticalRounded, BiArrowBack } from "react-icons/bi";
import { HiSearch } from "react-icons/hi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Avatar,
  Badge,
  Drawer,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { logout } from "../Redux/authReducer/action";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../Components/url";
import UserList from "../Components/UserList";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import UserBadge from "../Components/UserBadge";

import { MdEdit, MdDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { AiOutlineUsergroupAdd, AiOutlineLoading } from "react-icons/ai";
import { formatDate } from "../Components/formatDate";
import { io } from "socket.io-client";
import Tooltip from "@mui/material/Tooltip";
const useStyles = makeStyles({
  customFont: {
    fontFamily: '"Comfortaa", cursive',
  },
  customColor: {
    backgroundColor: "red",
    color: "red",
  },
});
var selectedChatCompare;
export default function ChatPage() {
  const auth = useSelector((state) => state.authReducer);
  // socket
  const [socketConnect, setSocketConnect] = useState(false);
  const socket = useRef();
  useEffect(() => {
    try {
      socket.current = io("https://ws1.onrender.com");
    } catch (error) {
      toast.error(`${error.message}`, {
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
    socket.current.emit("setup", auth.user.user);
    socket.current.on("connection", () => setSocketConnect(true));
  }, []);
  const [active, setActive] = useState([]);
  useEffect(() => {
    socket.current.emit("addUser", auth.user.user);
    socket.current.on("getUser", (users) => {
      setActive(users);
    });
    return () => {
      socket.current.off("getUser");
    };
  }, [auth]);
  // socket
  const classes = useStyles();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [selectChat, setSelectChat] = useState();
  const [chat, setChat] = useState([]);
  const dispatch = useDispatch();
  const [loadingChat, setLoadingChat] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };
  const handleSearch = async (event) => {
    event.preventDefault();
    if (search) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.user.token}`,
          },
        };
        const { data } = await axios.get(
          `${url}/user?search=${search}`,
          config
        );
        setSearchResult(data);
      } catch (error) {}
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    fontFamily: `'Comfortaa', cursive`,
  };
  useEffect(() => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };
      const { data } = axios.get(`${url}/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {}
  }, [search]);
  const Nav = useNavigate();
  const accessChat = async (userID) => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth.user.token}`,
      },
    };
    const { data } = await axios.post(`${url}/chat`, { userID }, config);
    setSelectChat(data);
    // setSearchResult([]);
  };
  const fetchChat = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    };
    const { data } = await axios.get(`${url}/chat`, config);
    setChat(data.reverse());
  };
  useEffect(() => {
    fetchChat();
  }, [selectChat]);
  const getSender = (name) => {
    return name[0]._id === auth.user.user._id ? name[1].name : name[0].name;
  };
  const getLogo = (name) => {
    return name[0]._id === auth.user.user._id
      ? name[1].profilePicture
      : name[0].profilePicture;
  };
  const getEmail = (name) => {
    return name[0]._id === auth.user.user._id ? name[1].email : name[0].email;
  };
  const getStatus = (name) => {
    return name[0]._id === auth.user.user._id ? name[1].status : name[0].status;
  };
  const [openModel1, setOpenModal1] = useState(false);
  const handleOpenModel1 = () => setOpenModal1(true);
  const handleCloseModel1 = () => setOpenModal1(false);
  // const [openModel2, setOpenModal2] = useState(false);
  // const handleOpenModel2 = () => setOpenModal2(true);
  // const handleCloseModel2 = () => setOpenModal2(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResultGC, setSearchResultGC] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  // searching user while creating new group
  const debouncedSearch = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };
  const handleSearchGC = async (searchQuery) => {
    if (searchQuery.length >= 3) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.user.token}`,
          },
        };
        const { data } = await axios.get(
          `${url}/user?search=${searchQuery}`,
          config
        );
        setSearchResultGC(data);
      } catch (error) {
        // Handle the error
      }
    }
  };
  const debouncedSearchGC = debouncedSearch(handleSearchGC, 500);
  useEffect(() => {
    debouncedSearchGC(searchInput);
  }, [searchInput]);
  // searching user while creating new group
  // add user while creating new group
  const handleGroup = (userToAdd) => {
    var exists = selectedUsers.some((item) => {
      return item._id === userToAdd._id;
    });
    if (!exists) {
      setSelectedUsers([...selectedUsers, userToAdd]);
    } else {
      toast.warning(`User already added`, {
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
  };
  // add user while creating new group
  // remove user while creating new group
  const handleDeleteGU = (u) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== u._id));
  };
  // remove user while creating new group
  //creating group chat
  const handleSubmitGC = async (e) => {
    e.preventDefault();
    if (!groupChatName || !selectedUsers) {
      toast.warning(`User already added`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };
      const { data } = await axios.post(
        `${url}/chat/groupChat`,
        {
          name: groupChatName,
          user: JSON.stringify(selectedUsers.map((e) => e._id)),
        },
        config
      );
      if (data.GC) {
        toast.success(`${data.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setChat([data.fullGroupChat, ...chat]);
        handleCloseModel1();
      } else {
        toast.error(`${data.message}`, {
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
    } catch (error) {}
  };
  //creating group chat
  // change Group Name
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    setName(selectedChat?.chatName);
  }, [selectedChat]);
  const [isEditing, setIsEditing] = useState(false);
  const [isTickVisible, setIsTickVisible] = useState(false);
  const inputRef = useRef(null);
  const handleEditClick = () => {
    setIsEditing(true);
    setIsTickVisible(true);
  };
  const handleTickClick = () => {
    setIsEditing(false);
    setIsTickVisible(false);
    if (selectedChat?.chatName !== name) {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };
      axios
        .put(
          `${url}/chat/groupChatRename`,
          {
            chatId: selectedChat?._id,
            chatName: name,
          },
          config
        )
        .then((res) => {
          toast.success(`${res.data.message}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setSelectedChat(res.data.updatedChat);
          fetchChat();
        });
    }
  };
  const handleInputChange = (event) => {
    setName(event.target.value);
    // setIsTickVisible(true);
  };
  const handleInputFocus = () => {
    inputRef.current.focus();
  };
  // change Group Name
  // delete Group User
  const handleDeleteUser = (userId, name) => {
    const config = {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
      },
    };
    axios
      .put(
        `${url}/chat/groupChatRemove`,
        {
          chatId: selectedChat?._id,
          userId,
        },
        config
      )
      .then((res) => {
        toast.success(`${name} ${res.data.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setSelectedChat(res.data.updatedChat);
        setNewMessage("");
        fetchChat();
      });
  };
  // delete Group User
  const [showInput, setShowInput] = useState(false);
  const handleAddUserClick = () => {
    setShowInput(true);
  };
  const handleUserClick = () => {
    setShowInput(false);
  };
  // ui for message
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth.user.token}`,
      },
    };
    setNewMessage("");
    await axios
      .post(
        `${url}/message`,
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      )
      .then((data) => {
        socket.current.emit("newMsg", data.data);
        setMessage([...message, data.data]);
      });
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  const fetchMessage = async () => {
    if (!selectedChat) return;
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth.user.token}`,
      },
    };
    setLoadingChat(true);
    await axios
      .get(`${url}/message/${selectedChat._id}`, config)
      .then((data) => setMessage(data.data));
    setLoadingChat(false);
    socket.current.emit("join chat", selectedChat._id);
  };
  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    setNewMessage("");
  }, [selectedChat]);
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    socket.current.on("message received", (msg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== msg.chat._id) {
        //notification
        if (!notification.includes(msg)) {
          setNotification([msg, ...notification]);
          fetchChat();
        }
      } else {
        setMessage([...message, msg]);
      }
    });
  });
  const [file, setFile] = useState();
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setNewMessage(e.target.files[0].name);
  };
  const [loadingFile, setLoadingFile] = useState(false);
  const getFile = async () => {
    if (file) {
      setLoadingFile(true);
      const data = new FormData();
      data.append("name", file?.name);
      data.append("file", file);
      await axios.post(`${url}/file/upload`, data).then((res) => {
        console.log(res.data);
        setNewMessage(url+res.data);
      });
      setLoadingFile(false);
    }
  };
  useEffect(() => {
    getFile();
  }, [file]);
  const scrollRef = useRef();
  useEffect(() => {
    if (scrollRef.current) {
      const chatContainer = scrollRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
  function isURL(text) {
    if (text.includes("https://")) {
      const extension = text.substring(text.lastIndexOf(".") + 1);
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const documentExtensions = ["doc", "docx", "txt", "rtf", "pdf"];
      const videoExtensions = ["mp4", "avi", "mov"];
      const audioExtensions = ["mp3", "wav", "ogg"];
      if (imageExtensions.includes(extension)) {
        return "Image";
      } else if (documentExtensions.includes(extension)) {
        return "Document";
      } else if (videoExtensions.includes(extension)) {
        return "Video";
      } else if (audioExtensions.includes(extension)) {
        return "Audio";
      } else {
        return "Unknown";
      }
    }
  }
  const [userCount, setUserCount] = useState(3);
  useEffect(() => {
    setUserCount(3);
  }, [selectedChat]);
  const [addUserGC, setAddUserGC] = useState("");
  const [addUserSearchGC, setAddUserSearchGC] = useState([]);
  useEffect(() => {
    if (addUserGC.length >= 3) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.user.token}`,
          },
        };
        axios
          .get(`${url}/user?search=${addUserGC}`, config)
          .then((res) => setAddUserSearchGC(res.data));
      } catch (error) {
        console.log(error);
      }
    }
  }, [addUserGC]);
  const handleDeleteGroup = () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      };
      axios
        .delete(`${url}/chat/groupChat/${selectedChat._id}`, config)
        .then((res) =>
          toast.success(`${res.data.message}`, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })
        );
      setSelectedChat("");
      fetchChat();
    } catch (error) {
      console.log(error);
    }
  };
  const addUserGroup = (userToAdd) => {
    var exists =
      selectedChat.isGroupChat &&
      selectedChat?.user.some((item) => {
        return item._id === userToAdd._id;
      });
    if (!exists) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.user.token}`,
          },
        };
        axios
          .put(
            `${url}/chat/groupChatAdd`,
            {
              chatId: selectedChat._id,
              userId: userToAdd._id,
            },
            config
          )
          .then((res) => {
            toast.success(`${userToAdd.name} add to group`, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setSelectedChat(res.data.added);
            setNewMessage("");
            fetchChat();
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.warning(`User already added`, {
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
  };
  const handleLogout = () => {
    socket.current.emit("remove");
  };
  window.addEventListener("beforeunload", handleLogout);
  const Mobile = window.matchMedia("(max-width: 480px)");
  const [hideElement, setHideElement] = useState(false);
  return (
    <DIV>
      <div id="main">
        <SIDEBAR isHide={hideElement}>
          <nav>
            <div>
              <Avatar
                alt="Remy Sharp"
                src={auth.user.user.profilePicture}
                sx={{ width: 50, height: 50 }}
              />
              <div>
                <Tooltip title="Notification">
                  <IconButton>
                    <Badge
                      color="secondary"
                      badgeContent={notification.length}
                      max={100}
                    >
                      <IoNotificationsSharp
                        style={{ color: "white" }}
                        aria-controls="menu2"
                        aria-haspopup="true"
                        onClick={(e) => handleClick(e, "menu2")}
                      />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu2"
                  anchorEl={anchorEl}
                  open={currentMenu === "menu2"}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {!notification.length && (
                    <p style={{ padding: "5px" }}>No New Message</p>
                  )}
                  {notification?.map((e) => (
                    <MenuItem
                      key={notification._id}
                      className={classes.customFont}
                      onClick={() => {
                        handleClose();
                        setSelectedChat(e.chat);
                        setNotification(notification.filter((n) => n !== e));
                      }}
                    >
                      {e.chat.isGroupChat ? (
                        <p>
                          New Message in <b>{e.chat.chatName}</b>
                        </p>
                      ) : (
                        <p>
                          New Message from <b>{e.sender.name}</b>
                        </p>
                      )}
                    </MenuItem>
                  ))}
                </Menu>
                <Tooltip title="Menu">
                  <IconButton>
                    <BiDotsVerticalRounded
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={(e) => handleClick(e, "menu1")}
                      style={{ color: "white" }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu1"
                  anchorEl={anchorEl}
                  open={currentMenu === "menu1"}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    className={classes.customFont}
                    onClick={handleClose}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    className={classes.customFont}
                    onClick={() => {
                      handleClose();
                      handleOpenModel1();
                    }}
                  >
                    New Group
                  </MenuItem>
                  <MenuItem
                    className={classes.customFont}
                    onClick={() => {
                      dispatch(logout());
                      handleClose();
                      Nav("/");
                      socket.current.emit("remove");
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <Modal
              open={openModel1}
              onClose={handleCloseModel1}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h5"
                  component="h2"
                  className={classes.customFont}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  Create Group Chat
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <FORM onSubmit={handleSubmitGC}>
                    <input
                      required
                      type="text"
                      placeholder="Enter Group Name"
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Add Participant..."
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <span>
                      {selectedUsers?.map((u) => (
                        <UserBadge
                          key={u.id}
                          user={u}
                          handleFunction={() => handleDeleteGU(u)}
                        />
                      ))}
                    </span>
                    {searchInput?.length > 0 &&
                      searchResultGC?.splice(0, 5).map((user) => (
                        <div key={user._id} onClick={() => handleGroup(user)}>
                          <Avatar
                            alt={user.name}
                            src={user.profilePicture}
                            sx={{ width: 35, height: 35 }}
                          />
                          <div>
                            <b>{user.name}</b>
                            <p>{user.email}</p>
                          </div>
                        </div>
                      ))}
                    <button>Create Group</button>
                  </FORM>
                </Typography>
              </Box>
            </Modal>
            <form action="" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search by Name or Email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button>
                <HiSearch />
              </button>
            </form>
          </nav>
          <section>
            <div>
              {searchResult?.length <= 0 ? (
                <span>User Not Found</span>
              ) : (
                searchResult?.map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
            </div>
            <div>
              {chat?.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => {
                    setSelectedChat(chat);
                    setHideElement(true);
                  }}
                  style={{
                    backgroundColor: `${
                      selectedChat === chat ? "#014c7f" : "transparent"
                    }`,
                    paddingLeft: "5px",
                  }}
                >
                  {!chat.isGroupChat ? (
                    <Avatar
                      alt="Remy Sharp"
                      src={getLogo(chat.user)}
                      sx={{ width: 50, height: 50 }}
                    />
                  ) : (
                    <Avatar
                      alt="Remy Sharp"
                      src="https://res.cloudinary.com/CLOUD_NAME/image/upload/v1687522550/fppxr6sjpz8gdiqvrbpu.jpg"
                      sx={{ width: 50, height: 50 }}
                    />
                  )}
                  <h1>
                    {!chat.isGroupChat ? getSender(chat.user) : chat.chatName}
                  </h1>
                </div>
              ))}
            </div>
          </section>
        </SIDEBAR>
        <MAIN isHide={hideElement}>
          <>
            {selectedChat ? (
              <>
                <nav>
                  <div>
                    {!selectedChat.isGroupChat ? (
                      <>
                        <BiArrowBack
                          className="backIcon"
                          onClick={() => {
                            setSelectedChat("");
                            setHideElement(false);
                          }}
                        />
                        <Avatar
                          alt="Remy Sharp"
                          src={getLogo(selectedChat.user)}
                          sx={{ width: 50, height: 50 }}
                        />
                      </>
                    ) : (
                      <>
                        <BiArrowBack
                          className="backIcon"
                          onClick={() => {
                            setSelectedChat("");
                            setHideElement(false);
                          }}
                        />
                        <Avatar
                          alt="Remy Sharp"
                          src="https://res.cloudinary.com/CLOUD_NAME/image/upload/v1687522550/fppxr6sjpz8gdiqvrbpu.jpg"
                          sx={{ width: 50, height: 50 }}
                        />
                      </>
                    )}
                    <h1 style={{ display: "grid" }}>
                      {!selectedChat.isGroupChat
                        ? getSender(selectedChat.user)
                        : selectedChat.chatName}
                      <small style={{ fontSize: "12px" }}>
                        {!selectedChat?.isGroupChat
                          ? active?.find(
                              (users) =>
                                users.email === getEmail(selectedChat?.user) &&
                                users.online
                            )
                            ? "Online"
                            : "Offline"
                          : null}
                      </small>
                    </h1>
                  </div>
                  <Tooltip title="Menu">
                    <IconButton>
                      <BiDotsVerticalRounded
                        onClick={() => setIsDrawerOpen(true)}
                      />
                    </IconButton>
                  </Tooltip>
                  <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                  >
                    <div style={{ padding: "20px 20px", textAlign: "center" }}>
                      {!selectedChat.isGroupChat ? (
                        <>
                          <Avatar
                            alt="Remy Sharp"
                            src={getLogo(selectedChat.user)}
                            sx={{ width: 250, height: 250, margin: "auto" }}
                          />
                          <h1
                            style={{ marginTop: "20px", marginBottom: "10px" }}
                          >
                            {getSender(selectedChat.user)}
                          </h1>
                          <h3
                            style={{ textAlign: "left", marginBottom: "10px" }}
                          >
                            <b>Email: </b>
                            {getEmail(selectedChat.user)}
                          </h3>
                          <h3 style={{ textAlign: "left", width: "380px" }}>
                            <b>Status: </b>
                            {getStatus(selectedChat.user)}
                          </h3>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={name}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                ref={inputRef}
                                style={{
                                  border: "0",
                                  borderBottom: "2px solid",
                                  fontSize: "28px",
                                  width: "50%",
                                  outline: "none",
                                  padding: "5px",
                                  backgroundColor: "transparent",
                                }}
                              />
                            ) : (
                              <input
                                type="text"
                                value={name}
                                disabled
                                style={{
                                  border: 0,
                                  fontSize: "28px",
                                  width: "50%",
                                  outline: "none",
                                  padding: "5px",
                                  fontWeight: "bold",
                                  backgroundColor: "transparent",
                                  textAlign: "center",
                                }}
                              />
                            )}
                            {isEditing ? (
                              <Tooltip title="Save">
                                <IconButton>
                                  <TiTick
                                    onClick={handleTickClick}
                                    style={{
                                      fontSize: "24px",
                                      cursor: "pointer",
                                      color: "black",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            ) : selectedChat.admin.email ==
                              auth.user.user.email ? (
                              <Tooltip title="Edit">
                                <IconButton>
                                  <MdEdit
                                    onClick={handleEditClick}
                                    style={{
                                      fontSize: "24px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                          </div>
                          <p style={{ margin: "10px" }}>
                            Group . {selectedChat.user.length} participants
                          </p>
                          <div></div>
                          {selectedChat.user?.slice(0, userCount).map((user) =>
                            selectedChat.admin.email === user.email ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "300px",
                                  backgroundColor: "lightgrey",
                                  padding: "5px",
                                  borderRadius: "5px",
                                  margin: "auto",
                                  marginTop: "10px",
                                }}
                              >
                                <Avatar
                                  alt="Remy Sharp"
                                  src={selectedChat.admin.profilePicture}
                                  sx={{ width: 50, height: 50 }}
                                />
                                <div
                                  style={{
                                    textAlign: "left",
                                    marginLeft: "5px",
                                  }}
                                >
                                  {selectedChat.admin.email ==
                                  auth.user.user.email ? (
                                    <b>You</b>
                                  ) : (
                                    <>
                                      <b>{selectedChat.admin.name}</b>
                                      <p>{selectedChat.admin.email}</p>
                                    </>
                                  )}
                                </div>
                                <small
                                  style={{
                                    backgroundColor: "gray",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    marginLeft: "auto",
                                    marginRight: 0,
                                  }}
                                >
                                  Admin
                                </small>
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "300px",
                                  backgroundColor: "lightgrey",
                                  padding: "5px",
                                  borderRadius: "5px",
                                  margin: "auto",
                                  marginTop: "10px",
                                  // justifyContent: "space-between",
                                }}
                              >
                                <Avatar
                                  alt="Remy Sharp"
                                  src={user.profilePicture}
                                  sx={{ width: 50, height: 50 }}
                                />
                                <div
                                  style={{
                                    textAlign: "left",
                                    marginLeft: "5px",
                                  }}
                                >
                                  {user.email == auth.user.user.email ? (
                                    <b>You</b>
                                  ) : (
                                    <>
                                      <b>{user.name}</b>
                                      <p>{user.email}</p>
                                    </>
                                  )}
                                </div>
                                {selectedChat.admin.email ==
                                auth.user.user.email ? (
                                  <MdDelete
                                    onClick={() =>
                                      handleDeleteUser(user._id, user.name)
                                    }
                                    style={{
                                      fontSize: "24px",
                                      cursor: "pointer",
                                      marginLeft: "auto",
                                      marginRight: 0,
                                    }}
                                  />
                                ) : null}
                              </div>
                            )
                          )}
                          <div
                            style={{
                              marginLeft: "50%",
                              marginTop: "5px",
                              cursor: "pointer",
                            }}
                          >
                            <button onClick={() => setUserCount(userCount + 1)}>
                              See More
                            </button>
                            {"   "}
                            <button onClick={() => setUserCount(3)}>
                              Reset
                            </button>
                          </div>
                          {selectedChat.admin.email == auth.user.user.email ? (
                            <div>
                              <button
                                style={{
                                  marginTop: "10px",
                                  marginLeft: "60%",
                                  padding: "5px",
                                  fontSize: "16px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  backgroundColor: "#00192a",
                                  border: 0,
                                  color: "white",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={handleAddUserClick}
                              >
                                <AiOutlineUsergroupAdd />
                                Add User
                              </button>
                            </div>
                          ) : null}
                          {showInput &&
                            (selectedChat.admin.email ==
                            auth.user.user.email ? (
                              <input
                                type="text"
                                placeholder="Search user..."
                                value={addUserGC}
                                style={{ padding: "10px", marginTop: "5px" }}
                                onChange={(e) => setAddUserGC(e.target.value)}
                              />
                            ) : null)}
                          {addUserSearchGC?.splice(0, 5).map((user) => (
                            <div
                              key={user._id}
                              style={{
                                display: "flex",
                                margin: "auto",
                                borderBottom: "1px solid black",
                                padding: "5px",
                                width: "fit-content",
                                marginTop: "2px",
                                textAlign: "start",
                                gap: "2px",
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "lightgray",
                                },
                              }}
                              onClick={() => addUserGroup(user)}
                            >
                              <Avatar
                                alt={user.name}
                                src={user.profilePicture}
                                sx={{ width: 35, height: 35 }}
                              />
                              <div>
                                <b>{user.name}</b>
                                <p>{user.email}</p>
                              </div>
                            </div>
                          ))}
                          <br />
                          {selectedChat.admin.email == auth.user.user.email ? (
                            <button
                              style={{
                                color: "red",
                                fontSize: "18px",
                                backgroundColor: "transparent",
                                border: "2px solid red",
                                padding: "5px",
                                borderRadius: "5px",
                                outline: "0",
                                cursor: "pointer",
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "center",
                                position: "absolute",
                                bottom: "50px",
                                left: "25%",
                                right: "25%",
                              }}
                              onClick={handleDeleteGroup}
                            >
                              <MdDelete />
                              Delete Group
                            </button>
                          ) : null}
                        </>
                      )}
                    </div>
                  </Drawer>
                </nav>
                <div className="msg">
                  {loadingChat ? (
                    <div
                      style={{
                        width: "50%",
                        margin: "auto",
                        paddingTop: "25%",
                      }}
                    >
                      <LinearProgress />
                    </div>
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        overflowX: "hidden",
                        height: "90%",
                        scrollBehavior: "smooth",
                      }}
                      ref={scrollRef}
                    >
                      {message?.map((m, i) => (
                        <div key={m._id}>
                          <div
                            className={
                              m.sender._id === auth.user.user._id
                                ? "sent"
                                : "received"
                            }
                          >
                            <span>
                              {m.sender._id !== auth.user.user._id &&
                              selectedChat?.isGroupChat ? (
                                <small> ~ {m.sender.name}</small>
                              ) : null}
                              {isURL(m.content) === "Image" ? (
                                <img
                                  src={m.content}
                                  alt={m.content}
                                  width="300px"
                                />
                              ) : isURL(m.content) === "Audio" ? (
                                <audio controls>
                                  <source src={m.content} />
                                </audio>
                              ) : isURL(m.content) === "Video" ? (
                                <video controls width="250px">
                                  <source src={m.content} />
                                </video>
                              ) : isURL(m.content) === "Document" ? (
                                <a
                                  href={m.content}
                                  target="blank"
                                  style={{
                                    marginTop: "5px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <IoDocumentText style={{ color: "black" }} />
                                  {m.content.split("/").pop()}
                                </a>
                              ) : isURL(m.content) === "Unknown" ? (
                                <a href={m.content} target="blank">
                                  {m.content}
                                </a>
                              ) : (
                                m.content
                              )}
                              <small id="date">{formatDate(m.createdAt)}</small>
                            </span>
                            <br />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={sendMessage}>
                    <input
                      type="text"
                      required
                      placeholder="Enter a message..."
                      onChange={typingHandler}
                      value={newMessage}
                      autoFocus
                    />
                    {loadingFile ? (
                      <AiOutlineLoading className="infinity-rotation" />
                    ) : (
                      <>
                        <label htmlFor="file">
                          <IoAttach />
                        </label>
                        <input
                          type="file"
                          style={{ display: "none" }}
                          id="file"
                          onChange={(e) => onFileChange(e)}
                        />
                      </>
                    )}
                    <button disabled={loadingFile}>
                      <BsSendFill />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div id="logo">
                <img src={"https://png.pngtree.com/element_our/png/20181229/vector-chat-icon-png_302635.jpg"} alt="" />
                <h2>Click on a user to start chatting</h2>
              </div>
            )}
          </>
        </MAIN>
      </div>
    </DIV>
  );
}
const MAIN = styled.div`
  height: 100%;
  width: 70%;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  background-color: white;
  #logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 15%;
    img {
      width: 30%;
      margin: auto;
      display: block;
    }
  }
  nav {
    div {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .backIcon {
      display: none;
    }
    height: 10vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    svg {
      font-size: 26px;
      cursor: pointer;
    }
  }
  .msg {
    position: relative;
    margin: 20px;
    height: 75vh;
    border-radius: 5px;
    ::-webkit-scrollbar {
      width: 0px;
    }
    .received {
      text-align: left;
      margin-top: 5px;
      margin-left: 10px;
      span {
        background-color: #33cf33;
        padding: 5px 10px;
        position: relative;
        color: #fff;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
        display: flex;
        flex-direction: column;
        width: fit-content;
        /* text-align: end; */
        small {
          /* text-align: start; */
          margin-bottom: 5px;
          color: #032403;
        }
        #date {
          font-size: 10px;
          text-align: end;
          margin-top: 2px;
        }
      }
      span::after {
        content: " ";
        position: absolute;
        left: -10px;
        top: 0px;
        border-top: 0px solid transparent;
        border-right: 10px solid #33cf33;
        border-left: none;
        border-bottom: 10px solid transparent;
      }
    }
    .sent {
      text-align: right;
      margin-top: 5px;
      margin-right: 10px;
      display: flex;
      justify-content: flex-end;
      span {
        display: flex;
        flex-direction: column;
        background-color: #29acd7;
        padding: 5px 10px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border-top-left-radius: 5px;
        color: #fff;
        position: relative;
        text-align: start;
        #date {
          color: #031a2f;
          font-size: 10px;
          text-align: end;
          margin-top: 2px;
        }
      }
      span::after {
        content: " ";
        position: absolute;
        right: -10px;
        top: 0px;
        border-top: 0px solid transparent;
        border-right: none;
        border-left: 10px solid #29acd7;
        border-bottom: 10px solid transparent;
      }
    }
    form {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      background-color: #f0f0f0;
    }
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
    }
    input {
      padding: 10px;
      font-size: 14px;
      width: 100%;
      background-color: transparent;
      border: 1px solid;
      border-radius: 5px;
    }
    svg {
      font-size: 36px;
      padding: 5px;
      cursor: pointer;
      color: #3d3d3d;
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0;
      outline: none;
      background-color: #007bf0;
      cursor: pointer;
      border-radius: 50%;
      padding: 5px;
      svg {
        color: white;
        padding: 5px;
        font-size: 30px;
      }
    }
  }
  @media screen and (min-width: 866px) and (max-width: 1024px) /* Laptop */ {
    width: 60%;
  }
  @media screen and (min-width: 481px) and (max-width: 865px) /* Tablet */ {
    nav {
      .backIcon {
        display: block;
      }
    }
    display: ${(props) => (props.isHide ? "block" : "none")};
    width: ${(props) => (props.isHide ? "100%" : "0")};
    #logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 15%;
      img {
        width: 50%;
      }
      h2 {
        text-align: center;
      }
    }
  }
  @media screen and (max-width: 480px) /* Mobile */ {
    display: ${(props) => (props.isHide ? "block" : "none")};
    width: ${(props) => (props.isHide ? "100%" : "0")};
    nav {
      .backIcon {
        display: block;
      }
    }
    #logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 15%;
      gap: 30px;
      img {
        width: 70%;
      }
      h2 {
        text-align: center;
      }
    }
  }
`;
const DIV = styled.div`
  border: 1px solid transparent;
  #main {
    margin: 5vh;
    height: 89.7vh;
    border-radius: 10px;
    display: flex;
  }
`;
const SIDEBAR = styled.aside`
  height: 100%;
  width: 30%;
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  background-color: #007bfe;
  padding: 30px 25px 0 25px;
  color: #fafefb;
  nav {
    display: flex;
    flex-direction: column;
    gap: 15px;
    > div:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 26px;
        font-weight: bolder;
      }
      div {
        display: flex;
        align-items: center;
        gap: 5px;
        svg {
          font-size: 22px;
          cursor: pointer;
        }
      }
    }
    > div:last-child {
      > div:last-child {
        border-bottom: 2px solid white;
      }
    }
    form {
      margin: auto;
      display: flex;
      width: 100%;
      input {
        border-bottom-left-radius: 15px;
        border-top-left-radius: 15px;
        width: 90%;
        background-color: #3497ff;
        border: 0;
        padding: 10px;
        padding-left: 15px;
        outline: none;
        font-family: "Comfortaa", cursive;
        font-size: 18px;
        caret-color: #fafefb;
        color: white;
      }
      button {
        border-bottom-right-radius: 15px;
        border-top-right-radius: 15px;
        width: 10%;
        background-color: #3497ff;
        font-size: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0;
        padding-right: 10px;
        color: white;
        font-weight: 900;
        cursor: pointer;
      }
    }
  }
  ::-webkit-scrollbar {
    width: 0px;
  }
  section {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    overflow-y: scroll;
    height: 75%;
    > div:last-child {
      display: flex;
      flex-direction: column;
      > div {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        h1 {
          border-bottom: 1px solid white;
          width: 100%;
          padding: 20px 0px;
        }
      }
      > div:hover {
        background-color: #3497ff;
      }
    }
  }
  @media screen and (min-width: 866px) and (max-width: 1024px) /* Laptop */ {
    width: 40%;
  }
  @media screen and (min-width: 481px) and (max-width: 865px) /* Tablet */ {
    border-radius: 10px;
    display: ${(props) => (props.isHide ? "none" : "block")};
    width: ${(props) => (props.isHide ? "0" : "100%")};
  }
  @media screen and (max-width: 480px) /* Mobile */ {
    border-radius: 10px;
    display: ${(props) => (props.isHide ? "none" : "block")};
    width: ${(props) => (props.isHide ? "0" : "100%")};
  }
`;
const FORM = styled.form`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 10px;
  span {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }
  > div {
    display: flex;
    align-items: center;
    background-color: lightgray;
    margin-top: 5px;
    padding-left: 5px;
    border-radius: 10px;
    gap: 5px;
    cursor: pointer;
    div {
      display: flex;
      flex-direction: column;
      justify-content: left;
      align-items: start;
    }
  }
  > div:hover {
    background-color: gray;
  }
  input {
    padding: 10px;
  }
  button {
    width: 40%;
    padding: 10px;
    margin: auto;
    background-color: #014c7f;
    border: 0;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }
`;
