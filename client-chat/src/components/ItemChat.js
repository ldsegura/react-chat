import PointOnline from "./PointOnline";
import styled from "styled-components";
const Container = styled.div`
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #6a67ce;
    cursor: pointer;
    &:hover {
      background-color: #1aafd0;
    },
    &.active {
      background-color: #1aafd0;
    }
`;

const ItemChat = (props) => {
  const { user, active } = props;

  const onClick = () => {
    const { onClick } = props;
    onClick && onClick();
  };

  return (
    <Container onClick={onClick} className={`${active? "active": ""}`}>
      <div>{user.username}</div>
      <div>
        <PointOnline isOnline={user.isOnline} hasText />
      </div>
    </Container>
  );
};

export default ItemChat;
