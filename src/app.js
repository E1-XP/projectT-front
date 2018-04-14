import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import styledNormalize from 'styled-normalize';
import { injectGlobal } from 'styled-components';
import reset from './styles/reset';
import style from './styles/style';

import store from './store';
import routes from './routes';

const baseCSS = () => injectGlobal`
    ${styledNormalize}
    ${reset}
    ${style}
`;

class App extends React.Component {
    shouldComponentUpdate(nextProps) {
        return false;
    }

    render() {
        baseCSS();
        return (
            <Provider store={store}>
                <Router>{routes}</Router>
            </Provider>
        );
    }
}

export default App;