import {FC} from "react";

const FormLabel: FC<{title: string, subtitle: string}> = (props) => {
  return (
    <div className="flex flex-col text-left">
      <label htmlFor="model_version" className="block text-sm font-medium text-white">{props.title}</label>
      <label className="text-xs text-gray-100">{props.subtitle}</label>
    </div>
  );
};

export default FormLabel;


