import { useField } from "formik";

interface ToggleProps {
  name: string;
}

export default function ToggleRecurring({ name }: ToggleProps) {
  const [field, , helpers] = useField<boolean>(name);

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={field.value}
        onChange={() => helpers.setValue(!field.value)}
        name={name}
      />

      <div
        className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:outline-none
           peer-focus:ring-2 peer-focus:ring-blue-300
           peer-checked:bg-blue-600 peer-checked:after:translate-x-full
           after:content-[''] after:absolute after:top-[2px] after:left-[2px]
           after:bg-white after:border-gray-300 after:border
           after:rounded-full after:h-4 after:w-4 after:transition-all"
      ></div>
    </label>
  );
}
