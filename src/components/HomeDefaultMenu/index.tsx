import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { RWebShare } from "react-web-share";

interface Props {
  handleTransactionClick: (key: string) => void;
  userDetails: any;
}

const Container = styled(motion.div)`
  height: 70vh;
`;
const WelcomeMsg = styled.div`
  margin-top: 7rem;
  max-width: 73%;
  line-height: 3rem;
  font-size: 1.7rem;
  span {
    font-size: 6.5rem;
    -webkit-text-stroke-width: 4px;
    -webkit-text-stroke-color: white;
    span {
    }
  }
  span:hover {
    color: black;
    -webkit-text-stroke-color: white;
    transition: all 1s;
  }
`;
const ButtomContainer = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;
const ShareButton = styled.button`
  padding: 0.7rem 3rem;
  border-radius: 20px;
  border: none;
  font-size: 1.3rem;
  color: white;
  background-color: transparent;
  border: 3px solid #387adf;
  cursor: pointer;
`;
const TransitionsButton = styled.button`
  padding: 0.7rem 3rem;
  border-radius: 20px;
  border: none;
  font-size: 1.3rem;
  color: white;
  background-color: #387adf;
  cursor: pointer;
`;

const HomeDefaultMenu = (props: Props) => {
  const { handleTransactionClick, userDetails } = props;
  const [greetMsg, setGreetMsg] = useState<string>();
  useEffect(() => {
    getGreetMsg(userDetails?.firstName);
  }, [userDetails]);

  const getGreetMsg = (name: string) => {
    if (!name) return;
    const currentHour = new Date().getHours();
    const firstLetter = name.slice(0, 1)?.toUpperCase();
    const userName = firstLetter + name.slice(1)?.toLowerCase();
    if (currentHour < 12) {
      setGreetMsg(`Good Morning ${userName}`);
    } else if (currentHour < 16) {
      setGreetMsg(`Good Afternoon ${userName}`);
    } else {
      setGreetMsg(`Good Evening ${userName}`);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, x: -1000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5 }}
    >
      <h1>{greetMsg && `${greetMsg}`}</h1>
      <WelcomeMsg>
        <span>
          Welcome to <span>Len Den, </span>
        </span>
        where friendship meets finances. Easily split bills, expenses, and more
        with your friends. Let's make managing money with your mates a breeze!
      </WelcomeMsg>
      <ButtomContainer>
        <TransitionsButton onClick={() => handleTransactionClick("groups")}>
          Groups
        </TransitionsButton>
        <RWebShare
          data={{
            text: "Len Den App made using Next JS.",
            url: "http://localhost:3000",
            title: "Len Den App",
          }}
        >
          <ShareButton>Share</ShareButton>
        </RWebShare>
      </ButtomContainer>
    </Container>
  );
};

export default HomeDefaultMenu;
