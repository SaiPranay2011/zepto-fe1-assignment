import { useEffect, useState } from "react";

const userData = async () => {
  const response = await fetch("https://dummyjson.com/users");
  const data = await response.json();
  return data;
};

export default userData;
