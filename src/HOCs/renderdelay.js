// import React from 'react';

// const DelayRendering = Component =>
//     class DelayRender extends React.Component {
//         constructor() {
//             super();

//             this.state = {
//                 shouldRender: true
//             }
//         }

//         componentDidMount() {
//             setTimeout(() => this.setState({ shouldRender: false }), 1000);
//         }

//         componentDidUpdate() {
//             requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ shouldRender: true })));
//         }

//         render() {
//             return this.state.shouldRender ? (<Component {...this.props} />) : null;
//         }
//     }

// export default DelayRendering;