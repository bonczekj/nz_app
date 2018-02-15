import React, {Component} from 'react';
import {NavLink} from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedTabId: 1};
        // This binding is necessary to make `this` work in the callback
        this.setActiveTab = this.setActiveTab.bind(this);
    };

    setActiveTab(tabId) {
        this.setState(prevState => ({
            selectedTabId: tabId
        }));
    };

    li_classname(tabId){
        var classname = this.state.selectedTabId === tabId ? 'nav-link active': 'nav-link';
        //console.log(this.state.selectedTabId + " " + tabId + " " + classname);
        return classname;
    };

    render() {
        return (
            <div className="container" >
                <h1>Simple SPA react</h1>
                <nav className="navbar navbar-expand-lg bg-light">
                    <ul className="navbar-nav">
                        <li className={ this.li_classname(1) }><NavLink className="nav-link" activeclassname="nav-link active" to="/" onClick={ this.setActiveTab.bind(this, 1) }>Nabídky</NavLink></li>
                        <li className={ this.li_classname(2) }><NavLink className="nav-link" activeclassname="nav-link active" to="/offers" onClick={ this.setActiveTab.bind(this, 2) }>Nabídky 2</NavLink></li>
                    </ul>
                </nav>
            </div>
        );
    }
}


export default Header;

