import * as React from "react";

export const ClusterCicle = ({ text }: any) => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 62 62"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="Subtract"
      d="M62 31C62 48.1208 48.1208 62 31 62C13.8792 62 0 48.1208 0 31C0 13.8792 13.8792 0 31 0C48.1208 0 62 13.8792 62 31Z"
      fill="#F59100"
      opacity="0.95"
    />

    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="white"
    >
      {text}
    </text>
  </svg>
);
