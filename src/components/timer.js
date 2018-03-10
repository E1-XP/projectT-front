import React from 'react';
import Topbar from './topbar';

const Timer = (props) => {
    return (
        <div>
            <Topbar />
            <h2
                style={{ textAlign: 'center', color: '#555' }}
            >Add you first task to begin</h2>
        </div>
    );
};

export default Timer; 