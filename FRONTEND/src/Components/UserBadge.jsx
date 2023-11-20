import React from "react";
import { styled } from "styled-components";
import { IoClose } from "react-icons/io5";
function UserBadge({ user, handleFunction }) {
  return (
    <Badge onClick={handleFunction}>
      {user.name}
      <IoClose/>
    </Badge>
  );
}
const Badge = styled.section`
  background-color: #00192a;
  width: fit-content;
  margin-top: 5px;
  color: white;
  padding: 2px;
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: 5px;
  svg{
  color: white;
  }
`;
export default UserBadge;
