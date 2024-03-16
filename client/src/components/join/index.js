/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Select from 'react-select'
import "./index.css";

const avatars = [
  { value: 'https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg', label: 'Boy 1' },
  { value:'https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg', label: 'Girl 1'},
  { value: 'https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg', label: 'Boy 2'},
  { value:'https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg', label: 'Girl 2'},
  
];

const Join = ({ setName }) => {
  let history = useHistory();
  const [avatar, setAvatar] = useState(avatars[0])
  const [ipData, setIpData] = useState(null);

  useEffect(() => {
    fetch("https://ipinfo.io/?token=e376cd6623162d")
      .then((response) => response.json())
      .then((response) => {
        setIpData(response);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      const { name } = values;
      setName(name);
      if (name) {
        const idUser = uuidv4();
        history.push("/chat", { name, idUser, avatar: avatar.value, country: ipData?.country?.toLowerCase() });
      }
    },
  });

  
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Talk with strangers</h1>
        <form onSubmit={formik.handleSubmit}>
          <div style={{ display: 'flex'}}>
            <input
              autoFocus
              autoComplete="off"
              placeholder="Name"
              className="joinInput"
              name="name"
              type="text"
              onChange={formik.handleChange}
            />
            <Select
              className="avatar-select"
              isSearchable={false}
              placeholder={null}
              options={avatars}
              defaultValue={avatar}
              onChange={setAvatar}
              formatOptionLabel={avatar => (
                <div className="avatar-option">
                  <img src={avatar.value} alt="avatar" className="img-option"/>
                </div>
              )}
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
