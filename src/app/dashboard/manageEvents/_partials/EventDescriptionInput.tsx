export default function EventDescriptionInput({
  value,
  onChange,
  onBlur,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col w-full gap-2">
      <label
        htmlFor="description"
        className="text-gray-700 text-sm text-[#00000099] font-light]"
      >
        Leave a message on the QR code
      </label>

      <input
        type="text"
        id="description"
        className="w-full border-gray-300 bg-[#f5f5f5] px-3 py-2 rounded-sm focus:outline-none focus:border-blue-500 focus:border-[2px] border-[2px] min-h-[44px]"
        placeholder=""
        name={"description"}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
