import React, {Component} from 'react';
import { Button,Icon, Table} from 'semantic-ui-react'
import {PHP_url} from './../../PHP_Connector';
import  MyMessage from '../MyMessage';
import {decodeOptionValue, getFormatDate} from '../validation';
import {optionYesNo} from "../constants";
import {DelConfirm} from '../common/Confirmation';
import _ from 'lodash';

export default class OrdersDetailTSOverview extends Component {

    constructor(props){
        super(props);
        this.tabItems = this.tabItems.bind(this);
        let sumTasks = [];
        let i = 0;
        let counter = 0;
        let item;
        for (i in props.tasks){
            counter++;
            item = {
                id: counter,
                type: 'ST',
                date: props.tasks[i]['taskdate'],
                desc: props.tasks[i]['taskdesc'],
                finished: props.tasks[i]['invoice'],
                price: props.tasks[i]['price'],
            }
            sumTasks.push(item);
        };
        for (i in props.centTasks){
            counter++;
            item = {
                id: counter,
                type: 'Uk',
                date: props.centTasks[i]['taskdate'],
                desc: props.centTasks[i]['taskcentdesc'],
                finished: props.centTasks[i]['finished'],
                center: props.centTasks[i]['idcenter'],
            }
            sumTasks.push(item);
        };
        for (i in props.subsDetail){
            counter++;
            item = {
                id: counter,
                type: 'Su',
                date: props.subsDetail[i]['taskdate'],
                desc: props.subsDetail[i]['name'],
                finished: props.subsDetail[i]['invoice'],
                price: props.subsDetail[i]['price'],
            }
            sumTasks.push(item);
        };
        this.state = {sumTasks: _.orderBy(sumTasks, 'date')}
    };

    tabItems(item, i){
        //subky modře,  úkoly bílé, smluvní termíny zeleně
        let today = new Date();
        let todayW = new Date();
        todayW.setDate(todayW.getDate() + 7);
        let taskDate = new Date(item.date);
        let flg_warning = false;
        let flg_negative = false;
        let rowStyle = '';
        let cellStyle = '';

        if (item.type === 'ST'){
            rowStyle = 'row_ST';
        }else if (item.type === 'Su'){
            rowStyle = 'row_Su';
        }else if (item.type === 'Uk'){
            rowStyle = 'row_Uk';
        };
        cellStyle = 'bg-ok';
        if (item.finished !== 'true') {
            if (taskDate  < today){
                flg_negative = true;
                cellStyle = 'bg-danger text-white';
            }else if (taskDate < todayW){
                flg_warning = true;
                cellStyle = 'bg-warning';
            }
        }
        return(
            <Table.Row key={item.counter} className={rowStyle}>
                <Table.Cell className={cellStyle}>{getFormatDate(item.date)}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.desc}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
                <Table.Cell>{item.center}</Table.Cell>
                <Table.Cell>{decodeOptionValue(item.finished, optionYesNo)}</Table.Cell>
            </Table.Row>
        )
    }

    render() {
        return (
            <div style={{paddingTop:'1em'}}>
                <Table celled fixed={true} compact={true} selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={2}>Datum</Table.HeaderCell>
                            <Table.HeaderCell width={1}>Typ</Table.HeaderCell>
                            <Table.HeaderCell>Popis</Table.HeaderCell>
                            <Table.HeaderCell>Cena</Table.HeaderCell>
                            <Table.HeaderCell>Středisko</Table.HeaderCell>
                            <Table.HeaderCell>Dokončeno</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.sumTasks.map(this.tabItems)}
                    </Table.Body>

                </Table>
            </div>
        )
    }
}



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

