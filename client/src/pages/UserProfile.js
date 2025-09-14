import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import "../styles/LayoutStyles.css";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";


// eslint-disable-next-line no-unused-vars
const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // update doc ==========
  //handle form
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/updateProfile",
        {
          ...values,
          _id: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrrong ");
    }
  };
  // update doc ==========

  //getDOc Details
  // const getUserInfo = async () => {
  //   try {
  //     const res = await axios.post(
  //       "/api/v1/user/getUserInfo",
  //       { _id: params.id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (res.data.success) {
  //       setDoctor(res.data.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getUserInfo();
  //   //eslint-disable-next-line
  // }, []);
  return (
    <Layout>
      <br></br>
      <h1>Manage Profile</h1>
      {(
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...user
          }}
        >
          <h4 className="">Personal Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Username"
                name="name"
              >
                <Input type="text" placeholder="your username" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No"
                name="phone"
              >
                <Input type="text" placeholder="your contact no" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
              >
                <Input type="email" placeholder="your email address" />
              </Form.Item>
            </Col>
          </Row>


            <Col xs={24} md={24} lg={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Update
              </button>
            </Col>
            <br></br><br></br><br></br><br></br><br></br> <br></br><br></br><br></br>
<br></br><br></br><br></br><br></br><br></br><br></br>
      <br></br>
      <br></br>
  
        </Form>

      )}
    </Layout>
  );
};

export default UserProfile;
