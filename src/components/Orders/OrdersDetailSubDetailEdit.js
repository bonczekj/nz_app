import React, {Component} from 'react';
import {Button, Modal, Form, Dropdown, Select, Input, Table, Icon} from 'semantic-ui-react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import {optionYesNo} from "../constants";
import {getSubContractors, subContractorsOption} from "../common/SubContractors";
import {decodeOptionValue, getFormatDate} from '../validation';

//import 'react-datepicker/dist/react-datepicker.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/cs';

class OrdersDetailSubDetailEdit extends Component {

    texts = {
        detail: 'Detail subdodávky',
    };

    constructor(props){
        super(props);
        this.state = {
            showData: {idorder: '', idsub: '', idsubdetail: '', taskdate: '', price: 0, finished: '', invoice: false},
            taskdateNumber: '',
            finishedNumber: '',
            subsDetail: [],
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
            //this.setState({ taskdateNumber: moment(nextProps.showData.taskdate) });
        }
        if (nextProps.showData.finished !== null){
            //this.setState({ finishedNumber: moment(nextProps.showData.finished) });
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

    handleDayChange(selectedDay, modifiers) {
        const newState = {...this.state.showData, ['taskdate']: selectedDay};
        this.setState({ showData: newState });
        this.setState({ taskdateNumber: selectedDay });
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
        this.props.onSubmitSubDetail(e, this.state.showData);
    }

    closeEdit(){
        this.props.onClose(this.state.showData);
        //this.setState({showModal: false});
    };

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
                            <Form.Field>
                                <label>Termín</label>
                                <DayPickerInput
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    onDayChange={this.handleChangeDate}
                                    value={moment(this.state.showData.taskdate).format('DD.MM.YYYY')}
                                    dayPickerProps={{
                                        locale: 'cs',
                                        localeUtils: MomentLocaleUtils,
                                    }}/>
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

* */
export default OrdersDetailSubDetailEdit;


