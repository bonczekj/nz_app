import React, {Component} from 'react';
import {Button, Modal, Form, Dropdown, Select, Input, Table, Icon} from 'semantic-ui-react'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import {optionYesNo} from "../constants";
import {getSubContractors, subContractorsOption} from "../common/SubContractors";
import {decodeOptionValue, getFormatDate} from '../validation';
import {DelConfirm} from '../common/Confirmation';


//import 'react-datepicker/dist/react-datepicker.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/cs';
import OrdersDetailSubDetailEdit from "./OrdersDetailSubDetailEdit";

export default class OrdersDetailSubDetail extends Component {

    texts = {
        detail: 'Detail subdodávky',
        newItem: 'Nová'
    };

    constructor(props){
        super(props);
        this.tabItems = this.tabItems.bind(this);
        this.state = {
            showData: {idorder: '', idsub: '', ico: '', name: '', taskdate: '', price: 0, finished: '', invoice: false},
            showModal: false,
            showConfSD: false,
            taskdateNumber: '',
            finishedNumber: '',
            subsDetail: [],
            newItem: false,
            saved: false,
            item:[],
        }
        this.closeEdit = this.closeEdit.bind(this);
        this.closeEditM = this.closeEditM.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    };

    componentWillReceiveProps(nextProps){
        let subDetail = nextProps.subsDetail.filter(c => c.idsub == nextProps.showData.idsub);

        this.setState({
                showData: nextProps.showData,
                showConfSD: false,
                subsDetail: subDetail,
                newItem: nextProps.newItem,
                taskdateNumber: 0,
                finishedNumber: 0,
                showConf: false,
                item:[],
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

    closeEditM(){
        this.setState({showModal: false});
    };

    closeEdit(){
        this.props.onClose(this.state.showData);
    };

    editItemSD = (item) => {
        this.setState({
            showModal: true,
            newItem: false,
            showData: item
        });
    }


    deleteItem = () => {
        let item = this.state.item;
        this.setState({ showConfSD: false, errorText: "" });
        this.props.deleteSubDetail(item)
    }

    deleteItemConf = (item) => {
        this.setState({
            showConfSD: true,
            item: item
        });
    }

    newItem = () => {
        let showData = [];
        showData['idsub'] = this.state.showData.idsub;
        this.setState({
            showModal: true,
            newItem: true,
            showData: showData,
        });
    };


    onSubmit = (e) => {
        //const newState = {...this.state.showData, ['idsub']: value};
        //this.setState({ showData: newState });
        this.props.onSubmit(e, this.state.showData);
    }

    onSubmitSubDetail = (e, item) => {
        if (!item.idsub){
            this.props.onSubmit(e, this.state.showData);
        }

        this.props.onSubmitSubDetail(e, item);
        this.setState({showModal: false});
    };

    tabItems(item, i){
        return(
            <Table.Row key={item.idsubdetail}>
                <Table.Cell>{new Intl.NumberFormat('cs-CS').format(item.price)}</Table.Cell>
                <Table.Cell>{getFormatDate(item.taskdate)}</Table.Cell>
                <Table.Cell>{getFormatDate(item.finished)}</Table.Cell>
                <Table.Cell>{decodeOptionValue(item.invoice, optionYesNo)}</Table.Cell>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItemSD.bind(this, item)}/>
                    {'   '}
                    <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                </Table.Cell>
            </Table.Row>
        )
    }


    render() {
        //console.log(this.state.showData.finished);
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
                            <Table celled fixed={true} compact={true} selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Termín</Table.HeaderCell>
                                        <Table.HeaderCell>Cena</Table.HeaderCell>
                                        <Table.HeaderCell>Dokončeno</Table.HeaderCell>
                                        <Table.HeaderCell>Fakturace</Table.HeaderCell>
                                        <Table.HeaderCell />
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.state.subsDetail.map(this.tabItems)}
                                </Table.Body>

                                <Table.Footer fullWidth >
                                    <Table.Row >
                                        <Table.HeaderCell colSpan='5' >
                                            <Button icon labelPosition='left' positive size='small' onClick={this.newItem}>
                                                <Icon name='file' /> {this.texts.newItem}
                                            </Button>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>

                            <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                            <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
                <OrdersDetailSubDetailEdit
                    showData={this.state.showData}
                    showModal={this.state.showModal}
                    newItem={this.state.newItem}
                    onSubmitSubDetail={this.onSubmitSubDetail}
                    onClose={this.closeEditM}
                />
                <DelConfirm visible={this.state.showConfSD}
                            confText={'Chcete odstranit detail subdodávky?'}
                            onYes={this.deleteItem}
                            onNo={() => {this.setState({showConfSD: false});}}
                            onClose={() => {this.setState({showConfSD: false});}}
                />
            </div>
        )
    }
}

/*

<Form.Field control={Input} readOnly label="IČ" placeholder='IČ Subdodavatele' name='ico' value={this.state.showData.ico} onChange={ this.handleChange } />

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


placeholder={`${formatDate(new Date(this.state.showData.finished), 'LL', 'cs')}`}

<DatePicker
                                    dateFormat="DD.MM.YYYY"
                                    selected={this.state.taskdateNumber}
                                    onChange={this.handleChangeDate}
                                />

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


