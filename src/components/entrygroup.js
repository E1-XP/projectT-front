import React from 'react';
import styled from 'styled-components';

import EntryHeader from './entryheader';
import EntryTimer from './entrytimer';

const Itembody_body = styled.ul`
`;

const Item_project = styled.span`
    color:${({ color }) => color === 'white' ? 'black' : color};
`;

const Item_table = styled.table`
    width:100%;
`;

const Time_container_inner = styled.div`
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    justify-content:center;
    width:12rem;
`;

const Time_container_outer = styled.div`
    display:flex;
    align-items:center;
`;

const Color_indicator = styled.span`
    display: inline-block;
    width:.6rem;
    height:.6rem;
    background-color: ${props => props.color};
    border-radius: 50%;
    margin-right: .5rem;
`;

const GroupEntries_length = styled.span`
    cursor:pointer;
    margin-right: .5rem;
    color: ${({ color }) => color};
`;

const Input_task = styled.input`
    border: none;
    outline-color: transparent;
`;

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;

const Item_link_relative = styled.span`
    cursor:pointer;
    position:relative;
    opacity:0;
    pointer-events:none;
`;

const Item_link_toggle = styled(Item_link) `
    opacity:0;
    pointer-events:none;
`;

const Item_toggle = styled.span`
    display:none;
`;

const Itembody_header = styled.header`
    display:flex;
    justify-content:space-between;
    padding:1rem 0;
    margin:auto .3rem;
    margin-left:1.5rem;
    height:4rem;
    align-items:center;
    &:hover ${Item_link_toggle} {
        opacity:1;
        pointer-events:all;
    }
    &:hover ${Item_link_relative} {
        opacity:1;
        pointer-events:all;    
    }
    &:hover ${Item_toggle} {
        display:block;
    }
`;

export default class EntryGroup extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { currentItem } = this.props;

        if (this.props.filteredItem !== nextProps.filteredItem) return true;
        if (currentItem.length !== nextProps.currentItem.length) return true;

        return nextProps.currentItem.some((itm, i) =>
            (currentItem[i].project !== itm.project || currentItem[i].description !== itm.description ||
                currentItem[i].billable !== itm.billable || currentItem[i].stop !== itm.stop));
    }

    render() {
        const { currentItem, filteredItem, item, getSingleEntries } = this.props;

        return (
            <section key={currentItem[0].id}>
                <Itembody_header>
                    <EntryHeader {...this.props} Item_link_toggle={Item_link_toggle} />
                    <EntryTimer {...this.props} Item_link_toggle={Item_link_toggle}
                        Item_toggle={Item_toggle} Item_link_relative={Item_link_relative} />
                </Itembody_header>
                <Itembody_body>
                    {(filteredItem && currentItem.length > 1) && getSingleEntries(currentItem)}
                </Itembody_body>
            </section>);
    }
}