import React, {Component} from 'react';
import { Button,Icon, Table} from 'semantic-ui-react'
import TaskDetail from '../Orders/TaskDetail';
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';

class OrdersDetailTasks extends Component {

    constructor(props){
        super(props);
        this.tabItems = this.tabItems.bind(this);
        this.state = {
            showModal: false,
            newItem: false,
            showData: {idorder: '', idtask: '', taskdate: '', taskdesc: '', finished: ''},
            saved: false,
        }
    };

    texts = {
        newItem: 'Nový termín',
    };

/*    componentWillReceiveProps(nextProps){
        this.setState({
                typeRS: nextProps.typeRS,
                shortVersion: nextProps.shortVersion,
            },
        );
    }*/


    deleteTask = (item) => {
        this.props.deleteTask(item)
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

    onSubmitTask = (e, item) => {
        //e.preventDefault(); // Stop form submit
        this.props.onSubmitTask(e, item);
        this.setState({showModal: false});
    }

    tabItems(item, i){
        return(
            <Table.Row key={item.idtask}>
                <Table.Cell>{item.taskdate}</Table.Cell>
                <Table.Cell>{item.taskdesc}</Table.Cell>
                <Table.Cell>{item.finished}</Table.Cell>
            </Table.Row>
        )
    }
/*

                <Table.Cell>
                    <Icon link name='trash' onClick={this.props.deleteTask.bind(this, item)}/>
                </Table.Cell>

 */


    render() {
        return (
            <div style={{paddingTop:'1em'}}>
                <Table celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Termín</Table.HeaderCell>
                            <Table.HeaderCell>Popis</Table.HeaderCell>
                            <Table.HeaderCell>Dokončeno</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.props.tasks.map(this.tabItems)}
                    </Table.Body>

                    <Table.Footer fullWidth >
                        <Table.Row >
                            <Table.HeaderCell colSpan='4' >
                                <Button icon labelPosition='left' positive size='small' onClick={this.newItem}>
                                    <Icon name='file' /> {this.texts.newItem}
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <TaskDetail
                    showData={this.state.showData}
                    showModal={this.state.showModal}
                    newItem={this.state.newItem}
                    onSubmit={this.onSubmitTask}
                    onClose={this.closeEdit}/>
            </div>
        )
    }
}

export default OrdersDetailTasks;

/*
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

