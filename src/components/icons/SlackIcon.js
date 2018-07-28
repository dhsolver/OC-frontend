import React from 'react';

const SlackIcon = ({ size = 20, fill = '#9399A3', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>slack icon</title>
    <g id="slack" fill={fill}>
      <path d="M19.1625,7.25 C21.225,14.125 19.62125,17.1 12.75,19.1625 C5.875,21.225 2.9,19.62125 0.8375,12.75 C-1.225,5.875 0.38,2.9 7.25,0.8375 C14.1225,-1.225 17.1,0.38 19.1625,7.25 Z M15.6875,11.7125 L15.695,11.73875 C16.2325,11.56375 16.5275,10.97625 16.345,10.42625 C16.16375,9.87625 15.57625,9.58875 15.0325,9.76375 L13.74,10.19375 L12.8775,7.6225 L14.175,7.185 C14.71625,7.005 15.01,6.4175 14.82875,5.8725 C14.64625,5.335 14.05875,5.04 13.51625,5.2225 L12.22,5.6475 L11.77,4.2975 C11.59,3.75 11.00125,3.4625 10.4575,3.6375 C9.9125,3.825 9.625,4.4125 9.8,4.95 L10.25,6.2875 L7.58875,7.1825 L7.13875,5.8425 C6.96375,5.3025 6.37625,5.00625 5.82625,5.19 C5.27625,5.37 4.98875,5.9575 5.16375,6.5025 L5.61375,7.84 L4.31375,8.2725 C3.76375,8.45625 3.47625,9.04375 3.65125,9.585 C3.78875,10.01 4.18875,10.27875 4.60125,10.29125 C4.72,10.29375 4.84,10.2775 4.9575,10.2375 L6.25,9.8 L7.07375,12.37375 L5.77375,12.81125 C5.23625,12.98625 4.93625,13.57375 5.12375,14.12375 C5.27375,14.54875 5.66125,14.82375 6.08625,14.83625 C6.21125,14.83625 6.32375,14.82375 6.44875,14.78625 L7.74875,14.34875 L8.19875,15.69875 C8.34875,16.12375 8.73625,16.39375 9.16125,16.40625 C9.28625,16.40875 9.39875,16.3925 9.52375,16.3525 C10.07375,16.17125 10.36125,15.58375 10.18625,15.04 L9.73625,13.7 L12.41125,12.805 L12.86125,14.145 C13.01125,14.57 13.39875,14.84 13.82375,14.8525 C13.94875,14.85625 14.06125,14.8375 14.18625,14.8 C14.72875,14.6175 15.0225,14.03 14.84125,13.4875 L14.39125,12.14625 L15.6875,11.7125 Z" />
      <polygon points="8.2325 9.1625 9.095 11.73375 11.76625 10.83875 10.90375 8.27625 8.2325 9.17625" />
    </g>
  </svg>
);

export default SlackIcon;
