import React, {Component} from 'react';
import {Form, Button} from 'semantic-ui-react'
import {PostData} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';

class Login extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            showData: {username: '', password: ''},
            redirect: false,
            isLoading: false,
            error: null,
            errorText: ''
        };
    };

    handleChange = (e) => {
        //this.setState({[e.target.name]: e.target.value})
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
        this.setState({ showData: newState });
    };

    login = (e) => {
        e.preventDefault(); // Stop form submit
        console.log(this.state.showData.username +' '+ this.state.showData.password);
        if(this.state.showData.username && this.state.showData.password){
            PostData('/nz_rest_api_slim/login', this.state.showData).then((result) => {
                let responseJson = result;
                console.log(responseJson);
                if(responseJson.userData){
                    sessionStorage.setItem('userData',JSON.stringify(responseJson));
                    this.setState({redirect: true});
                }
            });
        }
    };

    render (){
        if (this.state.redirect || sessionStorage.getItem('userData')){
            return (<Redirect to={'/offers'}/>)
        }
        return (
            <Form >
                <Form.Field width={4}>
                    <label>Login/email</label>
                    <input type='text' name='username' value={this.state.showData.username} onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field width={4}>
                    <label>Heslo</label>
                    <input type='password' name='password' value={this.state.showData.password} onChange={this.handleChange}/>
                </Form.Field>
                <Button type='submit' onClick={this.login} >Přihlásit</Button>
            </Form>
        )
    }
}

export default Login;
