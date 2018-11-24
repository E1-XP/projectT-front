import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import styledNormalize from 'styled-normalize';
import { injectGlobal } from 'styled-components';
import reset from './styles/reset';
import style from './styles/style';

import store from './store';
import history from './history';
import routes from './routes';

const baseCSS = () => injectGlobal`
    ${styledNormalize}
    ${reset}
    ${style}
`;

class App extends React.Component {
    render() {
        baseCSS();
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    {routes}
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default App;