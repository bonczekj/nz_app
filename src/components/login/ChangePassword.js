import React, {Component} from 'react';
import {Form, Button} from 'semantic-ui-react'
import {PostData} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';
import {myFetch, PHP_url} from "../../PHP_Connector";
import  MyMessage from '../MyMessage';
import  AuthService from '../AuthService';

class ChangePassword extends Component {



    constructor(props){
        super(props);
        this.auth = new AuthService();
        this.state = {
            username: '',
            email: '',
            password: '',
            password1: '',
            showData: {username: '', email: '', password: '', password1: ''},
            logged: false,
            isLoading: false,
            error: null,
            errorText: '',
            infoText: '',
        };
    };

    componentWillMount(){
        if(sessionStorage.getItem('userData')){
            let email;
            let sessStor = sessionStorage.getItem('userData');
            let userDataObj = JSON.parse(sessStor);
            let userDataDetail = userDataObj["userData"];
            email = userDataDetail["email"];
            let showData = this.state.showData;
            showData.email = email;
            this.setState({
                logged: true,
                showData: showData
            })
        }else{
            this.setState({logged: false})
        }
    }

    handleChange = (e) => {
        //this.setState({[e.target.name]: e.target.value})
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
        this.setState({ showData: newState });
    };

    changePassword = (e) => {
        e.preventDefault(); // Stop form submit
        if ((this.state.showData.password) && (this.state.showData.password === this.state.showData.password1)){
            myFetch( 'POST', '/nz_rest_api_slim/login/changepassword', this.state.showData).then(
                result => this.fetchOK(result),
                error => this.fetchERR(error)
            )
        }
    };

    fetchOK(result){
        this.setState({errorText: ''});
        this.setState({infoText: 'Heslo bylo změněno'});
    };

    fetchERR(error){
        this.setState({errorText: error.toString()});
    };


    render (){
        if (this.state.logged !== true ){
            return(<Redirect to={"/login"}/>);
        }

        return (
            <div align="center">
            <Form>
                <MyMessage errText={this.state.errorText} infoText={this.state.infoText} isLoading={this.state.isLoading}/>
                <Form.Field inline width={4}>
                    <label>Heslo</label>
                    <input type='password' name='password' value={this.state.showData.password} onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field inline width={4}>
                    <label>Potvrzení hesla</label>
                    <input type='password' name='password1' value={this.state.showData.password1} onChange={this.handleChange}/>
                </Form.Field>
                <Button type='submit' onClick={this.changePassword}>Změnit heslo</Button>
            </Form>
            </div>
        )
    }
}

export default ChangePassword;
