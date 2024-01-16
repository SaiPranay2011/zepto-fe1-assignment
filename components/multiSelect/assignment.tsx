"use client";

import Select, { SelectOption } from "./select";
import { useEffect, useState } from "react";
interface AssignnmentProps {
  data: any;
}

const Assignnment: React.FC<AssignnmentProps> = ({ data }) => {
  const [value, setValue] = useState();
  return (
    <div className="flex justify-center flex-col items-center gap-y-10">
      <label
        className="
        text-3xl 
        leading-6 
        text-blue-500
        font-bold
        mt-4
        "
      >
        Pick Users
      </label>
      <div className="w-3/4">
        <Select
          options={data?.users?.map((user: any) => ({
            id: user.id,
            firstName: user.firstName,
            lastName:user.lastName,
            email: user.email,
            image: user.image,
          }))}
          value={value}
          onChange={(o: any) => setValue(o)}
        />
      </div>
    </div>
  );
};

export default Assignnment;
