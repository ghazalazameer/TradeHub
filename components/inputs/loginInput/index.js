import { ImUser } from "react-icons/im";
import { GoKey } from "react-icons/go";
import { SiMinutemailer } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { MdRepeatOn } from "react-icons/md";
import { useField } from "formik";

import styles from "./styles.module.scss";
import { FaRegEye, FaRegEyeSlash, FaUserTie } from "react-icons/fa";
import { useState } from "react";

const LoginInput = ({ icon, ...props }) => {
  const [field, meta] = useField(props); // Formik Hook: useField hook is used to connect the input with Formik's state management
  const [isPassword, setIsPassword] = useState(true); // State to show/hide password

  const showHidePasswordHandler = () => { // Function to show/hide password
    setIsPassword((prev) => !prev); // Toggle the state
  };

  return (
    <>
      {meta.error && meta.touched ? (
        <p className={styles.errorMessage}>
          <RxCrossCircled />
          {meta.error}
        </p>
      ) : (
        <label htmlFor={props.id} className={styles.label}>
          {props.label}
        </label>
      )}
      <div
        className={`${styles.input} ${
          meta.touched && meta.error ? styles.error : ""
        }`}
      >
        {icon === "user" ? (
          <ImUser />
        ) : icon === "email" ? (
          <SiMinutemailer />
        ) : icon === "password" ? (
          <GoKey />
        ) : icon === "repeat" ? (
          <MdRepeatOn />
        ) : icon === "admin" ? (
          <FaUserTie />
        ) : (
          ""
        )}
        <input
          {...field}
          {...props}
          onClick={props.onClick}
          type={
            props.type !== "password"
              ? props.type
              : props.type === "password" && isPassword
              ? "password"
              : "text"
          }
        />
        {icon === "password" || icon === "repeat" ? (
          <div className={styles.showHide} onClick={showHidePasswordHandler}>
            {isPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default LoginInput;