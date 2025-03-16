//Find My Vaahan//

//Using React and TailwindCSS, Firebase Integration and Jupyter Notebook for Image Processing//

//Import Statements
import { useState, useEffect } from "react";
import "firebase/database";
import { onValue, ref, set } from "firebase/database";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "./firebase.config";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpInput from "otp-input-react";
import { toast, Toaster } from "react-hot-toast";
//End of Import Statements

//Main App
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
  const [complaint, setComplaint] = useState(false);

  //handleInputChange will occur whenever there is a change in the html field input
  const handleInputChange = (event) => {
    setVehicleNumber(event.target.value);
  };

  //useEffect to do firebase functions
  useEffect(() => {
    if (submitted) {
      onValue(ref(db, `/governUsers`), (snapshot) => {
        const governUsers = snapshot.val();
        //All the governUsers data from database will be stored
        if (governUsers !== null) {
          for (let key in governUsers) {
            const VehicleArr = governUsers[key].Vehicle;
            //Vehicle Array from governUSers will be stored
            if (ph === governUsers[key].Mobile) {
              //If user input Phone and governUsers Phone Matches:
              setUserName(governUsers[key].Name);
              VehicleArr.forEach((element) => {
                if (element === vehicleNumber) {
                  //If user input Vehicle and governUsers Vehicle Matches:
                  onValue(ref(db, `/opencv`), (snapshot) => {
                    const users = snapshot.val();
                    const userList = [];
                    if (users !== null) {
                      users.forEach((element) => {
                        if (element.vehicleNumber === vehicleNumber) {
                          const user = {
                            //Assigning the values:
                            vehicleNumber: element.vehicleNumber,
                            cctv: element.cctv,
                            date: element.date,
                          };
                          userList.push(user);
                        }
                      });
                      setUserList(userList);
                      return;
                    }
                  });
                }
              });
            }
          }
        }
      });
    }
    //Action for Send Complaint
    if (complaint) {
      if (userList !== null) {
        <h1>Hello</h1>;
        set(ref(db, `policedatabase/${userList[0].vehicleNumber}`), {
          userList,
        });
      }
    }
  });

  //onCLick function for Submit button
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };
  //onClick function for Complaint Button
  const handleComplaint = (event) => {
    event.preventDefault();
    setComplaint(true);
  };

  //Captcha Verification for Phone Auth
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
  //onClick function for Send OTP
  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;
    //Phone Auth using Mobile Number:
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
  //onClick function for Verify OTP
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

  //Return Statements:
  return (
    <section className=" flex justify-center h-screen text-white ">
      {/*Side Content (Rendered in all the pages)*/}
      <div className="w-3/5 bg-#D9D9D9 text-black">
        
        <h1 className="font-sacremento font-semibold text-4xl mt-5 ml-5">
          VTVision
        </h1>
        <div className="w-96 ml-24">
          <h2 className="font-alegreya-sans mt-32 text-6xl font-bold">
            Find your{" "}
            <span
              className="text-blue-500
            "
            >
              Vehicle
            </span>{" "}
            as <br /> soon as possible
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
      {/*End of Side Content*/}

      {/*Main Content */}
      <div className="w-2/5 bg-black flex justify-center">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>

        {/*(Conditional Rendering) If User Exist*/}
        {user ? (
          <div className="text-white">
            <h1 className="text-3xl font-inter mb-2 font-bold mt-32">
              Search your vehicle
            </h1>
            <p className="font-inter font-extralight text-gray-600 mb-10 text-sm">
              Get to know your vehicle's last position
            </p>
            <h6 className="mb-2">Vehicle Number</h6>

            {/**Form for submitting vehicle number detail */}
            <form onSubmit={handleSubmit}>
              <div class="flex">
                <input
                  class="bg-black focus:bg-transparent focus:border-blue-500 hover:border-blue-500 appearance-none border border-white rounded-full w-full py-2 px-4 text-gray-300 leading-tight focus:outline-none"
                  type="text"
                  value={vehicleNumber}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className=" ml-4 flex items-center justify-center border px-4 rounded-full hover:border-blue-500 hover:text-blue-500 text-gray-300 "
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span className="mr-1">Search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleComplaint}
                type="submit"
                className=" my-6 ml-10 flex  border px-16 py-2 rounded-full hover:border-red-500 hover:text-red-500 text-gray-300"
              >
                {loading && <CgSpinner size={20} className="animate-spin" />}
                <span className="mr-1">Send Complaint</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </button>
            </form>
            {/**End of Form */}

            {/**Displaying User Details (verified from governUsers database) */}
            <h2 className="text-center font-thin text-sm font-inter text-gray-300 mt-2">
              <span className="text-blue-500">Name: </span>
              {userName}

              <span className="text-blue-500"> Mobile No: </span>
              {`+91 ` + ph.slice(2)}
            </h2>
            {/**End of User Details */}

            {/**If Form Submitted */}
            {submitted && (
              //Fetch Table Data from the Firebase and Render if the Vehicle Numbe Matches
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
              //End Of Table
            )}
          </div>
        ) : (
          //End of User Condition
          //If User Does Not Exist
          <div className="w-96 flex flex-col gap-2 rounded-lg p-4">
            {/**If number verified, Show OTP for New Users */}
            {showOTP ? (
              <>
                <div className="bg-white text-blue-500 w-fit mx-auto p-4 rounded-full mt-32">
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
                  hover:bg-blue-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded-2xl mt-4"
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              //End of Show OTP
              //If number hasnt verfied
              <>
                <h1 className=" w-96 text-white font-medium text-3xl font-inter mt-32 ">
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
                  hover:bg-blue-700 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded-2xl mt-4"
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span>Send OTP</span>
                </button>
              </>
              //End of Number Verification
            )}
          </div>
          //End of User doesnt exist Condition
        )}
      </div>
      {/**End of Main Content */}
    </section>
    //End
  );
};

//Exporting App.js to index.js
export default App;
