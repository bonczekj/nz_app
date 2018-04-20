import React, {Component} from 'react';
import {NavLink, Link} from "react-router-dom";
import { Container, Dropdown, Menu} from 'semantic-ui-react'

class Header2 extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedTabId: 0};
        // This binding is necessary to make `this` work in the callback
        this.setActiveTab = this.setActiveTab.bind(this);
    };

    setActiveTab(tabId) {
        this.setState(prevState => ({
            selectedTabId: tabId
        }));
    };

    li_classname(tabId){
        //var classname = this.state.selectedTabId === tabId ? 'nav-link active': 'nav-link';
        let classname = this.state.selectedTabId === tabId ? 'nav-link active': 'nav-link';
        console.log(this.state.selectedTabId + " " + tabId + " " + classname);
        return classname;
    };

    li_classname_dropdown(tabId){
        //var classname = this.state.selectedTabId === tabId ? 'nav-link active': 'nav-link';
        let classname = this.state.selectedTabId === tabId ? 'nav-link dropdown-toggle active': 'nav-link dropdown-toggle';
        console.log(this.state.selectedTabId + " " + tabId + " " + classname);
        return classname;
    };

    render() {
        return (
            <Menu fixed='top' inverted>
                <Menu.Item>Evidence nabídek</Menu.Item>
                <Container>
                    Evidence nabídek
                    <Menu.Item as={NavLink} to="/offers">Nabídky</Menu.Item>
                    <Menu.Item as={NavLink} to="/orders">Zakázky</Menu.Item>
                    <Menu.Item as={NavLink} to="/tasks">Termíny</Menu.Item>
                    <Dropdown item simple text='Čísleníky'>
                        <Dropdown.Menu>
                            <Dropdown.Item as={NavLink} to="/users">Uživatelé</Dropdown.Item>
                            <Dropdown.Item as={NavLink} to="/documents">Dokumenty</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={NavLink} to="/customers">Subjekty</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Menu>
        );
    }
}


export default Header2;


/*

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Evidence nabídek</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="container">
                    <div className="collapse navbar-collapse" id="navbarColor01">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="nav-link" to="/offers">Nabídky</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeClassName="nav-link" to="/orders">Zakázky</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link" activeClassName="nav-link" to="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                    Čísleníky
                                </NavLink>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <NavLink className="dropdown-item" to="/users">Uživatelé</NavLink>
                                    <div className="dropdown-divider"></div>
                                    <NavLink className="dropdown-item" to="/documents">Dokumenty</NavLink>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
*/