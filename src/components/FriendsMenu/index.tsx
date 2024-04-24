import { AssetUrls } from "@/common/AssetUrls";
import { apiContract } from "@/common/apiContract";
import colors from "@/common/colors";
import {
  ArrowDownOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Input, Table, Tooltip, message } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

interface Props {
  creatorId: string;
  userFriends: any;
  getFriendList: any;
  token: string;
}

interface HelperProps {
  isInputVisible?: boolean;
  isCheck?: boolean;
}
const Container = styled(motion.div)``;
const InputBox = styled.div<HelperProps>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: ${({ isInputVisible }) =>
    isInputVisible ? "space-between" : "flex-start"};
  align-items: center;
  flex-wrap: wrap;
`;
const AddFriendButton = styled.button`
  transition: all 5s;
  padding: 12px 18px;
  background-color: ${colors.orangePeel};
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1.2rem;
  cursor: pointer;
`;
const InputBar = styled(Input)`
  transition: all 5s;
  border-radius: 18px !important;
  padding: 10px 12px !important;
  max-width: 500px;
`;
const ResponseOutput = styled.div`
  position: relative;
  max-width: 460px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
  padding: 10px 20px;
  background-color: ${colors.orangePeel};
  border-radius: 16px;
  margin: 30px 0;
`;
const ArrowIcon = styled.div`
  position: absolute;
  left: 50%;
  top: -40%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 1.7rem;
`;
const IconDiv = styled(Tooltip)<HelperProps>`
  position: absolute;
  right: ${({ isCheck }) => (isCheck ? "43px" : "10px")};
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  padding: 3px 5px;
  border-radius: 50%;
  color: black;
  cursor: pointer;
  transition: all 0.4s;
  &:hover {
    background-color: black;
    color: white;
  }
`;
const ActionButton = styled.button`
  padding: 12px 20px;
  border: none;
  color: white;
  background-color: ${colors.redsolid};
  border-radius: 1rem;
  cursor: pointer;
`;
const FriendList = styled.div`
  margin-top: 8rem;
`;
const StreakColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
`;
interface userResponse {
  email: string;
  firstName: string;
  name: string;
  uid: string;
}

const FriendsMenu = (props: Props) => {
  const { creatorId, userFriends, getFriendList, token } = props;
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [searchedResponse, setSearchedResponse] = useState<userResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState([]);
  let count = 1;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setTableData(userFriends);
    }, 2000);
  }, [creatorId]);
  useEffect(() => {
    setTableData(userFriends);
  }, [getFriendList]);
  const handelAddFriendClick = () => {
    setIsInputVisible(!isInputVisible);
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      creatorId: creatorId,
    },
  };
  const handleInputChange = async (q: string) => {
    setSearchedResponse(null);
    setQuery(q);
    if (q.includes("@")) {
      await axios
        .get(
          `http://localhost:8080${apiContract.fetUserDetails}/${q}`,
          axiosConfig
        )
        .then((res) => {
          message.success("User found based on email");
          setSearchedResponse(res.data.data);
        })
        .catch((err) => {
          console.log("jindal", err);
        });
    }
  };
  const handleAddFriend = async () => {
    await axios
      .post(
        `http://localhost:8080${apiContract.addFriend}/${creatorId}`,
        {
          userId: searchedResponse?.uid,
        },
        axiosConfig
      )
      .then((res) => {
        message.success(res.data.message);
        getFriendList(creatorId);
        handleInputChange("");
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  const handleRemoveFriend = async (friendId: any) => {
    await axios
      .post(
        `http://localhost:8080${apiContract.removeFriend}/${creatorId}`,
        {
          friendId: friendId,
        },
        axiosConfig
      )
      .then((res) => {
        getFriendList(creatorId);
        message.success(res.data.message);
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }
  const columns = [
    {
      title: "S.No",
      align: "center",
      width: "10%",
      render: () => <p>{count++}</p>,
    },
    {
      title: "Name",
      align: "center",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      align: "center",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Streak",
      align: "center",
      dataIndex: "streak",
      key: "streak",
      render: function (data: number) {
        return (
          <StreakColumn>
            <img src={AssetUrls.STREAK_ICON} width={40} />
            <p>{data}</p>
          </StreakColumn>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: "20%",
      render: function (data: any) {
        return (
          <ActionButton onClick={() => handleRemoveFriend(data?.uid)}>
            Remove friend
          </ActionButton>
        );
      },
    },
  ];
  const handleCancelAddFriend = () => {
    handleInputChange("");
  };

  return (
    <Container
      initial={{ opacity: 0, x: -1000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5 }}
    >
      <InputBox isInputVisible={isInputVisible}>
        {isInputVisible && (
          <InputBar
            placeholder="Search user by mail"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        )}
        <AddFriendButton onClick={handelAddFriendClick}>
          {isInputVisible ? "Close" : "Add a new Friend"}
        </AddFriendButton>
      </InputBox>
      {searchedResponse && (
        <ResponseOutput>
          <UserOutlined />
          <p>
            {searchedResponse?.name} ({searchedResponse?.email})
          </p>
          <IconDiv placement="bottom" title="Add friend" isCheck={true}>
            <CheckOutlined onClick={handleAddFriend} />
          </IconDiv>
          <IconDiv placement="bottom" title="Reject friend" isCheck={false}>
            <CloseOutlined onClick={handleCancelAddFriend} />
          </IconDiv>
          <ArrowIcon>
            <ArrowDownOutlined />
          </ArrowIcon>
        </ResponseOutput>
      )}
      {isLoading ? (
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="2"
          wrapperStyle={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            backgroundColor: "transparent",
            padding: "10px",
          }}
          wrapperClass=""
          visible={true}
        />
      ) : (
        <FriendList>
          <Table
            bordered={true}
            columns={columns}
            dataSource={tableData}
            tableLayout="fixed"
            pagination={tableData?.length > 10 ? { pageSize: 10 } : false}
          />
        </FriendList>
      )}
    </Container>
  );
};
export default FriendsMenu;
