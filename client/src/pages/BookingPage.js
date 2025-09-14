import React, { useState, useEffect } from "react";
import "../styles/LayoutStyles.css";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import Modal from "react-modal";


const BookingPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closeModal = () => {
    setIsOpen(false);}
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ============ handle availiblity
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        console.log(isAvailable);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const appCou = async() =>{
    const couponInput = document.getElementById("discount_code1");
    const couponCode = couponInput.value;
    console.log(couponCode);
    if (couponCode === "CODE_WARRIORS") {
      // {doctors.feesPerCunsaltation}
      if(doctors.feesPerCunsaltation>=200){
      const discount = 0.1; // 10% discount
      const discountedTotal = doctors.feesPerCunsaltation - (doctors.feesPerCunsaltation * discount);
      message.success("Discounted Total: ₹ " + discountedTotal);
      }else{
        message.info("This coupon is valid above 200 rs only");
      }
    } else {
      message.error("Invalid coupon code");
    }
  };
  // =============== booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
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
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <br></br>
      <h3 style={{ textAlign: 'center' }}>Booking Page</h3>
<div style={{ display: 'flex', justifyContent: 'center' }}>
  {doctors && (
    <div>
      <h4 style={{ textAlign: 'center' ,marginTop:"50px"}}>
        Dr. {doctors.firstName} {doctors.lastName}
      </h4>
      <h4 style={{ textAlign: 'center' }}>Fees: {doctors.feesPerCunsaltation}</h4>
      {/* <h4 style={{ textAlign: 'center' }}>
        Timings: {doctors.timings && doctors.timings[0]} - {doctors.timings && doctors.timings[1]}
      </h4> */}
      <div >
        <DatePicker
          aria-required="true"
          style={{ margin: '0.5rem' }}
          format="DD-MM-YYYY"
          onChange={(value) => {
            setDate(moment(value).format('DD-MM-YYYY'));
          }}
        />
        <TimePicker
          aria-required="true"
          format="HH:mm"
          style={{ marginTop: '1rem' }}
          onChange={(value) => {
            setTime(moment(value).format('HH:mm'));
          }}
        />
          <input style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '95%' }} className="m-2 discount" type="text" id="discount_code1" name="" placeholder="Enter the discount code " ></input>

              <button
                style={{ display: 'flex ', flexDirection: 'column', alignItems: 'center', width: '100%' }} 
                className="btn btn-light mt-2"
                onClick={appCou}
              >
                Apply coupon
              </button>

              <button
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} 
                className="btn btn-light mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>

              <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} 
              className="btn btn2 btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
              <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br> 
     
      
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Popup Image"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999
          },
          content: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            background: 'none',
          }
        }}
      >
        <img src="/discount.png" alt="Popup Image" onClick={closeModal} />
      </Modal>
    </Layout>
  );
};

export default BookingPage;