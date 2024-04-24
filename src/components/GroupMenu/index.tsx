import React, { useEffect, useState } from "react";
import { CreateGroup } from "@/common/Interface/CreateGroup";
import { apiContract } from "@/common/apiContract";
import colors from "@/common/colors";
import { PlusOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Form, Input, Modal, Select, Upload, message } from "antd";
import axios from "axios";
import CardView from "./CardView";
import EditModal from "./EditModal";

interface Props {
  creatorId: string;
  userDetails: any;
  fetchUserDetails: any;
  userFriends: any;
  groupList: any;
  getGroupList: any;
  getGroupTransaction: any;
  getTransactionAmounts: any;
  setGroupList: any;
  token: string;
}

const CreateGroupButton = styled.button`
  transition: all 5s;
  padding: 12px 18px;
  background-color: ${colors.orangePeel};
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1.2rem;
  cursor: pointer;
`;
const GroupForm = styled(Form)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 2rem;
`;
const GroupNameInput = styled(Input)`
  padding: 10px 16px;
  border-radius: 2rem;
`;
const ButtonContainer = styled.div`
  display: inline-flex;
  gap: 8px;
  width: 100%;
  margin-top: 1.5rem;
`;
const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: ${colors.white};
  background-color: ${colors.green};
  cursor: pointer;
`;
const ResetButton = styled.div`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: ${colors.white};
  background-color: ${colors.redsolid};
  cursor: pointer;
  text-align: center;
`;
const LeftSide = styled.div`
  width: 200px;
  margin-bottom: 4rem;
`;
const RightSide = styled.div`
  width: 700px;
`;
const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 16px 32px 0 32px;
  gap: 16px;
  padding: 16px 16px 16px 16px;
`;
const GroupImage = styled.img`
  width: 101px;
  height: 101px;
  border-radius: 50%;
`;

const GroupMenu = (props: Props) => {
  const {
    creatorId,
    userDetails,
    fetchUserDetails,
    userFriends,
    groupList,
    getGroupList,
    getGroupTransaction,
    getTransactionAmounts,
    setGroupList,
    token,
  } = props;
  const [formRef] = Form.useForm();
  const [isGroupMenuVisible, setIsGroupMenuVisible] = useState<boolean>(false);
  const [desc, setDesc] = useState<string>("");
  const [favirouteGroups, setFavirouteGroups] = useState();
  const [editGroupModal, setEditGroupModal] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<any>();
  const [uploadImageList, setUploadImageList] = useState<any>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    setFavirouteGroups(userDetails?.favirouteGroups);
  }, [userDetails]);
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      creatorId: creatorId,
    },
  };

  const onSubmit = async (values: CreateGroup) => {
    values.groupImage = imageUrl || "";
    await axios
      .post(
        `http://localhost:8080${apiContract.createNewGroup}/${creatorId}`,
        values,
        axiosConfig
      )
      .then((res) => {
        getGroupList(creatorId);
        message.success(res.data.message);
        handleModalClose();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const handleFaviroute = async (isFaviroute: boolean, gid: string) => {
    const payload = {
      isEdit: true,
      gId: gid,
      isFaviroute: isFaviroute,
    };
    await axios
      .post(
        `http://localhost:8080${apiContract.createNewGroup}/${creatorId}`,
        payload,
        axiosConfig
      )
      .then((res) => {
        message.success(
          `${isFaviroute ? "Added as faviroute" : "Removed from faviroute"}`
        );
        fetchUserDetails(creatorId);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const handleModalClose = () => {
    setUploadImageList([]);
    setImageUrl("");
    formRef.resetFields();
    setIsGroupMenuVisible(false);
  };
  const descriptionSuffix = (
    <span>
      {desc?.length > 0 ? desc.length : "0"}/ {50}
    </span>
  );
  const checkImageFileSize = (file: any) => {
    const isImage = file.type.startsWith("image/");
    const maxImageSize = 5 * 1024 * 1024;
    if (isImage && file.size > maxImageSize) {
      message.error("Image size exceeds the limit (5MB)");
      return false;
    }
    return true;
  };
  const customRequestImgUpload = async ({ file }: any) => {
    if (!checkImageFileSize(file)) return;
    const formData = new FormData();
    formData.append("image", file);
    await axios
      .post(`http://localhost:8080${apiContract.uploadImage}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setImageUrl(res.data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <CreateGroupButton
        onClick={() => setIsGroupMenuVisible(!isGroupMenuVisible)}
      >
        Create a new group
      </CreateGroupButton>
      {isGroupMenuVisible && (
        <>
          <Modal
            title="Create group"
            open={isGroupMenuVisible}
            footer={null}
            closeIcon={null}
          >
            <GroupForm layout="vertical" form={formRef} onFinish={onSubmit}>
              <LeftSide>
                <Form.Item>
                  {imageUrl && imageUrl?.length > 0 ? (
                    <GroupImage src={imageUrl} />
                  ) : (
                    <Upload
                      listType="picture-circle"
                      fileList={uploadImageList}
                      customRequest={customRequestImgUpload}
                      accept="image/jpeg, image/png, image/gif, image/bmp, image/webp"
                      multiple={false}
                      maxCount={1}
                    >
                      <PlusOutlined /> Upload
                    </Upload>
                  )}
                </Form.Item>
              </LeftSide>
              <RightSide>
                <Form.Item
                  name="groupName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter group name",
                    },
                  ]}
                >
                  <GroupNameInput placeholder="Group Name" />
                </Form.Item>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <GroupNameInput
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Group Description (optional)"
                    suffix={descriptionSuffix}
                    maxLength={50}
                  />
                </Form.Item>
                <Form.Item
                  name="members"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least 1 friend",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    size="large"
                    allowClear
                    mode="tags"
                    placeholder="Add friends"
                    dropdownStyle={{ borderRadius: "8px" }}
                  >
                    {userFriends.length > 0 &&
                      userFriends.map((item: any) => (
                        <Select.Option key={item?.uid}>
                          {item?.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <ButtonContainer>
                  <SubmitButton type="submit">Create</SubmitButton>
                  <ResetButton onClick={handleModalClose}>Close</ResetButton>
                </ButtonContainer>
              </RightSide>
            </GroupForm>
          </Modal>
        </>
      )}
      {groupList?.length > 0 && (
        <GridContainer>
          {groupList?.map((item: any) => (
            <CardView
              groupDetail={item}
              favirouteGroups={favirouteGroups}
              handleFaviroute={handleFaviroute}
              setEditGroupModal={setEditGroupModal}
              setSelectedGroup={setSelectedGroup}
              getGroupTransaction={getGroupTransaction}
            />
          ))}
        </GridContainer>
      )}
      {editGroupModal && (
        <EditModal
          selectedGroup={selectedGroup}
          editGroupModal={editGroupModal}
          setEditGroupModal={setEditGroupModal}
          creatorId={creatorId}
          getGroupTransaction={getGroupTransaction}
          getTransactionAmounts={getTransactionAmounts}
          token={token}
        ></EditModal>
      )}
    </>
  );
};

export default GroupMenu;
