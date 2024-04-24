"use client";
import { useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { Button, Form, Input, message } from "antd";
import { AssetUrls } from "../../common/AssetUrls";
import { SignupProps } from "../../common/Interface/Signup";
import { apiContract } from "../../common/apiContract";
import { loginProps } from "../../common/Interface/login";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import colors from "@/common/colors";

interface Props {
  handleLogin: (token: string, creatorId: string) => void;
}
const Con = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${AssetUrls.CONTAINER_BACKGROUND_IMAGE});
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
`;
const Container = styled.div`
  position: absolute;
  background-color: ${colors.white};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colors.black};
  border-radius: 10px;
  box-shadow: 0 0 20px 0 #000;
  z-index: 1;
`;
const SignUpBox = styled.div`
  width: 100%;
  width: 450px;
  height: auto;
  box-shadow: ${colors.black};
  border-radius: 1rem;
  padding: 1rem 2rem;
`;
const Heading = styled.h2`
  font-weight: 500;
  font-size: 1.2rem;
  text-align: center;
`;
const OrStatement = styled.p`
  text-align: center;
  font-size: 0.8rem;
  margin: 10px 0;
  cursor: pointer;
`;
const HitButton = styled(Button)`
  position: relative;
  left: 50%;
  border-radius: 6px;
  transform: translateX(-50%);
`;
const Signup = (props: Props) => {
  const { handleLogin } = props;
  const [formRef] = Form.useForm();
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [isPassVisible, setIsPassVisible] = useState<boolean>(false);

  const handleUserSignUp = async (values: SignupProps) => {
    if (values.password !== values.conPass) {
      message.error("Password doesn't match");
      return;
    }
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };
    axios
      .post(`http://localhost:8080${apiContract.signup}`, payload)
      .then((res) => {
        setEmail(values.email);
        formRef.resetFields();
        setLogin(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUserlogin = (values: loginProps) => {
    const payload = {
      email: values.email,
      password: values.password,
    };
    axios
      .post(`http://localhost:8080${apiContract.login}`, payload)
      .then((res: any) => {
        message.success(res.data.message);
        handleLogin(res.data.data?.token, res.data.data?.creatorId);
      })
      .catch((err: any) => {
        message.error(err.message);
      });
  };
  const handleLoginSignupSwitch = () => {
    formRef.resetFields();
    setIsPassVisible(false);
    setLogin(!login);
  };

  return (
    <Con>
      <Container>
        {login ? (
          <>
            <SignUpBox>
              <Heading>Login</Heading>
              <Form
                style={{
                  position: "relative",
                }}
                layout="vertical"
                onFinish={handleUserlogin}
                form={formRef}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input
                    value={email}
                    type="email"
                    placeholder="johndoe@gmail.com"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input
                    type={isPassVisible ? "text" : "password"}
                    placeholder="Example123"
                    suffix={
                      isPassVisible ? (
                        <EyeOutlined
                          onClick={() => setIsPassVisible(!isPassVisible)}
                        />
                      ) : (
                        <EyeInvisibleOutlined
                          onClick={() => setIsPassVisible(!isPassVisible)}
                        />
                      )
                    }
                  />
                </Form.Item>
                <HitButton htmlType="submit" type="primary">
                  Log in With Email and Password
                </HitButton>
                <OrStatement onClick={handleLoginSignupSwitch}>
                  Or Don't Have An Account? Click Here
                </OrStatement>
              </Form>
            </SignUpBox>
          </>
        ) : (
          <SignUpBox>
            <Heading>Sign Up</Heading>
            <Form layout="vertical" form={formRef} onFinish={handleUserSignUp}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your first name!",
                  },
                ]}
              >
                <Input placeholder="John" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your last name!",
                  },
                ]}
              >
                <Input placeholder="Doe" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input type="email" placeholder="johndoe@gmail.com" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input
                  type={isPassVisible ? "text" : "password"}
                  placeholder="Example123"
                  suffix={
                    isPassVisible ? (
                      <EyeOutlined
                        onClick={() => setIsPassVisible(!isPassVisible)}
                      />
                    ) : (
                      <EyeInvisibleOutlined
                        onClick={() => setIsPassVisible(!isPassVisible)}
                      />
                    )
                  }
                />
              </Form.Item>
              <Form.Item
                name="conPass"
                label="Confirm Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password again!",
                  },
                ]}
              >
                <Input
                  type={isPassVisible ? "text" : "password"}
                  placeholder="Example123"
                  suffix={
                    isPassVisible ? (
                      <EyeOutlined
                        onClick={() => setIsPassVisible(!isPassVisible)}
                      />
                    ) : (
                      <EyeInvisibleOutlined
                        onClick={() => setIsPassVisible(!isPassVisible)}
                      />
                    )
                  }
                />
              </Form.Item>
              <HitButton htmlType="submit" type="primary">
                Sign Up With Email and Password
              </HitButton>
              <OrStatement onClick={handleLoginSignupSwitch}>
                Or Have An Account Already? Click Here
              </OrStatement>
            </Form>
          </SignUpBox>
        )}
      </Container>
    </Con>
  );
};

export default Signup;
