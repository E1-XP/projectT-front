import React from 'react';
import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);
import styled from 'styled-components';

import Topbar from './topbar';
import Icon from './icon';

const Navigation_list = styled.ul`
    margin-top:61px;
`;

const Navigation_item = styled.li`
   
`;

const Item_table = styled.table`
    width:100%;
`;

const Item_header = styled.th`
    text-align: center;
    color: #555;
    padding:1rem;
    border:1px solid #eee;
    display:flex;
    justify-content:space-around;
`;

const Item_row = styled.td`
    text-align:center;
    padding:.5rem;
    border:1px solid #ddd;
    display:flex;
    justify-content:space-around;
`;

const Item_link = styled.a`
    color:#ccc;
    cursor:pointer;
`;

class Timer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //is:false
        }
    }

    render() {
        const { handleClick, handleRemove, stopTimer, state } = this.props;

        const getReadable = item => moment(item.start).format('ddd, DD MMM');
        const getLength = item => moment.duration(moment(Number(item.stop)).diff(item.start)).format('h:mm:ss', { stopTrim: "hh mm ss" });
        const reduceItems = (acc, item) => {
            acc[item.readable] ? acc[item.readable].push(item) : acc[item.readable] = [item];
            return acc;
        }

        const mappedItems = state.userData.entries.filter(item => item.stop !== undefined)
            .sort((a, b) => b.start - a.start)
            .map((item, i) => ({
                start: item.start,
                stop: item.stop,
                userId: item.userId,
                id: item._id,
                readable: getReadable(item),
                length: getLength(item)
            })).reduce(reduceItems, {});

        console.log(mappedItems);
        // console.log(moment.duration(mappedItems['Tue, 13 Mar'][0]).asSeconds());

        const getTotalDayCount = item => {
            const toSeconds = mappedItems[item].reduce((acc, item) => acc += moment.duration(item.length).asSeconds(), 0);
            return moment.duration(toSeconds, 'seconds').format();
        }
        const getEntries = item => mappedItems[item].map((item2, i) =>
            (<tr key={i}><Item_row key={i}>{item2.length}
                <Item_link onClick={() => alert(item2.id)} >
                    <Icon name="delete" style={{ color: '#ccc' }} />
                </Item_link>
            </Item_row>
            </tr>));

        const DOMItems = () => Object.keys(mappedItems).map((item, i) =>
            <Navigation_item key={i}>
                <Item_table>
                    <tbody>
                        <tr>
                            <Item_header>
                                <span onClick={() => alert('ok')}>entries: {mappedItems[item].length}</span>
                                <span style={{ fontWeight: '700' }}>{item}</span>
                                <span>total: {getTotalDayCount(item)}</span>
                            </Item_header>
                        </tr>
                        {getEntries(item)}
                    </tbody>

                </Item_table>
            </Navigation_item >);
        // .map((item, i) => (<Navigation_item key={i}>
        //     <span style={{ fontWeight: '700' }}>{moment(item.start).format('ddd, DD MMM')}</span>
        //     <span>{moment.duration(moment(Number(item.stop)).diff(item.start)).format('h:mm:ss', { stopTrim: "hh mm ss" })}</span>
        // </Navigation_item>));

        return (
            <div>
                <Topbar state={state} handleClick={handleClick} stopTimer={stopTimer} />
                <Navigation_list>
                    {state.userData.entries ? (state.userData.entries.length ? DOMItems() :
                        <Navigation_item >Add you first task to begin</Navigation_item>) : <p>Loading...</p>}
                </Navigation_list>
            </div>
        );
    };
}

export default Timer; 