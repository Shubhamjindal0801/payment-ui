"use client";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Header from "../../components/Header";
import { motion } from "framer-motion";
import FriendsMenu from "@/components/FriendsMenu";
import GroupsMenu from "@/components/GroupMenu";
import HomeDefaultMenu from "@/components/HomeDefaultMenu";
import colors from "@/common/colors";
import axios from "axios";
import { apiContract } from "@/common/apiContract";
import { message } from "antd";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  background-color: ${colors.tuna};
`;
const Tool = styled(motion.div)`
  width: 80vw;
  margin: 0 auto;
  background-color: ${colors.ebonyClay};
  color: white;
  margin-top: 1rem;
  border-radius: 10px;
  padding: 5rem 7rem;
`;

const Dashboard = () => {
  const [creatorId, setCreatorId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [currentKey, setCurrentKey] = useState<string>("home");
  const [userDetails, setUserDetails] = useState<any>();
  const [userFriends, setUserFriends] = useState<any>();
  const [groupList, setGroupList] = useState<any>([]);
  const [getGroupTransaction, setGetGroupTransaction] = useState<any>([]);

  useEffect(() => {
    const data = localStorage.getItem("users");
    if (data) {
      const dataObj = JSON.parse(data);
      setCreatorId(dataObj.creatorId);
      setToken(dataObj.token);
    }
  }, []);
  useEffect(() => {
    getTransactionAmounts();
  }, [groupList]);
  useEffect(() => {
    if (token && creatorId) {
      fetchUserDetails(creatorId);
      getFriendList(creatorId);
      getGroupList(creatorId);
    }
  }, [token]);
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      creatorId: creatorId,
    },
  };
  const getTransactionAmounts = async () => {
    setGetGroupTransaction([]);
    try {
      const requests = groupList.map((group: any) =>
        axios.post(
          `http://localhost:8080${apiContract.getTransactionAmount}/${creatorId}`,
          { gid: group.gid },
          axiosConfig
        )
      );

      const responses = await Promise.all(requests);

      const updatedTransactions = responses.map((res, index) => {
        const group = groupList[index];
        if (res.data.status === 204) {
          return { [group.gid]: {} };
        } else if (res.data.status === 200) {
          return { [group.gid]: res.data.data };
        }
        return null;
      });

      setGetGroupTransaction(updatedTransactions);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserDetails = async (id: string) => {
    await axios
      .get(
        `http://localhost:8080${apiContract.fetUserDetails}/${id}`,
        axiosConfig
      )
      .then((res) => {
        setUserDetails(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getFriendList = async (id: string) => {
    await axios
      .get(
        `http://localhost:8080${apiContract.getFriendList}/${id}`,
        axiosConfig
      )
      .then((res) => {
        setUserFriends(res.data.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
  const getGroupList = async (id: string) => {
    await axios
      .get(
        `http://localhost:8080${apiContract.getGroupList}/${id}`,
        axiosConfig
      )
      .then((res) => {
        setGroupList(res.data.data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const handleMenuItemChange = (e: any) => {
    setCurrentKey(e.key);
  };
  const handleTransactionClick = (key: string) => {
    setCurrentKey(key);
  };
  const getTool = () => {
    if (creatorId) {
      switch (currentKey) {
        case "home":
          return (
            <HomeDefaultMenu
              handleTransactionClick={handleTransactionClick}
              userDetails={userDetails}
            />
          );
        case "friends":
          return (
            <FriendsMenu
              creatorId={creatorId}
              userFriends={userFriends}
              getFriendList={getFriendList}
              token={token}
            />
          );
        case "groups":
          return (
            <GroupsMenu
              creatorId={creatorId}
              userDetails={userDetails}
              fetchUserDetails={fetchUserDetails}
              userFriends={userFriends}
              groupList={groupList}
              setGroupList={setGroupList}
              getGroupList={getGroupList}
              getGroupTransaction={getGroupTransaction}
              getTransactionAmounts={getTransactionAmounts}
              token={token}
            />
          );
        default:
          return null;
      }
    }
  };
  return (
    <Container>
      <Header
        currentKey={currentKey}
        handleMenuItemChange={handleMenuItemChange}
      />
      <Tool
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {getTool()}
      </Tool>
    </Container>
  );
};

export default Dashboard;
