import React, {Component} from 'react';
import {Form, Button} from 'semantic-ui-react'
import {PostData} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';
import {myFetch} from "../../PHP_Connector";
import  MyMessage from '../MyMessage';
import  AuthService from '../AuthService';
import {checkSalesRole} from "../validation";

class Start extends Component {

    constructor(props){
        super(props);
        this.auth = new AuthService();
        this.state = {
            loggedIn: false,
            isLoading: false,
            error: null,
            errorText: '',
            hasSalesRole: false,
        };
    };

    componentWillMount(){
        if(sessionStorage.getItem('userData')){
            this.setState({logged: true})
        }else{
            this.setState({loggedf: false})
        }
        let role = checkSalesRole();
        this.setState({
            errorText: '',
            hasSalesRole: role,
        });
    };

    render (){
        if (this.state.logged !== true ){
            return(<Redirect to={"/login"}/>);
        }

        return (
            <div>
                <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
            </div>
        )
    }
}

export default Start;
