import React, {Component} from 'react';
import { Button, Checkbox, Icon, Table, Pagination, Modal, Header, Input, Form, Segment, Select, Dropdown } from 'semantic-ui-react'

//import PropTypes from 'prop-types';
//import { compose } from 'redux';
//import { Field, reduxForm } from 'redux-form';

//import semanticFormField from '../semantic-ui-form';
//import { required, number, email } from '../validation';
import _ from 'lodash';

class CustomerDetail extends Component {

    texts = {
        detail: 'Detail subjektu',
    };

    constructor(props){
        super(props);
        this.state = {
            file:null,
            showData: {ico: '', name: '', profession: ''},
            newItem: false,
            saved: false
        };
        this.closeEdit = this.closeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

    onSubmit = (e) => {
        e.preventDefault(); // Stop form submit
        let fetchUrl = '';
        if (this.state.newItem === true){
            fetchUrl = 'http://localhost/nz_rest_api_slim/customers/create';
        }else{
            fetchUrl = 'http://localhost/nz_rest_api_slim/customers';
        }

        fetch(fetchUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(this.state.showData),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 0){
                console.log(res.toString());
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
                            <label>IČO</label>
                            <input placeholder='IČO' name='ico' value={this.state.showData.ico} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Název</label>
                            <input placeholder='Název' name='name' value={this.state.showData.name} onChange={ this.handleChange }/>
                        </Form.Field>
                        <Form.Field>
                            <label>Profese</label>
                            <input placeholder='Profese' name = 'profession' value={this.state.showData.profession} onChange={ this.handleChange }/>
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

//                        <Field name="ico" component={semanticFormField} as={Form.Input} type="text" label="IČO" placeholder="IČO" validate={required} />

/*
CustomerDetail.propTypes = {
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    onSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool
};

export default compose(
    reduxForm({
        form: 'CustomerDetail',
        enableReinitialize: true
    })
)(CustomerDetail);
*/

export default CustomerDetail;


