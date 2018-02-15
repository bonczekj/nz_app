import React from 'react';
import { Button, Checkbox, Icon, Table } from 'semantic-ui-react'
import {NavLink, Link} from "react-router-dom";

const Users = () => (
    <Table compact celled definition>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Registration Date</Table.HeaderCell>
                <Table.HeaderCell>E-mail address</Table.HeaderCell>
                <Table.HeaderCell>Premium Plan</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            <Table.Row>
                <Table.Cell>John Lilki</Table.Cell>
                <Table.Cell>September 14, 2013</Table.Cell>
                <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
                <Table.Cell>No</Table.Cell>
                <Table.Cell>
                    <Button basic compact={true} icon={'edit'} size='mini'>
                    </Button>
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Jamie Harington</Table.Cell>
                <Table.Cell>January 11, 2014</Table.Cell>
                <Table.Cell>jamieharingonton@yahoo.com</Table.Cell>
                <Table.Cell>Yes</Table.Cell>
                <Table.Cell><Icon link name='edit' /></Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Jill Lewis</Table.Cell>
                <Table.Cell>May 11, 2014</Table.Cell>
                <Table.Cell>jilsewris22@yahoo.com</Table.Cell>
                <Table.Cell>Yes</Table.Cell>
                <Table.Cell>
                    <Button basic icon={'edit'} size='mini'>
                    </Button>
                </Table.Cell>
            </Table.Row>
        </Table.Body>

        <Table.Footer fullWidth>
            <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan='4'>
                    <Button floated='right' icon labelPosition='left' primary size='small'>
                        <Icon as={NavLink} to="/offers" name='user' onClick={this.click}/> Add User
                    </Button>
                    <Button size='small'>Approve</Button>
                    <Button disabled size='small'>Approve All</Button>
                </Table.HeaderCell>
            </Table.Row>
        </Table.Footer>
    </Table>
);

export default Users;

/*
import React, {Component} from 'react';

class Users extends Component {
    render() {
        return (
            <div class="container" >
                <p>Správa uživatelů</p>
            </div>
        );
    }
}

export default Users;
*/