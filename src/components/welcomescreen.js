import React, { Fragment } from 'react';
import styled from 'styled-components';

const Paragraph = styled.p`
    text-align:center;
    padding:2rem;
    color:#999;
    margin-top:50px;
    font-weight: 700;
    font-size: 20px;
`;

const Container = styled.div`
    height:250px;
    display:flex;
    justify-content:center;
`;

const Copyright = styled.footer`
    display:flex;
    justify-content:center;
    font-size:.8rem;
    padding-bottom: 0;
    position: absolute;
    bottom: 1rem;
    left: 0;
    width: 100%;
    text-align: center;
    top: 95vh;
    color: #999;
`;

const Svg = () => <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 60 60" style={{height:'95%', marginTop:'3rem'}} space="preserve">
<g>
<circle style={{fill:'#3C97D3'}} cx="30" cy="29" r="29"/>
<path style={{fill:'#B1D3EF'}} d="M30,60C13.458,60,0,46.542,0,30c0-7.993,3.107-15.514,8.749-21.176
   c0.779-0.785,2.047-0.785,2.828-0.006c0.783,0.78,0.785,2.046,0.006,2.828C6.693,16.555,4,23.072,4,30c0,14.337,11.663,26,26,26
   s26-11.663,26-26C56,16.337,45.405,5.101,32,4.076v10.757c0,1.104-0.896,2-2,2s-2-0.896-2-2V2c0-1.104,0.896-2,2-2
   c16.542,0,30,13.458,30,30S46.542,60,30,60z"/>
<path style={{fill:'#B1D3EF'}} d="M20,20.121L20,20.121l12.944,9.363c1.274,0.926,1.419,2.772,0.305,3.886l0,0
   c-1.114,1.114-2.959,0.969-3.886-0.305L20,20.121z"/>
<g>
   <circle style={{fill:'#71C386'}} cx="48" cy="47.981" r="12"/>
   <path style={{fill:'#FFFFFF'}} d="M54,46.981h-5v-5c0-0.552-0.448-1-1-1s-1,0.448-1,1v5h-5c-0.552,0-1,0.448-1,1s0.448,1,1,1h5v5
       c0,0.552,0.448,1,1,1s1-0.448,1-1v-5h5c0.552,0,1-0.448,1-1S54.552,46.981,54,46.981z"/>
</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>


const WelcomeScreen = () => {
    return (<Fragment>
        <Paragraph>Nothing to show here. Hit the start button to begin time tracking.</Paragraph>
        <Container>
            <Svg/>
        </Container>
        <Copyright>
                <div>Icons made by <a href="https://www.freepik.com/"
                    title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"
                        title="Flaticon">www.flaticon.com</a> is licensed by <a
                            href="http://creativecommons.org/licenses/by/3.0/"
                            title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            </Copyright>
    </Fragment>);
}

export default WelcomeScreen;