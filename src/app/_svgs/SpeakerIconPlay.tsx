export default function SpeakerIconPlay() {
  return (
    <svg
      width="61"
      height="61"
      viewBox="0 0 61 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_828_1937)">
        <rect x="4" y="4" width="53" height="53" rx="26.5" fill="#0255DA" />
        <path
          d="M26.5 24.5L36.5 30.5L26.5 36.5V24.5Z"
          stroke="#F6F6F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_828_1937"
          x="0.442308"
          y="0.442308"
          width="60.1154"
          height="60.1154"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="3.55769"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_828_1937"
          />
          <feOffset />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.590833 0 0 0 0 0.590833 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_828_1937"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_828_1937"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
