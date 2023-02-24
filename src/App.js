import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth, db } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
// import "./App.css";
import { uid } from "uid";
import { onValue, ref } from "firebase/database";
//import firebase from "firebase/app";
import "firebase/database";
import Navbar from "../src/components/NavBar";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userList, setUserList] = useState([]);

  const handleInputChange = (event) => {
    setVehicleNumber(event.target.value);
  };

  useEffect(() => {
    if (submitted) {
      // const data = db
      //   .ref(`users2/${vehicleNumber}`)
      //   .orderByChild("vehicleNumber")
      //   .equalTo(vehicleNumber);
      onValue(ref(db, `/opencv`), (snapshot) => {
        const users = snapshot.val();
        const userList = [];
        if (users !== null) {
          //console.log(users.userId1);
          users.forEach((element) => {
            if (element.vehicleNumber === vehicleNumber) {
              const user = {
                vehicleNumber: element.vehicleNumber,
                cctv: element.cctv,
                date: element.date,
              };
              userList.push(user);
            }

            // for (let key in users) {
            //   if (users[key].vehicleNumber === vehicleNumber) {
            //     const user = {
            //       id: key,
            //       vehicleNumber: users[key].vehicleNumber,
            //       cctv: users[key].cctv,
            //     };
            //     userList.push(user);
            //   }
            // }
          });
          setUserList(userList);
        }
      });

      // console.log(data);
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    console.log(vehicleNumber);
  };

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section className="bg-black flex justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <div className="text-white">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={vehicleNumber}
                onChange={handleInputChange}
                placeholder="Enter Your Vehicle No:"
                className="text-black m-4"
              />
              <button type="submit" className=" ml-4 border-2 px-4 rounded-md ">
                Submit
              </button>
            </form>
            <h2 className="text-center font-medium text-2xl">
              Mobile No: {`+91 ` + ph.slice(2)}
            </h2>

            {submitted && (
              <div className="text-white">
                <h1
                  className="text-center font-medium text-2xl
                "
                >
                  Vehicle No: {vehicleNumber}
                </h1>
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle Number</th>
                      <th>CCTV Name</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user) => (
                      <tr key={user.id}>
                        <td>{user.vehicleNumber}</td>
                        <td>{user.cctv}</td>
                        <td>{user.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
              Welcome to <br /> CODE A PROGRAM
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-white text-center"
                >
                  Verify your phone number
                </label>
                <PhoneInput country={"in"} value={ph} onChange={setPh} />
                <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
