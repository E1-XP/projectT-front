export default `
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
body {
    font-family: 'Open Sans', sans-serif;
    font-weight:500;
}

html,body,#root{
    height:100%;
    background-color: rgb(250,250,250);
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

 .rdr-Day{
    border:1px solid #ddd;
 }

 .ReactModal__Overlay {
    opacity: 0;
    transform:translateY(-400px);
    transition: all .2s ease-in-out;    
}

.ReactModal__Overlay--after-open{
    opacity: 1;
    transform:translateY(0);
}

.ReactModal__Overlay--before-close{
    opacity: 0;
    transform:translateY(-400px);    
}

 .active {
    background-color:rgba(255,255,255,.2);
 }

input[type="file"].inputfile-hidden  {
    display: none;
}

 input:focus::-webkit-input-placeholder { color:transparent; }
 input:focus::-moz-placeholder { color:transparent; }

.input-standard:focus::-webkit-input-placeholder {
    color:black; 
 }

.input-standard:focus::-moz-placeholder {
      color:black; 
 }
`;