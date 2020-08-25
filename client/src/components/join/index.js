import React from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

const Join = ({ setName }) => {
  let history = useHistory();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      const { name } = values;
      setName(name);
      if (name) {
        const idUser = uuidv4();
        history.push("/chat", { name, idUser });
      }
    },
  });

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Talk with strangers</h1>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <input
              placeholder="Name"
              className="joinInput"
              name="name"
              type="text"
              onChange={formik.handleChange}
            />
          </div>
          <button className={"button mt-20"} type="submit">
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;
