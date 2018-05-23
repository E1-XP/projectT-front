import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import * as actions from '../actions/global';

const Wrapper = styled.aside`
    position:fixed;
    bottom:0;
    width:calc(100% - 50px);
    display:flex;
    justify-content:center;    
    margin-left:52px;
    pointer-events:none;    
    transition:all .3s ease-in-out;    
    opacity:${props => props.isVisible ? 1 : 0};    
    @media only screen and (min-width:1024px) {
        margin-left:167.5px;
        width:calc(100% - 167.5px);    
    }
`;

const Bar = styled.div`
    background-color:${props => props.online ? '#47be00' : '#e20505'};
    padding:.7rem 3rem;
    color:#fff;
    cursor:default;            
`;

class StatusBar extends React.Component {
    constructor() {
        super();

        this.state = {
            isVisible: false
        }
    }

    componentDidMount() {
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
    }

    handleOnline = () => {
        this.props.setIsOnline(true);

        this.setState({ isVisible: true })
        setTimeout(() => this.setState({ isVisible: false }), 3000);
    }

    handleOffline = () => {
        this.props.setIsOnline(false);
        this.setState({ isVisible: true })
    }

    render() {
        const { isOnline } = this.props;
        const { isVisible } = this.state;

        return (<Wrapper isVisible={isVisible}>
            <Bar online={isOnline}>
                {isOnline ? 'You are back online.' : 'You are disconnected. Check your network status.'}
            </Bar>
        </Wrapper>);
    }
}

const mapStateToProps = ({ global }) => ({
    isOnline: global.isOnline
});

const mapDispatchToProps = dispatch => ({
    setIsOnline: bool => dispatch(actions.setIsOnline(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);