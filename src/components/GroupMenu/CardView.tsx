import React, { useEffect, useState } from "react";
import { AssetUrls } from "@/common/AssetUrls";
import colors from "@/common/colors";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Tooltip } from "antd";

interface Props {
  groupDetail: any;
  favirouteGroups: any | null;
  handleFaviroute: (isFaviroute: boolean, gid: string) => void;
  setEditGroupModal: (val: boolean) => void | null;
  setSelectedGroup: any | null;
  getGroupTransaction: any;
}
interface HelperProps {
  colorTheme?: string;
}
const CardWrapper = styled.div<HelperProps>`
  width: 400px;
  height: 380px;
  background-color: ${colors.codGray};
  border: 2px solid ${colors.codGray};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    border: 2px solid
      ${({ colorTheme }) => {
        switch (colorTheme) {
          case "green":
            return `${colors.green}`;
          case "redsolid":
            return `${colors.redsolid}`;
          case "white":
            return `${colors.white}`;
        }
      }};
  }
`;
const TopNotch = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 1rem 1.5rem;
`;
const GroupIcon = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;
const GroupNameAndTag = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const GIDTag = styled.div`
  background-color: ${colors.orangePeel};
  width: fit-content;
  padding: 2px 10px;
  border-radius: 10px;
  margin: 0 auto;
`;
const WatchListIcon = styled.div<HelperProps>`
  padding: 0.5rem;
  font-size: 1.4rem;
  border: 2px solid
    ${({ colorTheme }) => {
      switch (colorTheme) {
        case "green":
          return `${colors.green}`;
        case "redsolid":
          return `${colors.redsolid}`;
        case "white":
          return `${colors.white}`;
      }
    }};
  color: ${colors.white};
  border-radius: 3rem;
  transition: all 0.3s;
  z-index: 100;
  &:hover {
    transform: scale(1.15);
  }
`;
const ChipFlex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin: 2rem 1.5rem;
`;
const PriceTag = styled.div<HelperProps>`
  border: 1px solid
    ${({ colorTheme }) => {
      switch (colorTheme) {
        case "green":
          return `${colors.green}`;
        case "redsolid":
          return `${colors.redsolid}`;
        case "white":
          return `${colors.white}`;
      }
    }};
  border-radius: 2rem;
  padding: 0.35rem 0.9rem;
  text-align: center;
  font-weight: 600;
  color: ${({ colorTheme }) => {
    switch (colorTheme) {
      case "green":
        return `${colors.green}`;
      case "redsolid":
        return `${colors.redsolid}`;
      case "white":
        return `${colors.white}`;
    }
  }};
  font-size: 1rem;
  max-width: 100px;
  &:hover {
    background-color: ${({ colorTheme }) => {
      switch (colorTheme) {
        case "green":
          return `${colors.emerald}`;
        case "redsolid":
          return `${colors.sunsetOrange}`;
        case "white":
          return `${colors.white}`;
      }
    }};
    color: ${colors.white};
  }
`;
const MemberCount = styled.div<HelperProps>`
  color: ${colors.white};
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  font-size: 1.2rem;
  margin: 2rem 1.5rem;
  border-radius: 2rem;
  text-align: center;
`;
const OweMoney = styled.div<HelperProps>`
  padding: 0.35rem 0.9rem;
  border: 1px solid ${colors.redsolid};
  border-radius: 2rem;
  color: ${colors.redsolid};
  text-align: center;
  margin: 1rem 1.5rem;
  font-weight: 600;
  &:hover {
    background-color: ${colors.sunsetOrange};
    color: ${colors.white};
  }
`;
const GetMoney = styled.div<HelperProps>`
  padding: 0.35rem 0.9rem;
  border: 1px solid ${colors.green};
  border-radius: 2rem;
  color: ${colors.green};
  text-align: center;
  margin: 0 1.5rem;
  font-weight: 600;
  &:hover {
    background-color: ${colors.emerald};
    color: ${colors.white};
  }
`;
const NoTransactionImage = styled.img`
  position: relative;
  left: 50%;
  top: -6%;
  transform: translateX(-50%);
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: ${colors.white};
`;
const NoTransactionStatement = styled.div<HelperProps>`
  padding: 0.35rem 0.9rem;
  border: 1px solid
    ${({ colorTheme }) => {
      switch (colorTheme) {
        case "green":
          return `${colors.redsolid}`;
        case "redsolid":
          return `${colors.green}`;
        case "white":
          return `${colors.white}`;
      }
    }};
  border-radius: 2rem;
  color: ${({ colorTheme }) => {
    switch (colorTheme) {
      case "green":
        return `${colors.redsolid}`;
      case "redsolid":
        return `${colors.green}`;
      case "white":
        return `${colors.white}`;
    }
  }};
  text-align: center;
  margin: 0 1.5rem;
  font-weight: 600;
  &:hover {
    background-color: ${colors.white};
    color: ${colors.black};
  }
`;

const CardView = (props: Props) => {
  const {
    groupDetail,
    favirouteGroups,
    handleFaviroute,
    setEditGroupModal,
    setSelectedGroup,
    getGroupTransaction,
  } = props;
  const [colorTheme, setColorTheme] = useState<string>("");
  const [isFaviroute, setIsFaviroute] = useState<boolean>(false);
  const [amount, setAmount] = useState<any>({
    owe: null,
    get: null,
  });
  useEffect(() => {
    checkFaviroute();
    getGroupTransaction.map((group: any) => {
      if (group?.[groupDetail.gid] === undefined) return;
      setAmount({
        owe: group[groupDetail.gid]?.give,
        get: group[groupDetail.gid]?.want,
      });
      setColorTheme(
        group[groupDetail.gid]?.want - group[groupDetail.gid]?.give >= 0
          ? "green"
          : group[groupDetail.gid]?.want - group[groupDetail.gid]?.give < 0
          ? "redsolid"
          : "white"
      );
    });
  }, []);
  useEffect(() => {
    checkFaviroute();
  }, [favirouteGroups]);
  const checkFaviroute = () => {
    setIsFaviroute(favirouteGroups?.includes(groupDetail.gid));
  };
  const handleCardClick = () => {
    setEditGroupModal(true);
    setSelectedGroup(groupDetail);
  };
  return (
    <>
      <CardWrapper onClick={handleCardClick} colorTheme={colorTheme}>
        <TopNotch>
          <GroupIcon src={groupDetail?.groupImage || AssetUrls.APP_LOGO} />
          <GroupNameAndTag>
            <p>{groupDetail?.groupName}</p>
            <GIDTag>{groupDetail?.gid}</GIDTag>
          </GroupNameAndTag>
          <WatchListIcon colorTheme={colorTheme}>
            <Tooltip
              placement="bottom"
              title={
                groupDetail?.isFaviorute
                  ? "Remove From faviroute"
                  : "Add to faviroute"
              }
            >
              {isFaviroute ? (
                <StarFilled
                  onClick={() => handleFaviroute(false, groupDetail?.gid)}
                />
              ) : (
                <StarOutlined
                  onClick={() => handleFaviroute(true, groupDetail?.gid)}
                />
              )}
            </Tooltip>
          </WatchListIcon>
        </TopNotch>

        {!isNaN(amount.get - amount.owe) && (
          <ChipFlex>
            <PriceTag colorTheme={colorTheme}>
              {amount.get - amount.owe >= 0 ? "+ " : "- "}
              {Math.abs(amount.get - amount.owe)}
            </PriceTag>
          </ChipFlex>
        )}

        <MemberCount colorTheme={colorTheme}>
          Total Number Of Members - {groupDetail.members?.length}
        </MemberCount>
        {!isNaN(amount.get - amount.owe) ? (
          <>
            <OweMoney colorTheme={colorTheme}>
              Amout you owe - ₹{amount.owe || 0}
            </OweMoney>
            <GetMoney colorTheme={colorTheme}>
              Amout you get - ₹{amount.get || 0}
            </GetMoney>
          </>
        ) : (
          <>
            <NoTransactionImage src={AssetUrls.NO_TRANSACTION_IMAGE} />
            <NoTransactionStatement colorTheme={colorTheme}>
              No Transaction Added Yet
            </NoTransactionStatement>
          </>
        )}
      </CardWrapper>
    </>
  );
};

export default CardView;
