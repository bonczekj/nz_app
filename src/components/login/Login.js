import React, {Component} from 'react';
import {Form, Button, Grid, Header, Image, Segment} from 'semantic-ui-react'
import {PostData} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';
import {myFetch} from "../../PHP_Connector";
import  MyMessage from '../MyMessage';
import  AuthService from '../AuthService';

export default class Login extends Component {

    constructor(props){
        super(props);
        this.auth = new AuthService();
        this.state = {
            username: '',
            password: '',
            showData: {username: '', password: ''},
            loggedIn: false,
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
        let loggedIn = this.auth.login(this.state.showData.username, this.state.showData.password, this.loginOK, this.loginFailed);

        /*console.log(this.state.showData.username +' '+ this.state.showData.password);
        if(this.state.showData.username && this.state.showData.password){
            myFetch( 'POST', '/nz_rest_api_slim/login', this.state.showData).then(
                result => this.fetchOK(result),
                error => this.fetchERR(error)
            )
        }*/
    };

    loginOK = () => {
        this.setState({loggedIn: this.auth.isLoggedIn()});
    }
    loginFailed = (error) => {
        this.setState({errorText: error});
    }

    /*fetchOK(result){
        let responseJson = result;
        console.log(responseJson);
        if(responseJson.userData){
            sessionStorage.setItem('userData',JSON.stringify(responseJson));
            this.setState({redirect: true});
        }
        console.log('FETCH response');
        //console.log(response.json());
    };
    fetchERR(error){
        this.setState({errorText: error.toString()});
        console.log("FETCH error")
    }*/

    render (){
        //if (this.state.redirect || sessionStorage.getItem('userData')){
        if (this.state.loggedIn || this.auth.isLoggedIn() ){
            return (<Redirect to={'/start'}/>)
        }
        return (

            <div className='login-form'>
                <style>{
                 `body > div,
                  body > div > div,
                  body > div > div > div.login-form {
                    height: 100%;
                  }`
                }</style>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='blue' textAlign='center'>
                             Přihlášení do systému
                        </Header>
                        <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                        <Form size='large'>
                            <Segment stacked>
                                <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail' name='username' value={this.state.showData.username} onChange={this.handleChange}/>
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Heslo'
                                    type='password'
                                    name='password'
                                    value={this.state.showData.password}
                                    onChange={this.handleChange}
                                />

                                <Button color='blue' fluid size='large' type='submit' onClick={this.login}>
                                     Přihlásit
                                </Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}


/*
<Image src='/logo.png' />
            <div align="center">
            <Form >
                <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                <Form.Field inline width={4}>
                    <label>E-mail</label>
                    <input type='text' name='username' value={this.state.showData.username} onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field inline width={4}>
                    <label>Heslo</label>
                    <input type='password' name='password' value={this.state.showData.password} onChange={this.handleChange}/>
                </Form.Field>
                <Button type='submit' onClick={this.login} >Přihlásit</Button>
            </Form>
            </div>


 */