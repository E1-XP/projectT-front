import React from 'react';
import styled from 'styled-components';
import Icon from '../components/icon';

const Color_Container = styled.div`
    display:flex;
    flex-wrap:wrap;
    width:140px;
    position:absolute;
    z-index:90;
    padding:.5rem;
    border:1px solid #bbb;
`;

const Color_Indicator = styled.div`
    padding:.5rem;
    width:1.5rem;
    background-color:${props => props.color};
`;

const Color_Indicator_Multi = styled(Color_Indicator)`
    margin:.2rem;
    height:1.5rem;
    position:relative;
`;

const Color_Indicator_Inner = styled.span`
    width:1.5rem;
    height:1.5rem;
    display:flex;
    border-radius:50%;
    position:absolute;
    top:0;
    left:0;
    justify-content:center;
    align-items:center;
    margin:0;
    &:hover{
        background-color:rgba(0,0,0,.3);
    }
`;

const Screen_blocker = styled.div`
     display: block;
        position:fixed;
        top:0;
        left:0;
        background-color:transparent;
        width:100%;
        height:100%;
        z-index:50;
`;

class ColorPickerDropdown extends React.Component {
    closeDropdown = () => {
        this.props.setState({ isColorSelectorOpen: false });
    }

    getSelectorColors = () => {
        const { colors, selectedColor } = this.props.state;
        const setActive = (itm) => this.props.setState({ selectedColor: itm, isColorSelectorOpen: false });

        return colors.map(itm => {
            const setActiveFn = () => setActive(itm);

            return (<Color_Indicator_Multi key={itm} color={itm} onClick={setActiveFn}>
                <Color_Indicator_Inner>
                    {itm === selectedColor && <Icon name="done" fill='#fff' size="16px" />}
                </Color_Indicator_Inner>
            </Color_Indicator_Multi>)
        });
    }

    render() {
        const { isOpen } = this.props;

        return (<React.Fragment>
            {isOpen && <Screen_blocker onClick={this.closeDropdown} />}
            {isOpen && (<Color_Container>
                {this.getSelectorColors()}
            </Color_Container>)}
        </React.Fragment>);
    }
}

export default ColorPickerDropdown;