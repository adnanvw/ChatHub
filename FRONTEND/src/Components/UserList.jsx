import { Avatar } from "@mui/material";
import React from "react";
import { styled } from "styled-components";

export default function UserList({ user, handleFunction }) {
  return (
    <DIV onClick={handleFunction}>
      <Avatar
        alt={user.name}
        src={user.profilePicture}
        sx={{ width: 35, height: 35 }}
      />
      <div>
        <h4>{user.name}</h4>
        <p>
          <b>Email: </b>
          {user.email}
        </p>
      </div>
    </DIV>
  );
}
const DIV = styled.div`
  display: flex;
  background-color: #2caafe;
  border-radius: 5px;
  gap: 5px;
  margin-bottom: 5px;
  padding: 10px;
  padding-right: 0px;
  align-items: center;
  cursor: pointer;
  p {
    font-size: small;
  }
`;
