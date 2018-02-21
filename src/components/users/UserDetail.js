import React, {Component} from 'react';
import { Button, Modal, Form } from 'semantic-ui-react'
//import _ from 'lodash';

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
            saved: false
        };
        this.closeEdit = this.closeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    };

    componentWillReceiveProps(nextProps){
        this.setState({
                showData: nextProps.showData,
                newItem: nextProps.newItem,
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
        if (this.state.newItem === true){
            fetchUrl = 'http://localhost/nz_rest_api_slim/users/create';
        }else{
            fetchUrl = 'http://localhost/nz_rest_api_slim/users';
        }

        fetch(fetchUrl, {
            method: 'POST',
            //mode: 'no-cors',
            body: JSON.stringify(this.state.showData),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (response.status === 200){
                this.setState({ saved: true });
                this.closeEdit();
            }
        }).catch(err => {
            console.log(err.toString())
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
                            <input name = 'password' value={this.state.showData.password} onChange={ this.handleChange }/>
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


