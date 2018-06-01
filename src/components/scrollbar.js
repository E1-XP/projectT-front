import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const Scrollbar = ({ children }) =>
    (<Scrollbars
        // autoHide={true} autoHideDuration={400} autoHideTimeout={700}
        autoHeight autoHeightMin={'100%'} autoHeightMax={'100%'}
        renderThumbVertical={props => (<div {...props} className="thumb-vertical" />)}
        renderTrackVertical={props => (<div {...props} className="track-vertical" />)}
        renderTrackHorizontal={props => (<div {...props} className="track-horizontal" />)}>
        {children}
    </Scrollbars>);

export default Scrollbar;