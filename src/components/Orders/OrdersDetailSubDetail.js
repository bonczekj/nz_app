import React, {Component} from 'react';
import {Button, Modal, Form, Dropdown, Select, Input} from 'semantic-ui-react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import 'react-datepicker/dist/react-datepicker.css';
import {optionYesNo} from "../constants";
import {getSubContractors, subContractorsOption} from "../common/SubContractors";

class OrdersDetailSubDetail extends Component {

    texts = {
        detail: 'Detail subdodávky',
    };

    constructor(props){
        super(props);
        this.state = {
            showData: {idorder: '', idsub: '', ico: '', name: '', taskdate: '', price: 0, finished: '', invoice: false},
            taskdateNumber: '',
            finishedNumber: '',
            newItem: false,
            saved: false,
        }
        this.closeEdit = this.closeEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    };

    componentWillReceiveProps(nextProps){
        this.setState({
                showData: nextProps.showData,
                newItem: nextProps.newItem,
                taskdateNumber: 0,
                finishedNumber: 0,
            },
        );
        if (nextProps.showData.taskdate !== null){
            this.setState({ taskdateNumber: moment(nextProps.showData.taskdate) });
        }
        if (nextProps.showData.finished !== null){
            this.setState({ finishedNumber: moment(nextProps.showData.finished) });
        }
    }

    handleChange = (e) => {
        const newState = {...this.state.showData, [e.target.name]: e.target.value};
        this.setState({ showData: newState });
    }

    handleChangeDate = (date) => {
        const selDate = moment(date).format('YYYY-MM-DD');
        const newState = {...this.state.showData, ['taskdate']: selDate};
        this.setState({ showData: newState });
        this.setState({ taskdateNumber: date });
    }

    handleChangeDateF = (date) => {
        const selDate = moment(date).format('YYYY-MM-DD');
        const newState = {...this.state.showData, ['finished']: selDate};
        this.setState({ showData: newState });
        this.setState({ finishedNumber: date });
    }

    handleChangeDD = (e, { name, value }) => {
        const newState = {...this.state.showData, [name]: value};
        this.setState({ showData: newState });
    }

     onSubmit = (e) => {
        this.props.onSubmit(e, this.state.showData);
    }

    closeEdit(){
        this.props.onClose(this.state.showData);
    };


    render() {
        //let SubContractors = [ { key: '1', text: 'první', value: 'první'}, { key: '2', text: 'druhá', value: 'druhá' }  ];
        //var SubContractors = subContractorsOption();
        console.log(this.props.subContractors);
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
                            <Form.Field control={Select} required search options={this.props.subContractors} label='Subdodavatel' name='ico' value={this.state.showData.ico} onChange={this.handleChangeDD } />
                            <Form.Field control={Input} readOnly label="IČ" placeholder='IČ Subdodavatele' name='ico' value={this.state.showData.ico} onChange={ this.handleChange } />
                            <Form.Field>
                                <label>Termín</label>
                                <DatePicker
                                    dateFormat="DD.MM.YYYY"
                                    selected={this.state.taskdateNumber}
                                    onChange={this.handleChangeDate}
                                />
                            </Form.Field>
                            <Form.Field control={Input} label="Cena" placeholder='' type='number' name='price' value={this.state.showData.price} onChange={ this.handleChange } width={3} />
                            <Form.Field control={Select} options={optionYesNo} label='Fakturace' name='invoice' value={this.state.showData.invoice} onChange={this.handleChangeDD } />
                            <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                            <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>
        )
    }
}

/*

                            <Form.Field>
                                <label>Dokončeno</label>
                                <DatePicker
                                    dateFormat="DD.MM.YYYY"
                                    selected={this.state.finishedNumber}
                                    onChange={this.handleChangeDateF}
                                />
                            </Form.Field>


                             <input placeholder='Typ' name='type' value={this.state.showData.type} onChange={ this.handleChange }/>

* */
export default OrdersDetailSubDetail;


