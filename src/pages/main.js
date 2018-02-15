import React, {Component} from 'react'
import {Route} from "react-router-dom";
import { Container } from 'semantic-ui-react'

import Offers from '../components/offers';
//import Users from '../components/users';
import Users from '../components/users/Users';
import Documents from '../components/documents/Documents';
import Orders from '../components/orders';

class Main extends Component {
    render() {
        return (
            <Container style={{padding:'5em'}}>
                <Route exact path="/" component={Offers}/>
                <Route exact path="/offers" component={Offers}/>
                <Route exact path="/orders" component={Orders}/>
                <Route exact path="/users" component={Users}/>
                <Route exact path="/documents" component={Documents}/>
            </Container>
        );
    }
}

export default Main;