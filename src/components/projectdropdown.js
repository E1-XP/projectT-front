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

const Item = styled.li`
    padding:.5rem;
    width:15rem;
    background-color:${props => props.project ? '#eee' : 'white'};
    color:${props => props.project ? 'green' : 'black'};    
    border-radius:5px;    
    &:hover{
        background-color:#eee;
    }
`;

const List = styled.ul`
    max-height:12rem;
    overflow-y:auto;
`;

const Input = styled.input`
    margin-left:.5rem;
    border:none;
    outline-color:transparent;
`;

const Searchbar = styled.div`
    display:flex;
    justify-content:center;
    border-radius:5px;
    border:1px solid #ddd;    
    padding:.1rem;
    margin-bottom:.5rem;
`;

const Pos_absolute = styled.div`
    position:absolute;
`;

const Wrapper = {
    borderRadius: '5px',
    position: 'absolute',
    zIndex: 50,
    backgroundColor: 'white',
    boxShadow: '0 2px 6px 0 rgba(0,0,0,.2)',
    padding: '.7rem',
    maxHeight: '15rem'
}

const Screen_blocker = styled.div`
    display: block;
    position:absolute;
    top:0;
    left:0;
    background-color:transparent;
    width:100%;
    height:100%;
`;

class ProjectDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenuOpen: false,
            inputValue: '',
        }

        this.wrapperStyle = { ...Wrapper, ...this.props.style };
    }

    componentWillReceiveProps(nxtProps) {
        if (nxtProps.isOpen && this.state.isMenuOpen !== nxtProps.isOpen) this.openMenu();
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.closeMenu);
    }

    openMenu = e => {
        this.setState({ isMenuOpen: true }, e => document.addEventListener('click', this.closeMenu));
    }

    closeMenu = e => {
        const liElems = Array.from(document.querySelectorAll('.js-click-close'));

        if (!this.dropdown.contains(e.target) || liElems.some(itm => itm.contains(e.target))) {
            this.props.setParentState({ isMenuOpen: false });
            this.setState({ isMenuOpen: false }, e => document.removeEventListener('click', this.closeMenu));
        }
    }

    shouldShowItem = itm => {
        const { inputValue } = this.state;
        return inputValue ? itm.includes(inputValue) : true;
    }

    setInputState = e => {
        this.setState({ inputValue: e.target.value });
    }

    generateItemArray = () => {
        const { project, setProjectState, projects } = this.props;
        let counter = 0;
        let shouldShowEmptyItem;

        const listItems = projects.map((itm, i, arr) => {
            if ((i === arr.length - 1) && !counter) shouldShowEmptyItem = true;

            if (this.shouldShowItem(itm.name)) {
                counter += 1;

                return (<Item key={itm.name} project={project === itm.name}
                    onClick={(e) => setProjectState(itm)} className="js-click-close">
                    <Item_link>
                        <Color_indicator color={itm.color} />{itm.name}
                    </Item_link>
                </Item>);
            }
        });

        return (<List>
            {this.shouldShowItem('no project') &&
                <Item key='no project' onClick={(e) => setProjectState(null)} className="js-click-close">
                    <Item_link> <Color_indicator color={'bbb'} />no project</Item_link>
                </Item>}
            {listItems}
            {shouldShowEmptyItem && <Item key='nothing to show' >
                <Item_link>No projects found</Item_link></Item>}
        </List>);
    }

    render() {
        const { setProjectState, style } = this.props;
        const { isMenuOpen, itemFilter, inputValue, shouldShowEmptyItem } = this.state;

        return (
            <React.Fragment>
                {isMenuOpen && <Screen_blocker />}
                <Pos_absolute>
                    {isMenuOpen && <div ref={node => this.dropdown = node} style={this.wrapperStyle}>
                        <Searchbar >
                            <Icon name="search" fill="#ccc" size="20px" />
                            <Input placeholder="Find project..." className="input-standard"
                                value={inputValue} onChange={this.setInputState} />
                        </Searchbar>
                        {this.generateItemArray()}
                    </div>}
                </Pos_absolute>
            </React.Fragment>);
    }
}

export default ProjectDropdown;