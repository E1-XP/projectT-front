import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import Icon from './icon';

const Item_row = styled.li`
    text-align:center;
    padding:.5rem 2rem;
    padding-left:4rem;
    border:1px solid #ddd;
    display:flex;
    justify-content:space-around;
`;

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;

export default class TimeEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            description: ""
        }
    }

    setDescription(e) {
        const { i, item, handleRemove } = this.props;

        this.props.changeDescription(e.target.value, item.id, item.description);
    }

    getStopStartTime(start, stop) {
        const startFormat = moment(start).format('hh:mm A');
        const stopFormat = moment(Number(stop)).format('hh:mm A');

        return `${startFormat} - ${stopFormat}`;
    }

    render() {
        const { i, item, handleRemove, startNewEntry } = this.props;
        const { description } = this.props.item;

        return (
            <Item_row key={item.id}>
                <input type="text" defaultValue={description ? description : null}
                    // onChange={e => this.setState({ description: e.target.value })}
                    onBlur={e => this.setDescription(e)} placeholder='add description' />
                <span>no project</span>
                <span>{item.duration}</span>
                <span>{this.getStopStartTime(item.start, item.stop)}</span>
                <Item_link onClick={() => handleRemove(item.id)} >
                    <Icon name="delete" style={{ color: '#ccc' }} />
                </Item_link>
                <Item_link onClick={() => startNewEntry(item.description)} >
                    <Icon name="play_arrow" style={{ color: '#ccc' }} />
                </Item_link>
            </Item_row>);
    }
}