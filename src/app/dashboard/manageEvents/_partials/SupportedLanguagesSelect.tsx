"use client";

import React from "react";
import { useField } from "formik";
import Select, {
  GroupBase,
  OptionProps,
  StylesConfig,
  components,
  MultiValue,
  ActionMeta,
} from "react-select";

// 1. Define your option type
export type LanguageOption = {
  value: string;
  label: string;
};

// 2. Sample options
export const languageOptions: LanguageOption[] = [
  { value: "AR", label: "Arabic" },
  { value: "BG", label: "Bulgarian" },
  { value: "CS", label: "Czech" },
  { value: "DA", label: "Danish" },
  { value: "DE", label: "German" },
  { value: "EL", label: "Greek" },
  { value: "EN_GB", label: "English (British)" },
  { value: "EN_US", label: "English (American)" },
  { value: "ES", label: "Spanish" },
  { value: "ET", label: "Estonian" },
  { value: "FI", label: "Finnish" },
  { value: "FR", label: "French" },
  { value: "HU", label: "Hungarian" },
  { value: "ID", label: "Indonesian" },
  { value: "IT", label: "Italian" },
  { value: "JA", label: "Japanese" },
  { value: "KO", label: "Korean" },
  { value: "LT", label: "Lithuanian" },
  { value: "LV", label: "Latvian" },
  { value: "NB", label: "Norwegian Bokmål" },
  { value: "NL", label: "Dutch" },
  { value: "PL", label: "Polish" },
  { value: "PT_BR", label: "Portuguese (Brazilian)" },
  { value: "PT_PT", label: "Portuguese (European)" },
  { value: "RO", label: "Romanian" },
  { value: "RU", label: "Russian" },
  { value: "SK", label: "Slovak" },
  { value: "SL", label: "Slovenian" },
  { value: "SV", label: "Swedish" },
  { value: "TR", label: "Turkish" },
  { value: "UK", label: "Ukrainian" },
  { value: "ZH_HANS", label: "Chinese (Simplified)" },
  { value: "ZH_HANT", label: "Chinese (Traditional)" },
];

export const languageMap = languageOptions.reduce<Record<string, string>>(
  (acc, lang) => {
    acc[lang.value] = lang.label;
    return acc;
  },
  {}
);

function CheckboxOption(
  props: OptionProps<LanguageOption, true, GroupBase<LanguageOption>>
) {
  const { children, isSelected } = props;
  return (
    <components.Option {...props}>
      <input type="checkbox" checked={isSelected} readOnly className="mr-2" />
      {children}
    </components.Option>
  );
}

// 3. Custom styles (adjust as needed)
const customStyles: StylesConfig<LanguageOption, true> = {
  control: (base) => ({
    ...base,
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    boxShadow: "none",
    ":hover": {
      borderColor: "#999",
    },
    minHeight: 44,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#999",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#666",
    ":hover": {
      color: "#333",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

interface SupportedLanguagesSelectProps {
  name: string;
  label?: string;
}

export default function SupportedLanguagesSelect({
  name,
  label = "Supported Languages",
}: SupportedLanguagesSelectProps) {
  // This hook connects to the Formik context by the given name.
  const [field, meta, helpers] = useField<LanguageOption[]>(name);

  function handleChange(
    newValue: MultiValue<LanguageOption>,
    actionMeta: ActionMeta<LanguageOption>
  ) {
    console.log(actionMeta);

    helpers.setValue([...newValue]); // Update Formik state
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-gray-700 text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <Select<LanguageOption, true, GroupBase<LanguageOption>>
        instanceId="my-react-select"
        isMulti
        closeMenuOnSelect={false}
        options={languageOptions}
        value={field.value}
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
        name={name}
        placeholder="Select languages..."
        components={{ Option: CheckboxOption }}
        className="supportedLanguages"
        styles={customStyles}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">
          {typeof meta.error === "string"
            ? meta.error
            : JSON.stringify(meta.error)}
        </div>
      ) : null}
    </div>
  );
}
