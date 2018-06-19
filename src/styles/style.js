export default `
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

html{
    overflow-x:hidden;
}

body {
    font-family: 'Open Sans', sans-serif;
    font-weight: 500;
}

html,
body,
#root {
    height: 100%;
    background-color: rgb(250, 250, 250);
}

.custom-scroll {
    min-height: 0;
    min-width: 0; }
    .custom-scroll .outer-container {
      overflow: hidden; }
      .custom-scroll .outer-container .positioning {
        position: relative; }
      .custom-scroll .outer-container:hover .custom-scrollbar {
        opacity: 1;
        transition-duration: 0.2s; }
    .custom-scroll .inner-container {
      overflow-x: hidden;
      overflow-y: scroll; }
      .custom-scroll .inner-container:after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 0;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.05) 60%, transparent 100%);
        pointer-events: none;
        transition: height 0.1s ease-in;
        will-change: height; }
      .custom-scroll .inner-container.content-scrolled:after {
        height: 5px;
        transition: height 0.15s ease-out; }
    .custom-scroll.scroll-handle-dragged .inner-container {
      -webkit-user-select: none;
         -moz-user-select: none;
          -ms-user-select: none;
              user-select: none; }
    .custom-scroll .custom-scrollbar {
      position: absolute;
      height: 100%;
      width: 6px;
      right: 3px;
      opacity: 0;
      z-index: 1;
      transition: opacity 0.4s ease-out;
      padding: 6px 0;
      box-sizing: border-box;
      will-change: opacity;
      pointer-events: none; }
      .custom-scroll .custom-scrollbar.custom-scrollbar-rtl {
        right: auto;
        left: 3px; }
    .custom-scroll.scroll-handle-dragged .custom-scrollbar {
      opacity: 1; }
    .custom-scroll .custom-scroll-handle {
      position: absolute;
      width: 100%;
      top: 0; }
    .custom-scroll .inner-handle {
      height: calc(100% - 12px);
      margin-top: 6px;
      background-color: rgba(78, 183, 245, 0.7);
      border-radius: 3px; }  

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

.btn-disabled {
    cursor: not-allowed;
    filter:grayscale(100%);
}

.dropdown {
    display: inline-block;
}

.dropdown__content {
    display: none;
    position: absolute;
}

.dropdown--active .dropdown__content {
    display: block;
}

.rdr-WeekDays {
    background-color: #ddd;
}

.rdr-Days > span {
    border: 1px solid #ddd;
}

.rdr-Days .rdr-Day {
    font-size: 15px !important;
}
.rdr-MonthAndYear span {
    font-size:14px !important;
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

.active {
    background-color: rgba(255, 255, 255, .2);
}

input[type="file"].inputfile-hidden {
    display: none;
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

input:focus::-webkit-input-placeholder {
    color: transparent;
}

input:focus::-moz-placeholder {
    color: transparent;
}

.input-standard:focus::-webkit-input-placeholder {
    color: black;
}

.input-standard:focus::-moz-placeholder {
    color: black;
}

.recharts-responsive-container {
    margin:0 auto;
}

.recharts-wrapper {
    box-shadow: 0 1px 3px rgba(128,128,128,0.2);
}

.rc-tooltip-inner {
    width:105%;
}

::-webkit-scrollbar {
    width:6px;
}

::-webkit-scrollbar-thumb {
    background:#e20505;
}

`;