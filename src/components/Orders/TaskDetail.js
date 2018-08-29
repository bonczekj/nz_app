import React, {Component} from 'react';
import {Button, Modal, Form, Select} from 'semantic-ui-react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import  MyMessage from '../MyMessage';
import {optionYesNo} from "../constants";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/cs';


//import 'react-datepicker/dist/react-datepicker.css';
//import {formatDate, parseDate} from "react-day-picker/moment";
//import MomentLocaleUtils from "react-day-picker/moment";

class TaskDetail extends Component {

    texts = {
        detail: 'Detail termínu',
    };

    constructor(props){
        super(props);
        this.state = {
            showData: {idorder: '', idtask: '', taskdate: '', taskdesc: '', finished: '', price: 0, note: '', planinvdate: '', invoice: false },
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
        if (nextProps.newItem === true){
            this.setDefaultValues();
        }
    }

    setDefaultValues = () => {
        const newState = {...this.state.showData, ['invoice']: "false"};
        this.setState({ showData: newState });
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

    handleChangeDate = (date, name) => {
        const selDate = moment(date).format('YYYY-MM-DD');
        const newState = {...this.state.showData, [name]: selDate};
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

    closeEdit(e){
        e.preventDefault();
        this.props.onClose(this.state.showData);
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
                                <label>Popis</label>
                                <input placeholder='Popis' name='taskdesc' value={this.state.showData.taskdesc} onChange={ this.handleChange }/>
                            </Form.Field>
                            <Form.Group>
                                <Form.Field>
                                    <label>Termín</label>
                                    <DayPickerInput
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        onDayChange={(e)=>this.handleChangeDate(e,'taskdate')}
                                        value={moment(this.state.showData.taskdate).format('DD.MM.YYYY')}
                                        dayPickerProps={{
                                            locale: 'cs',
                                            localeUtils: MomentLocaleUtils,
                                        }}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Plánované datum fakturace</label>
                                    <DayPickerInput
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        onDayChange={(e)=>this.handleChangeDate(e,'planinvdate')}
                                        value={moment(this.state.showData.planinvdate).format('DD.MM.YYYY')}
                                        dayPickerProps={{
                                            locale: 'cs',
                                            localeUtils: MomentLocaleUtils,
                                        }}/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <label>Poznámka</label>
                                <input name='note' value={this.state.showData.note} onChange={ this.handleChange }/>
                            </Form.Field>
                            <Form.Group>
                                <Form.Field>
                                    <label>Cena</label>
                                    <input type='number' name='price' value={this.state.showData.price} onChange={ this.handleChange } width={3}/>
                                </Form.Field>
                                <Form.Field control={Select} options={optionYesNo} label='Fakturace' name='invoice' value={this.state.showData.invoice} onChange={this.handleChangeDD } />
                            </Form.Group>
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
export default TaskDetail;


