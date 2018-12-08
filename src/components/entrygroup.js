import React from 'react';
import styled from 'styled-components';

import EntryHeader from './entryheader';
import EntryTimer from './entrytimer';

const Entry_section = styled.section`
`;

const Itembody_body = styled.ul`
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
    color:${props => props.fill || '#ccc'};
        &:hover{
            color:${props => props.fill || '#999'};
        }
`;

const Item_link_toggle = styled(Item_link)`
    opacity:${props => props.isOpen ? '1' : '0'};
    pointer-events:none;
    color:${props => props.isOpen ? '#999' : '#ccc'};
    background-color:${props => props.isOpen ? '#eee' : 'transparent'};
    padding: .2rem .4rem;
    border-radius: 5px;
    &:hover{
        color:#999;
    }
`;

const Item_toggle = styled.span`
    display:none;
`;

const Itembody_header = styled.header`
    display:flex;
    justify-content:space-between;
    padding:1rem 0;
    margin:auto 0;
    height:4rem;
    align-items:center;
    &:hover{
        background-color:#f5f5f5;
    }
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
        const { currentItem, filteredItem } = this.props;

        if (filteredItem !== nextProps.filteredItem || currentItem !== nextProps.currentItem) return true;
        if (currentItem.length !== nextProps.currentItem.length) return true;

        return nextProps.currentItem.some((itm, i) =>
            (currentItem[i].project !== itm.project || currentItem[i].description !== itm.description ||
                currentItem[i].billable !== itm.billable || currentItem[i].stop !== itm.stop));
    }

    render() {
        const { currentItem, filteredItem, getSingleEntries, idx, isFetching } = this.props;
        console.log('will update entry');

        return <Entry_section key={currentItem[0].id}>
            <Itembody_header>
                <EntryHeader {...this.props} Item_link_toggle={Item_link_toggle} />
                <EntryTimer {...this.props} Item_link_toggle={Item_link_toggle}
                    Item_toggle={Item_toggle} Item_link_relative={Item_link_relative} />
            </Itembody_header>
            <Itembody_body>
                {(filteredItem && currentItem.length > 1) && getSingleEntries(currentItem, idx)}
            </Itembody_body>
        </Entry_section>;
    }
}
