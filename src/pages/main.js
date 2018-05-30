import React, {Component} from 'react'
import {Route} from "react-router-dom";
import { Container } from 'semantic-ui-react'

import Offers from '../components/offers/Offers';
import Users from '../components/users/Users';
import Documents from '../components/documents/Documents';
import Orders from '../components/Orders/Orders';
import Customers from '../components/customers/Customers';
import Tasks from '../components/tasks/Tasks';
import Login from '../components/login/Login';
import Start from '../components/start/Start';

class Main extends Component {
    render() {
        return (
            <Container style={{paddingTop:'5em'}}>
                <Route exact path="/" component={Start}/>
                <Route exact path="/start" component={Start}/>
                <Route exact path="/offers" component={Offers}/>
                <Route exact path="/orders" component={Orders}/>
                <Route exact path="/ordersarchive" component={Orders}/>
                <Route exact path="/users" component={Users}/>
                <Route exact path="/documents" component={Documents}/>
                <Route exact path="/customers" component={Customers}/>
                <Route exact path="/subcontractors" component={Customers} />
                <Route exact path="/tasks" component={Tasks}/>
                <Route exact path="/login" component={Login}/>
            </Container>
        );
    }
}

export default Main;