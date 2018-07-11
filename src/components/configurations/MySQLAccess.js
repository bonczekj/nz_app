import React, {Component} from 'react';
import {Form, Button, Segment, Header} from 'semantic-ui-react'
import {PostData} from './../../PHP_Connector';
import {Redirect} from 'react-router-dom';
import {myFetch, PHP_url} from "../../PHP_Connector";
import  MyMessage from '../MyMessage';
import  AuthService from '../AuthService';

export default class MySQLAccess extends Component {

    constructor(props){
        super(props);
        this.auth = new AuthService();

        this.changePassword = this.changePassword.bind(this);

        this.state = {
            host: '',
            dbname: '',
            pass: '',
            pass1: '',
            showData: {host: '', dbname: '', user: '', pass: '', pass1: ''},
            logged: false,
            isLoading: false,
            error: null,
            errorText: '',
            infoText: '',
        };

        this.setState({ isLoading: true });
        //fetch(PHP_url+'/nz_rest_api_slim/documents', {
        fetch(PHP_url+'/nz_rest_api_slim/configuration/getdb', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then((response)  => {
            if (response.status === 200){
                return response.json();
            }
        }).then(json => {
            this.setState({showData : json});
            this.setState({ isLoading: false });
        }).catch(error => {
            this.setState({ error, isLoading: false });
            console.log("error")
        });
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

    componentDidMount(){
    };

    handleChange = (e) => {
        //this.setState({[e.target.name]: e.target.value})
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
        this.setState({ showData: newState });
    };

    changePassword = (e) => {
        e.preventDefault(); // Stop form submit
        if ((this.state.showData.pass) && (this.state.showData.pass === this.state.showData.pass1)){
            myFetch( 'POST', '/nz_rest_api_slim/configuration/setdb', this.state.showData).then(
                result => this.fetchOK(result),
                error => this.fetchERR(error)
            )
        }
    };

    fetchOK(result){
        this.setState({errorText: ''});
        this.setState({infoText: 'Nastavení bylo změněno'});
    };

    fetchERR(error){
        this.setState({errorText: error.toString()});
    };


    render (){
        /*if (this.state.logged !== true ){
            return(<Redirect to={"/login"}/>);
        }*/

        return (
            <div align="center">
                <Segment textAlign='center'>
                    <Header as='h1'>Nastavení databáze</Header>
                </Segment>
            <Form>
                <MyMessage errText={this.state.errorText} infoText={this.state.infoText} isLoading={this.state.isLoading}/>
                <Form.Field inline width={8}>
                    <label>Databázový server</label>
                    <input type='text' name='host' value={this.state.showData.host} onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field inline width={8}>
                    <label>Název databáze</label>
                    <input type='text' name='dbname' value={this.state.showData.dbname} onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field inline width={8}>
                    <label>Uživatel</label>
                    <input type='text' name='user' value={this.state.showData.user} onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field inline width={8}>
                    <label>Heslo</label>
                    <input type='password' name='pass' value={this.state.showData.pass} onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field inline width={8}>
                    <label>Potvrzení hesla</label>
                    <input type='password' name='pass1' value={this.state.showData.pass1} onChange={this.handleChange}/>
                </Form.Field>
                <Button type='submit' onClick={this.changePassword}>Změnit nastavení</Button>
            </Form>
            </div>
        )
    }
}


