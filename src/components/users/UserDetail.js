import React, {Component} from 'react';
import { Button, Modal, Form } from 'semantic-ui-react'
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';

class UserDetail extends Component {

    texts = {
        detail: 'Detail uživatele',
    };

    constructor(props){
        super(props);
        this.state = {
            file:null,
            showData: {username: '', email: '', password: '', firstname: '', lastname: ''},
            newItem: false,
            saved: false,
            errorText: ''
        };
        this.closeEdit = this.closeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    };

    componentWillReceiveProps(nextProps){
        this.setState({
                showData: nextProps.showData,
                newItem: nextProps.newItem,
                errorText: "",
            },
        );
    }

    handleChange = (e) => {
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
        this.setState({ showData: newState });
    };

    onFileChange(e) {
        this.setState({file: e.target.files[0]})
    }

    onSubmit = (e) => {
        e.preventDefault(); // Stop form submit
        let fetchUrl = '';
        this.setState({ isLoading: true });
        if (this.state.newItem === true){
            fetchUrl = PHP_url+'/nz_rest_api_slim/users/create';
        }else{
            fetchUrl = PHP_url+'/nz_rest_api_slim/users';
        }

        this.setState({ errorText: "" });
        fetch(fetchUrl, {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(this.state.showData),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            this.setState({ isLoading: false });
            if (response.status === 200){
                this.setState({ saved: true });
                this.closeEdit();
            }else {
                return response.text().then(text => {
                    if (text === ""){
                        throw new Error(response.statusText);
                    }else {
                        throw new Error(text);
                    }
                })
            }
        }).catch(err => {
            this.setState({ isLoading: false });
            console.log(err.toString())
            this.setState({ errorText: err.toString() });
        });
    };


    closeEdit(){
        this.props.onClose(this.state.showData, this.state.saved);
    }

    render() {
        return (
            <div>
            <Modal size={'small'}
                   open={this.props.showModal}
                   onClose={this.closeEdit.bind(this)}
                   closeOnEscape={true}
                   closeOnRootNodeClick={false}>
                <Modal.Header>{this.texts.detail}</Modal.Header>
                <Modal.Content>
                    <MyMessage errText={this.state.errorText} isLoading = {this.state.isLoading}/>
                    <Form>
                        <Form.Field required>
                            <label>Login</label>
                            <input placeholder='Login' name='username' value={this.state.showData.username} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Email</label>
                            <input placeholder='Email' name='email' value={this.state.showData.email} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field>
                            <label>Jméno</label>
                            <input placeholder='Jméno' name = 'firstname' value={this.state.showData.firstname} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field>
                            <label>Příjmení</label>
                            <input placeholder='Příjmení' name = 'lastname' value={this.state.showData.lastname} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field>
                            <label>Heslo</label>
                            <input name = 'password' type='password' value={this.state.showData.password} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                        <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>
                    </Form>
                </Modal.Content>
            </Modal>
            </div>
        )
    }
}

export default UserDetail;


