import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  HomeOutlined,
  LogoutOutlined,
  TransactionOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps, Tooltip } from "antd";
import { AssetUrls } from "@/common/AssetUrls";
import colors from "@/common/colors";

interface Props {
  currentKey: string;
  handleMenuItemChange: any;
}
const Container = styled(motion.div)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: ${colors.ebonyClay};
  color: white;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;
const LogoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  font-size: 2rem;
`;
const LogoutLogo = styled(Tooltip)`
  span {
    font-style: italic;
    font-size: 1.4rem;
  }
  &:hover {
    cursor: pointer;
  }
`;
const MenuItems = styled(Menu)`
  width: fit-content;
  padding: 8px 30px;
  border-radius: 2rem;
  transform: scale(1.08);
  background-color: white;
`;
const LogoImage = styled.img`
  width: 60px;
`;

const Header = (props: Props) => {
  const { currentKey, handleMenuItemChange } = props;
  const handleLogout = () => {
    localStorage.removeItem("users");
    window.location.href = "/";
  };
  const items: MenuProps["items"] = [
    {
      label: "Home",
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: "Groups",
      key: "groups",
      icon: <UsergroupAddOutlined />,
    },
    {
      label: "Friends",
      key: "friends",
      icon: <UserOutlined />,
    },
  ];
  return (
    <Container
      initial={{ opacity: 0, x: -1000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <Tooltip title="Len Den" placement="bottom">
        <LogoImage src={AssetUrls.APP_LOGO} />
      </Tooltip>
      <MenuItems
        theme="light"
        mode="horizontal"
        items={items}
        selectedKeys={[currentKey]}
        onClick={handleMenuItemChange}
      />
      <LogoutContainer>
        <LogoutLogo title="Logout" placement="bottom">
          <LogoutOutlined onClick={handleLogout} />
        </LogoutLogo>
      </LogoutContainer>
    </Container>
  );
};

export default Header;
