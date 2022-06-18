import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import * as yup from "yup";
import "./login.scss";

import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { MdAlarm } from "react-icons/md";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailLabelCss, setEmailLabelCss] = useState("");
  const [passLabelCss, setPassLabelCss] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const emailSchema = yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .max(50)
      .required("Email is required"),
  });
  const passSchema = yup.object({
    password: yup.string().max(50).required("Password is required"),
  });

  const email = useRef();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const detect = document.querySelectorAll(
          ":-internal-autofill-selected"
        );
        if (detect.length === 2) {
          setEmailLabelCss("rInputLabelActive");
          setPassLabelCss("rInputLabelActive");
        } else if (detect[0]?.type === "email") {
          setEmailLabelCss("rInputLabelActive");
        } else {
          setPassLabelCss("rInputLabelActive");
        }
      } catch (error) {
        console.log("error:", error);
      }

      clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleBlur = (e) => {
    if (e.target.type === "email") {
      if (e.target.value) setEmailLabelCss("rInputLabelActive");
      else setEmailLabelCss("");
      validateCheck(e.target.value, null);
    } else {
      if (e.target.value) setPassLabelCss("rInputLabelActive");
      else setPassLabelCss("");
      validateCheck(null, e.target.value);
    }
  };

  const handleVisible = (e) => {
    e.preventDefault();
    setPasswordVisible((prev) => !prev);
  };

  const validateCheck = async (email, password) => {
    const resultArr = [];
    if (email !== null) {
      const emailResult = await emailSchema
        .validate({
          email,
        })
        .then(function (value) {
          setEmailErr("");
          return true;
        })
        .catch(function (err) {
          setEmailErr(err.errors);
          return false;
        });
      resultArr.push(emailResult);
    }

    if (password !== null) {
      const passResult = await passSchema
        .validate({
          password,
        })
        .then(function (value) {
          setPassErr("");
          return true;
        })
        .catch(function (err) {
          setPassErr(err.errors);
          return false;
        });
      resultArr.push(passResult);
    }

    return resultArr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const result = await validateCheck(email, password);
    if (!result.some((el) => el === false)) {
      dispatch({ type: "LOGIN_START" });
      try {
        const res = await axios.post("/auth/login", credentials);
        console.log("login:", res);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        navigate("/");
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      }
    }
  };

  return (
    <div className='Login'>
      <div className='lContainer'>
        <div className='lLogo'>
          <a href='/register'>
            TimeTracker
            <MdAlarm />
          </a>
        </div>
        <div className='lTitleContainer'>
          <h3 className='lTitle'>Hi, Welcome Back</h3>
          <span className='lTitleMessage'>
            Enter your credentials to continue
          </span>
        </div>
        <div className='lOption'>
          {/* <button className='rOptionGoogle'>
            <FcGoogle />
            Sign In With Google
          </button>
          <div className='lOptionOr'>
            <hr className='lOptionOrHr' />
            <button className='lOptionOrBtn'>OR</button>
            <hr className='lOptionOrHr' />
          </div>
          <div className='lOptionEmail'>
            <h6 className='lOtionEmailMessage'>Sign up with Email address</h6>
          </div> */}
        </div>

        <form noValidate className='lForm' id='lForm' onSubmit={handleSubmit}>
          <div className={`lInputSetContainer`}>
            <div className={`lInputLabelContainer`}>
              <input
                type='email'
                id='email'
                ref={email}
                className={`lInput ${emailErr ? "inputErr" : ""}`}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <label
                htmlFor='email'
                className={`lInputLabel ${emailLabelCss} ${
                  emailErr ? "labelErr" : ""
                }`}
              >
                Email Address
              </label>
            </div>
            {emailErr && <div className='lInputErr'>{emailErr}</div>}
          </div>
          <div className={`lInputSetContainer`}>
            <div className={`lInputLabelContainer`}>
              <input
                type={passwordVisible ? "text" : "password"}
                id='password'
                className={`lInput ${passErr ? "inputErr" : ""}`}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <label
                htmlFor='password'
                className={`lInputLabel ${passLabelCss} ${
                  passErr ? "labelErr" : ""
                }`}
              >
                Password
              </label>
            </div>
            <button className='lInputBtn' onClick={handleVisible}>
              {passwordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
            {passErr && <div className='lInputErr'>{passErr}</div>}
          </div>
          <button className='lButton' disabled={loading} type='submit'>
            Login
          </button>
          {error && <span className='lSubmitErr'>{error.message}</span>}
        </form>

        <hr className='lHr' />

        <a className='lChangeMode' href='/register'>
          Don't have an account?
        </a>
      </div>
    </div>
  );
};

export default Login;
