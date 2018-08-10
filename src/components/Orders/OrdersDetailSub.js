import React, {Component} from 'react';
import { Button,Icon, Table} from 'semantic-ui-react'
import OrdersDetailSubDetail from '../Orders/OrdersDetailSubDetail';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import {decodeOptionValue, getFormatDate, checkTechRole, checkSalesRole} from '../validation';
import {optionYesNo} from "../constants";
import {DelConfirm} from '../common/Confirmation';

class OrdersDetailSub extends Component {

    constructor(props){
        super(props);
        this.tabItems = this.tabItems.bind(this);
        this.state = {
            showModal: false,
            showConfS: false,
            newItem: false,
            showData: {idorder: '', idsub: '', idsubdetail: '', ico: '', name: '', taskdate: '', price: 0, finished: '', invoice: false},
            subsDetail: [],
            saved: false,
            item:[],
        }
    };

    texts = {
        newItem: 'Nová subdodávka',
    };

/*    componentWillReceiveProps(nextProps){
        this.setState({
                showConf: false,
            });
    }*/


    deleteItem = () => {
        this.setState({ showConfS: false, errorText: "" });
        this.props.deleteSub(this.state.item)
    }

    deleteItemConf = (item) => {
        this.setState({
            showConfS: true,
            item: item
        });
        this.setState({
            showConfS: true,
        });
    }

    closeConf = () => {
        this.setState({showConf: false});
    }

    closeEdit = (item, saved) => {
        this.setState({showModal: false});
    }

    editItem = (item) => {
        this.setState({
            showModal: true,
            newItem: false,
            showData: item
        });
    }

    newItem = () => {
        this.setState({
            showModal: true,
            newItem: true,
            showData: []
        });
    }

    onSubmitSub = (e, item) => {
        this.props.onSubmitSub(e, item);
        this.setState({showModal: false});
    }

    onSubmitSubDetail = (e, item) => {
        this.props.onSubmitSubDetail(e, item);
        this.setState({showModal: false});
    }

    tabItems(item, i){
        //console.log(item.idsubdetail);
        return(
            <Table.Row key={item.idsubdetail}>
                <Table.Cell>
                    <Icon link name='edit' onClick={this.editItem.bind(this, item)}/>
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{checkSalesRole() ? new Intl.NumberFormat('cs-CS').format(item.price) : 0}</Table.Cell>
                <Table.Cell>{getFormatDate(item.taskdate)}</Table.Cell>
                <Table.Cell>{decodeOptionValue(item.invoice, optionYesNo)}</Table.Cell>
                <Table.Cell>{getFormatDate(item.finished)}</Table.Cell>
                <Table.Cell>{item.mobil}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>
                    <Icon link name='trash' onClick={this.deleteItemConf.bind(this, item)}/>
                </Table.Cell>
            </Table.Row>
        )
    }
//<Table.Cell>{getFormatDate(item.taskdate)}</Table.Cell>
//<Table.Cell>{getFormatDate(item.finished)}</Table.Cell>
//<Table.Cell>{decodeOptionValue(item.invoice, optionYesNo)}</Table.Cell>

    render() {
        return (
            <div style={{paddingTop:'1em'}}>
                <MyMessage errText={this.state.errorText} infoText={this.state.infoText} isLoading = {this.state.isLoading}/>
                <Table celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell width={3}>Subdodavatel</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Cena</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Termín</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Fakt.</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Dok.</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Tel.</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Email</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.props.subsDetail.map(this.tabItems)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell colSpan='9' >
                                <Button icon labelPosition='left' positive size='small' onClick={this.newItem} disabled={this.props.showData.id === undefined}>
                                    <Icon name='file' /> {this.texts.newItem}
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <OrdersDetailSubDetail
                    showData={this.state.showData}
                    subsDetail={this.props.subsDetail}
                    showModal={this.state.showModal}
                    newItem={this.state.newItem}
                    subContractors={this.props.subContractors}
                    onSubmit={this.onSubmitSub}
                    onSubmitSubDetail={this.onSubmitSubDetail}
                    onClose={this.closeEdit}
                />
                <DelConfirm visible={this.state.showConfS}
                            confText={'Chcete odstranit celou subdodávku?'}
                            onYes={this.deleteItem}
                            onNo={() => {this.setState({showConfS: false});}}
                            onClose={() => {this.setState({showConfS: false});}}
                />
            </div>
        )
    }
}

export default OrdersDetailSub;

/*

                            <Table.HeaderCell>Termín</Table.HeaderCell>

                        {this.state.documents.slice((this.state.activePage - 1) * this.state.rowsPerPage, (this.state.activePage - 1) * this.state.rowsPerPage + this.state.rowsPerPage).map(this.items)}


                <Form.Group inline>
                    <Form.Field control={Input} label='Nabídka' placeholder='Nabídka' name='id' value={this.props.showData.id} width={3} onChange={this.props.handleChange} />
                    <Form.Field control={Input} label='Název' placeholder='Název akce' name='name' value={this.state.showData.name} width={10} onChange={this.handleChange }/>
                </Form.Group>
                <Form.Field control={Input} label='Investor' placeholder='Investor' name= 'customer' value={this.state.showData.customer} onChange={this.handleChange}/>
                <Form.Group inline >
                    <Form.Field control={Input} label='Termín podání' placeholder='Termín podání' name='processdate' value={this.state.showData.processdate} onChange={this.handleChange}/>
                    <Form.Field control={Input} label='Hodina' placeholder='Hodina' name='processtime' value={this.state.showData.processtime} onChange={this.handleChange}/>
                    <Form.Field control={Select} options={optionDeliveryType} label='Způsob podání' placeholder='Způsob podání' name = 'deliverytype' value={this.state.showData.deliverytype} onChange={this.handleChangeDD}/>
                    <Form.Field control={Select} options={optionYesNo} label='Pochůzka' placeholder='Pochůzka' name='errand' value={this.state.showData.errand} onChange={this.handleChangeDD }/>
                </Form.Group>
                <Form.Group inline >
                    <Form.Field control={Input} label='Cena' placeholder='Cena' name='price' value={this.state.showData.price} onChange={this.handleChange}/>
                    <Form.Field control={Input} label='Výtězná cena' placeholder='Vítězní cena' name='winprice' value={this.state.showData.winprice} onChange={this.handleChange}/>
                </Form.Group>



                <Button type='submit' onClick={this.onSubmit.bind(this)}>Uložit</Button>
                <Button type='cancel' onClick={this.closeEdit}>Zrušit</Button>

 */

