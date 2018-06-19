import React from 'react';

const DelayRendering = Component =>
    class DelayRender extends React.Component {
        constructor() {
            super();

            this.state = {
                shouldRender: false
            }
        }

        componentDidMount() {
            requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ shouldRender: true })));
        }

        render() {
            return this.state.shouldRender ? (<Component {...this.props} />) : null;
        }
    }

export default DelayRendering;