import React from 'react';
import styled from 'styled-components';
import Icon from './icon';

const Color_indicator = styled.span`
    display:inline-block;
    width:.6rem;
    height:.6rem;
    background-color:${props => '#' + props.color};
    border-radius:50%;
    margin-right:.5rem;
`;

const Item_link = styled.a`
    cursor:pointer;
    display:flex;
    align-items:center;
`;

const TopBarDropdown = props => {
    const { setProjectState, userData } = props;

    return (
        <ul>
            <li key={'no project'} onClick={() => setProjectState(null)}>
                <Item_link> <Color_indicator color={'bbb'} />no project</Item_link>
            </li>
            {userData.projects.map(itm =>
                (<li key={itm.name} onClick={() => setProjectState(itm)}>
                    <Item_link>
                        <Color_indicator color={itm.color} />{itm.name}
                    </Item_link>
                </li>))}
            <li key={'add project'} onClick={() => 'ok'}>
                <Item_link><Icon name="add" fill="green" />add Project</Item_link>
            </li>
        </ul>
    );
}

export default TopBarDropdown;