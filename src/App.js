import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth, db } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { onValue, ref } from "firebase/database";
import "firebase/database";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userName, setUserName] = useState("");

  const handleInputChange = (event) => {
    setVehicleNumber(event.target.value);
  };

  useEffect(() => {
    if (submitted) {
      onValue(ref(db, `/governUsers`), (snapshot) => {
        const governUsers = snapshot.val();

        if (governUsers !== null) {
          for (let key in governUsers) {
            const VehicleArr = governUsers[key].Vehicle;
            if (ph === governUsers[key].Mobile) {
              setUserName(governUsers[key].Name);
              VehicleArr.forEach((element) => {
                if (element === vehicleNumber) {
                  onValue(ref(db, `/opencv`), (snapshot) => {
                    const users = snapshot.val();
                    const userList = [];
                    if (users !== null) {
                      users.forEach((element) => {
                        console.log(element.vehicleNumber);
                        console.log(vehicleNumber);
                        if (element.vehicleNumber === vehicleNumber) {
                          const user = {
                            vehicleNumber: element.vehicleNumber,
                            cctv: element.cctv,
                            date: element.date,
                          };
                          userList.push(user);
                        }
                      });
                      setUserList(userList);
                      console.log(userList);
                      return;
                    }
                  });
                }
              });
              // if (userList === null) {
              //   setUserList([
              //     {
              //       vehicleNumber: "Not Found",
              //       date: "not found",
              //       cctv: "not found",
              //     },
              //   ]);
              // }
              console.log(vehicleNumber);
              console.log(VehicleArr);
            }
          }
        }
      });
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
    <section className=" flex justify-center h-screen text-white ">
      <div className="w-3/5 bg-#D9D9D9 text-black">
        <h1 className="font-sacremento font-semibold text-4xl mt-5 ml-5">
          Findmyvaahan
        </h1>
        <div className="w-96 ml-24">
          <h2 className="font-alegreya-sans mt-32 text-6xl font-bold">
            Find Your Vehicle as <br /> Soon as Possible
          </h2>
          <p className="font-alegreya-sans font-extralight mt-6 text-xl text-gray-600">
            Did you know that car theft is a major problem in India? In fact, it
            is estimated that around 100,000 cars are stolen each year in India.
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full mt-6 font-alegreya-sans">
            Learn More
          </button>
        </div>
      </div>
      <div className="w-2/5 bg-black flex justify-center">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <div className="text-white">
            <h1 className="text-3xl font-inter mb-2 font-bold mt-32">
              Search your vehicle
            </h1>
            <p className="font-inter font-extralight text-gray-600 mb-10 text-sm">
              Get to know your vehicle's last position
            </p>

            <h6 className="mb-2">Vehicle Number</h6>

            <form onSubmit={handleSubmit}>
              <div class="flex">
                <input
                  class="bg-black focus:bg-black focus:border-blue-500 hover:border-blue-500 appearance-none border border-white rounded-full w-full py-2 px-4 text-gray-300 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  value={vehicleNumber}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className=" ml-4 border px-4 rounded-full hover:bg-blue-500 text-gray-300 "
                >
                  Submit
                </button>
              </div>
            </form>
            <h2 className="text-center font-thin text-sm font-inter text-gray-300 mt-2">
              <span className="text-blue-500">Name: </span>
              {userName}
              <span className="text-blue-500"> Mobile No: </span>
              {`+91 ` + ph.slice(2)}
              {/* {console.log(ph)} */}
            </h2>

            {submitted && (
              <div className="text-white font-inter">
                <h1 className="text-center font-thin text-sm text-gray-300">
                  <span className="text-blue-500">Vehicle No: </span>{" "}
                  {vehicleNumber}
                </h1>
                <div className="border border-blue-500 rounded-2xl px-16 py-6 mt-10">
                  <table className="">
                    <thead>
                      <tr class="space-x-5">
                        <th class="px-4 py-2">CCTV Name</th>
                        <th class="px-4 py-2">Date and Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((user) => (
                        <tr key={user.id} className="text-gray-300 text-center">
                          <td>{user.cctv}</td>
                          <td>{user.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-96 flex flex-col gap-2 rounded-lg p-4">
            {showOTP ? (
              <>
                <div className="bg-white text-blue-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center mb-6"
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
                  className="opt-container"
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-blue-500
                  hover:bg-blue-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded-2xl"
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <h1 className=" w-96 text-white font-medium text-3xl font-inter mt-16">
                  Enter Your Mobile Number
                </h1>
                <p className="font-inter font-extralight text-gray-600">
                  Get to know your vehicles last seen
                </p>
                <PhoneInput
                  className="bg-black"
                  country={"in"}
                  value={ph}
                  onChange={setPh}
                  dropdownStyle={{ color: "black" }}
                  buttonStyle={{ borderRadius: "15px" }}
                  inputStyle={{ background: "black", borderRadius: "15px" }}
                />
                <button
                  onClick={onSignup}
                  className="bg-blue-500
                  hover:bg-blue-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded-2xl"
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span>Send OTP</span>
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
