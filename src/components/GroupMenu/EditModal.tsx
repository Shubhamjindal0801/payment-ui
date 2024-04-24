import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  message,
} from "antd";
import styled from "@emotion/styled";
import colors from "@/common/colors";
import {
  ArrowDownOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { apiContract } from "@/common/apiContract";
import { GROUP_UPDATE_TYPE } from "@/common/groupUpdateType";
import Papa from "papaparse";
import moment from "moment";
import { AddTransaction } from "../../common/Interface/AddTransaction";
import "../../app/layout.css";
import { AssetUrls } from "@/common/AssetUrls";

interface Props {
  selectedGroup: any;
  editGroupModal: any;
  setEditGroupModal: any;
  creatorId: string;
  getGroupTransaction: any;
  getTransactionAmounts: any;
  token: string;
}
interface userResponse {
  email: string;
  firstName: string;
  name: string;
  uid: string;
}

interface HelperProps {
  isDisabled?: boolean;
  isCheck?: boolean;
  suffixAmount?: number;
  settled?: boolean;
}

const Container = styled.div`
  width: 100%;
`;
const TopFriendNotch = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const AddMoreFriendButton = styled.button`
  padding: 10px 16px;
  background-color: ${colors.orangePeel};
  color: ${colors.white};
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.1);
    background-color: ${colors.turquoiseapprox};
    color: ${colors.white};
  }
`;
const Friendlist = styled.div`
  min-width: 300px;
  max-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background-color: ${colors.tuna};
  color: ${colors.white};
  border: 1px solid black;
  overflow-y: auto;
  box-shadow: 0 0 10px black;
  label {
    border-bottom: 1px solid black;
    text-align: center;
    bakcground-color: ${colors.white};
  }
  cursor: pointer;
`;
const FriendName = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1rem;
`;
const DeleteIcon = styled.div`
  transition: all 0.3s;
  &:hover {
    font-size: 1.1rem;
    color: ${colors.black};
  }
`;
const AddNewFriendOption = styled.div`
  margin-top: 1rem;
`;
const InputBar = styled(Input)`
  border-radius: 18px !important;
  padding: 10px 12px !important;
  width: 350px !important;
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
  margin: 25px 0;
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
const ArrowIcon = styled.div`
  position: absolute;
  left: 50%;
  top: -30%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 1.7rem;
`;
const AdminTag = styled.div`
  background-color: ${colors.green};
  padding: 2px 5px;
  color: ${colors.white};
  border-radius: 10px;
`;
const GroupDescription = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const GroupLogo = styled(Image)`
  border-radius: 50%;
`;
const GroupNameAndTag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  p:nth-of-type(1) {
    font-size: 1.2rem;
    font-weight: bold;
    padding: 4px 16px;
    border-radius: 10px;
  }
  p:nth-of-type(2) {
    background-color: ${colors.turquoiseapprox};
    width: fit-content;
    padding: 2px 6px;
    border-radius: 10px;
  }
`;
const EditGroupButton = styled.button`
  padding: 10px;
  color: ${colors.white};
  background-color: ${colors.tuna};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  font-size: 1.2rem;
  transition: all 0.3s;
  &:hover {
    background-color: transparent;
    color: ${colors.black};
  }
`;
const DeleteGroupButton = styled.button<HelperProps>`
  padding: 10px;
  background-color: ${({ isDisabled }) =>
    isDisabled ? colors.gray : colors.redsolid};
  color: ${colors.white};
  border-radius: 50%;
  border: none;
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  font-size: 1.2rem;
`;
const TableContainer = styled.div`
  margin-top: 2rem;
  box-shadow: 0px 0px 30px 8px rgba(227, 227, 227, 0.75);
  padding: 1rem;
  border-radius: 1rem;
`;
const TableTopNotch = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;
const ExportCSVButton = styled.button`
  text-align: center;
  margin: 1rem 0rem;
  padding: 0.5rem;
  background-color: ${colors.white};
  border: 1px solid #2970ff;
  color: #2970ff;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem;
  justify-content: center;
  height: auto;
  border-radius: 0.3rem;
`;
const AddTransactionButton = styled.button`
  text-align: center;
  margin: 1rem 0rem;
  padding: 0.5rem;
  border: none;
  background-color: #2970ff;
  color: ${colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem;
  justify-content: center;
  height: auto;
  border-radius: 0.3rem;
`;
const TransactionForm = styled(Form)`
  .ant-form-item-label {
    width: 30%;
    text-align: center;
    margin-top: 0.5rem;
  }
`;
const InputBox = styled(Input)`
  border-radius: 18px;
  padding: 10px 12px;
  float: right;
  width: 370px;
`;
const AmountInput = styled(InputNumber)`
  border-radius: 18px;
  padding: 10px 12px;
  float: right;
  width: 380px;
`;
const DateInput = styled(DatePicker)`
  border-radius: 18px;
  padding: 10px 12px;
  float: right;
  width: 370px;
`;
const CancelButton = styled.div`
  padding: 0.8rem 2rem;
  border: 1px solid ${colors.redsolid};
  background-color: ${colors.white};
  color: ${colors.redsolid};
  cursor: pointer;
  border-radius: 0.3rem;
  transition: all 0.3s;
  &:hover {
    background-color: ${colors.redsolid};
    color: ${colors.white};
  }
`;
const AddTransactionBtn = styled.button`
  padding: 0.8rem 2rem;
  border: none;
  background-color: #2970ff;
  color: ${colors.white};
  cursor: pointer;
  border-radius: 0.3rem;
  transition: all 0.3s;
  &:hover {
    background-color: ${colors.white};
    color: ${colors.black};
  }
`;
const SwitchItem = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    margin-top: 0.7rem;
  }
`;
const ParticipantSelect = styled(Select)`
  min-width: 200px;
`;
const ParticipantAmount = styled(InputNumber)`
  border-radius: 18px;
  padding: 10px 12px;
  width: 170px;
`;
const FormSpace = styled(Space)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .ant-space-item:nth-child(3) {
    margin-bottom: 1.6rem;
  }
`;
const RemaningAmount = styled.div<HelperProps>`
  color: ${({ suffixAmount }) =>
    suffixAmount && suffixAmount < 0 ? colors.redsolid : colors.green};
`;
const SettleAmount = styled.button<HelperProps>`
  padding: 0.5rem 1rem;
  background-color: ${({ settled }) => (settled ? colors.gray : colors.green)};
  color: ${colors.white};
  border: none;
  border-radius: 0.3rem;
  transition: all 0.3s;
  &:hover {
    cursor: ${({ settled }) => (settled ? "default" : "pointer")};
    background-color: ${({ settled }) =>
      settled ? colors.gray : colors.orangePeel};
    color: ${colors.white};
  }
`;
const SortingDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const SortingIcon = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
`;
const NoTransactionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const OweContainer = styled.div`
  min-width: 300px;
  max-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background-color: ${colors.tuna};
  color: ${colors.white};
  border: 1px solid black;
  overflow-y: auto;
  box-shadow: 0 0 10px black;
  label {
    border-bottom: 1px solid black;
    text-align: center;
    bakcground-color: ${colors.white};
  }
  cursor: pointer;
`;
const WantContainer = styled.div`
  min-width: 300px;
  max-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background-color: ${colors.tuna};
  color: ${colors.white};
  border: 1px solid black;
  overflow-y: auto;
  box-shadow: 0 0 10px black;
  label {
    border-bottom: 1px solid black;
    text-align: center;
    bakcground-color: ${colors.white};
  }
  cursor: pointer;
`;
const OweWantName = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1rem;
`;

const GroupEditModal = (props: Props) => {
  const [formRef] = Form.useForm();
  const {
    selectedGroup,
    editGroupModal,
    setEditGroupModal,
    creatorId,
    getGroupTransaction,
    getTransactionAmounts,
    token,
  } = props;
  const [addFriendQuery, setAddFriendQuery] = useState<string>("");
  const [searchedResponse, setSearchedResponse] = useState<userResponse | null>(
    null
  );
  const [friendInputVisible, setFriendInputVisible] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<any>([]);
  const [deleteGroupDropdown, setDeleteGroupDropdown] =
    useState<boolean>(false);
  const [sortKeyValue, setSortKeyValue] = useState<string>("");
  const [isAddTransactionModal, setIsAddTransactionModal] =
    useState<boolean>(false);
  const [transactionDate, setTransactionDate] = useState<number>(0);
  const [switchValue, setSwitchValue] = useState<boolean>(true);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [suffixAmount, setSuffixAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState<string>("");
  const [transactionList, setTransactionList] = useState<any>(null);
  const [isAccending, setIsAccending] = useState<boolean>(false);
  const [individualTransactionList, setIndividualTransactionList] =
    useState<any>([]);
  const [fromWhomList, setFromWhomList] = useState<any>(null);
  const [toWhomList, setToWhomList] = useState<any>(null);

  useEffect(() => {
    getGroupDetails();
    getTransactionDetails();
    setSwitchValue(true);
    getIndividualTransaction();
  }, []);
  useEffect(() => {
    getIndividualTransaction();
  }, [getGroupTransaction]);
  useEffect(() => {
    getOweDetails("fromWhom");
    getOweDetails("toWhom");
  }, [individualTransactionList]);
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      creatorId: creatorId,
    },
  };
  const getOweDetails = async (value: string) => {
    const fetchData = async (item: any) => {
      const res = await axios.get(
        `http://localhost:8080${apiContract.fetUserDetails}/${item.id}`,
        axiosConfig
      );
      const response = res.data.data;
      return {
        id: item.id,
        name: response.name,
        amount: item.amount,
      };
    };
    const fetchDataForAllItems = async (items: any) => {
      return Promise.all(items.map((item: any) => fetchData(item)));
    };
    const items = individualTransactionList?.[value]?.[value] || [];
    const data = await fetchDataForAllItems(items);

    const accumulatedAmounts: { [id: string]: number } = {};
    data.forEach((item: any) => {
      if (accumulatedAmounts[item.id]) {
        accumulatedAmounts[item.id] += item.amount;
      } else {
        accumulatedAmounts[item.id] = item.amount;
      }
    });
    const result = Object.keys(accumulatedAmounts).map((id) => ({
      id,
      name: data.find((item: any) => item.id === id)?.name || "",
      amount: accumulatedAmounts[id],
    }));
    if (value === "fromWhom") {
      setFromWhomList(result);
    } else {
      setToWhomList(result);
    }
  };

  const getIndividualTransaction = () => {
    const filteredData =
      getGroupTransaction?.filter(
        (item: any) =>
          item &&
          selectedGroup?.gid &&
          Object.keys(item).length > 0 &&
          item[selectedGroup?.gid]
      ) ?? [];
    const data = filteredData.map((item: any) => {
      return item[selectedGroup?.gid];
    });
    if (data.length > 0) {
      setIndividualTransactionList({
        fromWhom: data[0],
        toWhom: data[0],
      });
    } else {
      console.error("No data available for selected group");
    }
  };
  const getGroupDetails = async () => {
    await axios
      .get(
        `http://localhost:8080${apiContract.getGroupDetails}/${selectedGroup?.gid}`,
        axiosConfig
      )
      .then((res) => {
        setGroupData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getTransactionDetails = async () => {
    await axios
      .get(
        `http://localhost:8080${apiContract.getTransactionDetails}/${selectedGroup?.gid}`,
        axiosConfig
      )
      .then((res) => {
        setTransactionList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleNewFriendClick = () => {
    setFriendInputVisible(!friendInputVisible);
    handleInputChange("");
  };
  const handleInputChange = async (q: string) => {
    setSearchedResponse(null);
    setAddFriendQuery(q);
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
          console.log(err);
        });
    }
  };
  const handleAddFriend = async () => {
    const isFriendThere = groupData.members.find(
      (item: any) => item.uid === searchedResponse?.uid
    );
    if (isFriendThere) {
      message.error("User already exist");
      return;
    }
    const payload = {
      gid: groupData?.gid,
      addMember: searchedResponse?.uid,
      editType: GROUP_UPDATE_TYPE.ADD_FRIEND,
    };
    await axios
      .post(
        `http://localhost:8080${apiContract.editGroupdetails}`,
        payload,
        axiosConfig
      )
      .then(() => {
        handleInputChange("");
        getGroupDetails();
        message.success("User added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRemoveFriend = async (removeMemberId: string) => {
    const payload = {
      gid: groupData?.gid,
      removeMember: removeMemberId,
      editType: GROUP_UPDATE_TYPE.REMOVE_FRIEND,
    };
    await axios
      .post(
        `http://localhost:8080${apiContract.editGroupdetails}`,
        payload,
        axiosConfig
      )
      .then(() => {
        getGroupDetails();
        message.success("User removed successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleTransactionCancel = () => {
    setSwitchValue(true);
    setIsAddTransactionModal(false);
    setSuffixAmount(0);
    formRef.resetFields();
  };
  const onCalendarChange = (date: any) => {
    setTransactionDate(moment(date)?.valueOf());
  };
  const disabledDate = (current: any) => {
    return current && current > moment().endOf("day");
  };
  const handleSwitchChange = () => {
    formRef.resetFields(["participants"]);
    setSwitchValue(!switchValue);
  };
  const handleAmountChange = (value: number) => {
    setTotalAmount(value);
  };
  const exportCSV = () => {
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const csv = Papa.unparse(transactionList);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${creatorId}_${unixTimestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const onSubmit = async (values: AddTransaction) => {
    values.date = transactionDate;
    values.isEquallyDivided = switchValue;
    await axios
      .post(
        `http://localhost:8080${apiContract.addNewTransaction}`,
        {
          ...values,
          gid: groupData?.gid,
        },
        axiosConfig
      )
      .then((res) => {
        getTransactionDetails();
        getTransactionAmounts();
        setIsAddTransactionModal(false);
        message.success(res.data.message);
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  const checkAmount = () => {
    const pAmount = formRef.getFieldValue("participants");
    let sAmount = 0;
    pAmount.forEach((item: any) => {
      sAmount += item.memberAmount;
    });
    setSuffixAmount(totalAmount - sAmount);
  };
  const getDate = (date: number) => {
    const outputDate = new Date(date).toUTCString();
    return outputDate.slice(5, 16);
  };
  const handleSorting = (value: string, order: boolean) => {
    if (!transactionList) return;
    if (order) {
      let sortedData = [...transactionList];
      if (value === "date") {
        sortedData.sort((a, b) => a.date - b.date);
      } else if (value === "amount") {
        sortedData.sort((a, b) => a.amount - b.amount);
      } else {
        sortedData.sort((a, b) => a - b);
      }
      setTransactionList(sortedData);
    } else {
      let sortedData = [...transactionList];
      if (value === "date") {
        sortedData.sort((a, b) => b.date - a.date);
      } else if (value === "amount") {
        sortedData.sort((a, b) => b.amount - a.amount);
      } else {
        sortedData.sort((a, b) => b - a);
      }
      setTransactionList(sortedData);
    }
  };
  const handleRadioClick = (e: any) => {
    setSortKeyValue(e.target.value);
    handleSorting(e.target.value, isAccending);
  };
  const handleAceDecClick = () => {
    setIsAccending(!isAccending);
    handleSorting(sortKeyValue, !isAccending);
  };
  const suffix = (
    <>
      <RemaningAmount suffixAmount={suffixAmount}>
        {suffixAmount}
      </RemaningAmount>
    </>
  );
  const handleSettleAmount = async (record: any) => {
    const payload = {
      gid: groupData?.gid,
      paidBy: record.paidBy,
      paidTo: record.paidTo,
      txnNo: record.txnNo,
      editType: GROUP_UPDATE_TYPE.SETTLE_PAYMENT,
    };
    await axios
      .post(
        `http://localhost:8080${apiContract.editGroupdetails}`,
        payload,
        axiosConfig
      )
      .then((res) => {
        getTransactionDetails();
        getTransactionAmounts();
        message.success(res.data.message);
      });
  };
  const columns = [
    {
      title: "S.No",
      key: "serialNumber",
      width: 65,
      align: "center",
      render: (_: any, record: any, index: number) => index + 1, // Render function to display serial numbers
    },
    {
      title: "Paid By",
      dataIndex: "paidByName",
      key: "paidByName",
      width: 250,
      align: "center",
      render: (_: any, record: any) => (
        <p>{record.paidBy === creatorId ? "You" : record.paidByName}</p>
      ),
    },
    {
      title: "Paid For",
      dataIndex: "paidToName",
      key: "paidToName",
      width: 250,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 200,
      align: "center",
      render: (date: number) => <p>{getDate(date)}</p>,
    },
    {
      title: "Transaction Name",
      dataIndex: "txnName",
      key: "txnName",
      width: 250,
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      align: "center",
    },
    {
      title: "Action",
      width: 150,
      align: "center",
      render: (_: any, record: any) => (
        <SettleAmount
          settled={record?.settled}
          disabled={record?.settled ? true : false}
          onClick={() => handleSettleAmount(record)}
        >
          {record?.settled ? "Settled" : "Settle Amount"}
        </SettleAmount>
      ),
    },
  ];
  return (
    <Modal
      width={"85vw"}
      open={editGroupModal}
      footer={null}
      closeIcon={false}
      onCancel={() => setEditGroupModal(false)}
      style={{ top: 40 }}
    >
      <Container>
        <GroupDescription>
          <GroupLogo
            width={101}
            height={101}
            src={groupData?.groupImage}
            preview={false}
          />
          <GroupNameAndTag>
            <p>{groupData?.groupName}</p>
            <p>{groupData?.gid}</p>
          </GroupNameAndTag>
          <div>
            <Tooltip placement="top" title={"Edit Group Details"}>
              <EditGroupButton
                onClick={() => setDeleteGroupDropdown(!deleteGroupDropdown)}
              >
                <EditOutlined />
              </EditGroupButton>
            </Tooltip>
            <Tooltip
              placement="top"
              title={
                creatorId === groupData?.host
                  ? "Please settle all amount before deleting"
                  : "Only admins can delete the group"
              }
            >
              <DeleteGroupButton
                isDisabled={creatorId === groupData?.host ? false : true}
                disabled={creatorId === groupData?.host ? false : true}
                onClick={() => setDeleteGroupDropdown(!deleteGroupDropdown)}
              >
                <DeleteOutlined />
              </DeleteGroupButton>
            </Tooltip>
          </div>
        </GroupDescription>
        <TopFriendNotch>
          <div>
            <AddMoreFriendButton onClick={handleNewFriendClick}>
              Add more Friend
            </AddMoreFriendButton>
            {friendInputVisible && (
              <AddNewFriendOption>
                <InputBar
                  placeholder="Search user by mail"
                  value={addFriendQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                {searchedResponse && (
                  <ResponseOutput>
                    <UserOutlined />
                    <p>{searchedResponse?.name}</p>
                    <IconDiv
                      placement="bottom"
                      title="Add friend"
                      isCheck={true}
                    >
                      <CheckOutlined onClick={handleAddFriend} />
                    </IconDiv>
                    <IconDiv
                      placement="bottom"
                      title="Reject friend"
                      isCheck={false}
                    >
                      <CloseOutlined onClick={() => handleInputChange("")} />
                    </IconDiv>
                    <ArrowIcon>
                      <ArrowDownOutlined />
                    </ArrowIcon>
                  </ResponseOutput>
                )}
              </AddNewFriendOption>
            )}
          </div>
          {fromWhomList?.length > 0 && (
            <OweContainer>
              <label>Amount you get</label>
              {fromWhomList?.map((item: any, index: number) => (
                <OweWantName>
                  {index + 1}
                  <span>{item?.name}</span>
                  <span>{item?.amount}</span>
                </OweWantName>
              ))}
            </OweContainer>
          )}
          {toWhomList?.length > 0 && (
            <WantContainer>
              <label>Amount you owe</label>
              {toWhomList?.map((item: any, index: number) => (
                <OweWantName>
                  {index + 1}
                  <span>{item?.name}</span>
                  <span>{item?.amount}</span>
                </OweWantName>
              ))}
            </WantContainer>
          )}
          <Friendlist>
            <label>Added Friends</label>
            {groupData?.members &&
              groupData.members.map((friend: any, index: number) => (
                <FriendName key={friend.name}>
                  {index + 1}
                  <span>{friend.name}</span>
                  {friend.uid === groupData?.host ? (
                    <AdminTag>Admin</AdminTag>
                  ) : (
                    <DeleteIcon>
                      <DeleteOutlined
                        onClick={() => handleRemoveFriend(friend?.uid)}
                      />
                    </DeleteIcon>
                  )}
                </FriendName>
              ))}
          </Friendlist>
        </TopFriendNotch>
        <TableContainer>
          <TableTopNotch>
            {transactionList && transactionList.length > 0 ? (
              <h2>All Transactions</h2>
            ) : (
              <h2>No Transaction Added</h2>
            )}
            <SortingDiv>
              <Radio.Group onChange={handleRadioClick} value={sortKeyValue}>
                <Radio.Button value="">No Sort</Radio.Button>
                <Radio.Button value="date">Sort By Date</Radio.Button>
                <Radio.Button value="amount">Sort By Amount</Radio.Button>
              </Radio.Group>
              <SortingIcon>
                {isAccending ? (
                  <SortAscendingOutlined onClick={handleAceDecClick} />
                ) : (
                  <SortDescendingOutlined onClick={handleAceDecClick} />
                )}
              </SortingIcon>
            </SortingDiv>
            <ButtonContainer>
              <ExportCSVButton
                disabled={transactionList?.length > 0 ? false : true}
                onClick={exportCSV}
              >
                Export CSV
              </ExportCSVButton>
              <AddTransactionButton
                onClick={() => setIsAddTransactionModal(!isAddTransactionModal)}
              >
                {transactionList && transactionList.length > 0
                  ? "Add new Transactions"
                  : "Add your first transaction"}
              </AddTransactionButton>
            </ButtonContainer>
          </TableTopNotch>
          {transactionList && transactionList.length > 0 ? (
            <Table
              dataSource={transactionList}
              columns={columns}
              scroll={{ x: "100%", y: 300 }}
              bordered
              pagination={false}
            />
          ) : (
            <NoTransactionContainer>
              <Image
                width={400}
                src={AssetUrls.NO_TRANSITIONS_IMAGE}
                preview={false}
              />
            </NoTransactionContainer>
          )}
        </TableContainer>
        {isAddTransactionModal && (
          <Modal
            width={600}
            title="Add New Transaction"
            open={isAddTransactionModal}
            footer={null}
            closeIcon={false}
            style={{ top: "50%", left: 30, transform: "translate(0%, -50%)" }}
          >
            <TransactionForm form={formRef} onFinish={onSubmit}>
              <Form.Item
                name="transactionName"
                rules={[
                  {
                    required: true,
                    message: "Title Required of Transaction",
                  },
                ]}
                label="Transaction Name"
              >
                <InputBox placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Amount Required of Transaction",
                  },
                ]}
                label="Amount"
              >
                <AmountInput
                  placeholder="Enter amount"
                  addonBefore={`₹`}
                  controls={false}
                  type="number"
                  onChange={(value: any) => handleAmountChange(value)}
                  {...(suffixAmount !== 0 && !switchValue ? { suffix } : {})}
                />
              </Form.Item>
              <Form.Item
                name="paidBy"
                rules={[
                  {
                    required: true,
                    message: "Filed Required",
                  },
                ]}
                label="Paid By:"
              >
                <Select
                  showSearch
                  allowClear
                  size="large"
                  placeholder="Who paid for this"
                  dropdownStyle={{ borderRadius: "8px" }}
                  onClear={() => setPaidBy("")}
                  onSelect={(value: any) => {
                    formRef.setFieldsValue({ participants: [] });
                    setPaidBy(value);
                  }}
                >
                  {groupData?.members.map((member: any) => (
                    <Select.Option key={member.uid} value={member.uid}>
                      {member.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <SwitchItem
                rules={[
                  {
                    required: true,
                    message: "Amount Required of Transaction",
                  },
                ]}
                label="Split Amout By:"
              >
                <Switch defaultChecked onChange={handleSwitchChange} />
                {switchValue ? <p>Split Equally</p> : <p>Custom Split</p>}
              </SwitchItem>
              {switchValue ? (
                <Form.Item
                  name="participants"
                  rules={[
                    {
                      required: true,
                      message: "Select atleast one participant",
                    },
                  ]}
                  label="Participants"
                >
                  <Select
                    showSearch
                    allowClear
                    mode="tags"
                    size="large"
                    placeholder="Add members"
                    dropdownStyle={{ borderRadius: "8px" }}
                  >
                    {paidBy &&
                      groupData?.members.map((member: any) => {
                        if (member.uid !== paidBy) {
                          return (
                            <Select.Option key={member.uid} value={member.uid}>
                              {member.name}
                            </Select.Option>
                          );
                        }
                      })}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  name="participants"
                  rules={[
                    {
                      required: false,
                      message: "Select atleast one participant",
                    },
                  ]}
                  label="Participants"
                >
                  <Form.List name="participants">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <FormSpace key={key}>
                            <Form.Item
                              {...restField}
                              name={[name, "name"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please select member",
                                },
                              ]}
                            >
                              <ParticipantSelect
                                showSearch
                                allowClear
                                size="middle"
                                placeholder="Add members"
                                dropdownStyle={{ borderRadius: "8px" }}
                              >
                                {groupData?.members.map((member: any) => (
                                  <Select.Option
                                    key={member.uid}
                                    value={member.uid}
                                  >
                                    {member.name}
                                  </Select.Option>
                                ))}
                              </ParticipantSelect>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, "memberAmount"]}
                              rules={[
                                { required: true, message: "Enter amount" },
                              ]}
                            >
                              <ParticipantAmount
                                placeholder="Enter amount"
                                addonBefore={`₹`}
                                controls={false}
                                type="number"
                                onChange={checkAmount}
                              />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </FormSpace>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                            className="add-user-button"
                          >
                            Add Users
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              )}
              <Form.Item
                name="description"
                rules={[
                  {
                    required: false,
                  },
                ]}
                label="Description"
              >
                <InputBox placeholder="Enter description (optional)" />
              </Form.Item>
              <Form.Item
                name="date"
                rules={[
                  {
                    required: true,
                    message: "Date Required of Transaction",
                  },
                ]}
                label="Date"
              >
                <DateInput
                  onChange={onCalendarChange}
                  placeholder="Date of transaction"
                  disabledDate={disabledDate}
                />
              </Form.Item>
              <Form.Item>
                <ButtonContainer>
                  <CancelButton onClick={handleTransactionCancel}>
                    Cancel
                  </CancelButton>
                  <AddTransactionBtn type="submit">Add Transaction</AddTransactionBtn>
                </ButtonContainer>
              </Form.Item>
            </TransactionForm>
          </Modal>
        )}
      </Container>
    </Modal>
  );
};
export default GroupEditModal;
