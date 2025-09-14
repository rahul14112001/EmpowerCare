import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout";
import "../styles/LayoutStyles.css";
import axios from "axios";
import { message, Table } from "antd";

const Rating = () => {
  const [doctors, setDoctors] = useState([]);
  //getUsers
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle account
  //   const handleAccountStatus = async (record, status) => {
  //     try {
  //       const res = await axios.post(
  //         "/api/v1/admin/changeAccountStatus",
  //         { doctorId: record._id, userId: record.userId, status: status },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       if (res.data.success) {
  //         message.success(res.data.message);
  //         window.location.reload();
  //       }
  //     } catch (error) {
  //       message.error("Something Went Wrong");
  //     }
  //   };

  const handleRating = async (record, score) => {
    try {
      const res = await axios.post(
        "/api/v1/user/rate",
        { doctorId: record._id, userId: record.userId, score: score, reviews: record.reviews },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "phone",
      dataIndex: "phone",
    },
    {
      title: "Rating",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <p style={{ cursor: "pointer" }} onClick={() => handleRating(record, (record.score + 1))}>☆</p>
          <p style={{ cursor: "pointer" }} onClick={() => handleRating(record, (record.score + 2))}>☆</p>
          <p style={{ cursor: "pointer" }} onClick={() => handleRating(record, (record.score + 3))}>☆</p>
          <p style={{ cursor: "pointer" }} onClick={() => handleRating(record, (record.score + 4))}>☆</p>
          <p style={{ cursor: "pointer" }} onClick={() => handleRating(record, (record.score + 5))}>☆</p>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">All Doctors </h1>
      <Table columns={columns} dataSource={doctors} />
      
    </Layout>
  );
};

export default Rating;
