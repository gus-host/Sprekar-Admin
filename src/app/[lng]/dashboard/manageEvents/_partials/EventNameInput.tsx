export default function EventNameInput({
  error,
  value,
  onChange,
  onBlur,
}: {
  error?: boolean | string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor="eventName"
        className="text-gray-700 text-sm font-medium mb-3"
      >
        Event Name <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        id="eventName"
        className="w-full border-gray-300 bg-[#E1E1E1] px-3 py-2 rounded-sm focus:outline-none focus:border-blue-500 focus:border-[2px] border-[2px]"
        placeholder="Enter your event name"
        name={"name"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <p className="py-[3] text-red-500 text-[12px]">{error}</p>}
    </div>
  );
}
