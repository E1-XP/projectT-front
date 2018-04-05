import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import styledNormalize from 'styled-normalize';
import { injectGlobal } from 'styled-components';
import reset from './styles/reset';

import store from './store';
import routes from './routes';

const resetCSS = () => injectGlobal`
    ${styledNormalize}
    ${reset}
`;

class App extends React.Component {
    shouldComponentUpdate(nextProps) {
        return false;
    }

    render() {
        resetCSS();
        return (
            <Provider store={store}>
                <Router>{routes}</Router>
            </Provider>
        );
    }
}

export default App;