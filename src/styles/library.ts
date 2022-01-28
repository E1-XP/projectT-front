import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export const libraryStyles = `
.rc-tooltip.rc-tooltip-zoom-enter,
.rc-tooltip.rc-tooltip-zoom-leave {
  display: block;
}

.rc-tooltip-zoom-enter,
.rc-tooltip-zoom-appear {
  opacity: 0;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
  animation-play-state: paused;
}

.rc-tooltip-zoom-leave {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.6, -0.3, 0.74, 0.05);
  animation-play-state: paused;
}

.rc-tooltip-zoom-enter.rc-tooltip-zoom-enter-active,
.rc-tooltip-zoom-appear.rc-tooltip-zoom-appear-active {
  animation-name: rcToolTipZoomIn;
  animation-play-state: running;
}

.rc-tooltip-zoom-leave.rc-tooltip-zoom-leave-active {
  animation-name: rcToolTipZoomOut;
  animation-play-state: running;
}

@keyframes rcToolTipZoomIn {
  0% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(0, 0);
  }
  100% {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1, 1);
  }
}

@keyframes rcToolTipZoomOut {
  0% {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1, 1);
  }
  100% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(0, 0);
  }
}

.rc-tooltip {
  position: absolute;
  z-index: 1070;
  display: block;
  visibility: visible;
  line-height: 1.5;
  font-size: 12px;
  padding: 1px;
  opacity: 0.9;
  margin-bottom:.7rem;
}

.rc-tooltip-hidden {
  display: none;
}

.rc-tooltip-inner {
  padding: 14px 12px;
  color: #333333;
  text-align: left;
  text-decoration: none;
  background-color: #ffffff;
  border-radius: 7px;
  min-height: 34px;
  border: 1px solid #b1b1b1;  
  margin-bottom:.7rem;  
}

.recharts-wrapper {
    box-shadow: 0 1px 3px rgba(128,128,128,0.2);
}

.rc-tooltip-inner {
    width:105%;
}

.rdrDayEndOfMonth .rdrInRange,
.rdrDayEndOfMonth .rdrStartEdge,
.rdrDayEndOfWeek .rdrInRange,
.rdrDayEndOfWeek .rdrStartEdge,
 {
    border-top-left-radius: 0.3em;
    border-bottom-left-radius: 0.3em;
}

.rdrDayEndOfWeek .rdrStartEdge {
    border-top-right-radius: 0.3em;
    border-bottom-right-radius: 0.3em;
}

.rdrDayStartOfMonth .rdrInRange,
.rdrDayStartOfMonth .rdrEndEdge,
.rdrDayStartOfWeek .rdrInRange,
.rdrDayStartOfWeek .rdrEndEdge {
    border-top-left-radius: 0.3em;
    border-bottom-left-radius: 0.3em;
}

.rdrDayEndOfMonth .rdrInRange,
.rdrDayEndOfWeek .rdrInRange {
    border-top-right-radius: 0.3em;
    border-bottom-right-radius: 0.3em;
}

.rdrStartEdge {
    border-top-left-radius: 0.3em;
    border-bottom-left-radius: 0.3em;
}

.rdrEndEdge {
    border-top-right-radius: 0.3em;
    border-bottom-right-radius: 0.3em;
}

.ReactModal__Overlay {
    opacity: 0;
    transform: translateY(-400px);
    transition: all .2s ease-in-out;
}
.ReactModal__Overlay--after-open {
    opacity: 1;
    transform: translateY(0);
}
.ReactModal__Overlay--before-close {
    opacity: 0;
    transform: translateY(-400px);
}
.ReactModal__Content.ReactModal__Content--after-open {
    left: calc(40px + 52px) !important;
    @media only screen and (min-width:1024px) {
        left: calc(40px + 167.5px) !important;        
    }
}

input[type=checkbox]:not(old) {
    width: 2em;
    margin: 0;
    padding: 0;
    font-size: 1em;
    opacity: 0;
}
input[type=checkbox]:not(old)+label {
    display: inline-block;
    margin-left: -2em;
    line-height: 1.5em;
}
input[type=checkbox]:not(old)+label>span {
    display: inline-block;
    width: 0.875em;
    height: 0.875em;
    margin: 0.25em 0.5em 0.25em 0.25em;
    border: 0.0625em solid rgb(192, 192, 192);
    border-radius: 0.25em;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
    background: #fff;
    vertical-align: bottom;
}
input[type=checkbox]:not(old):checked+label>span {
    background: #fff;
}
input[type=checkbox]:not(old):checked+label>span:before {
    content: '✓';
    display: block;
    width: 1em;
    color: #47be00;
    font-size: 0.875em;
    line-height: 1em;
    text-align: center;
    font-weight: bold;
}

::-webkit-scrollbar {
    width:6px;
}

::-webkit-scrollbar-thumb {
    background:#e20505;
}
`;
