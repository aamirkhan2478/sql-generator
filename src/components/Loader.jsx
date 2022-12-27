import React from "react";
import ReactLoading from "react-loading";
const Loader = () => {
  return (
    <ReactLoading
      type={"bars"}
      color={"#000000"}
      height={"10%"}
      width={"10%"}
    />
  );
};

export default Loader;
