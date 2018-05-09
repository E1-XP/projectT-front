export default `
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