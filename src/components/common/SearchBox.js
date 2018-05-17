import React, {Component} from 'react';
import { Message, Icon} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import MyMessage from "../MyMessage";
import { Button, Input, Form } from 'semantic-ui-react'

class SearchBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Form >
                <Form.Group>
                    <Form.Input  placeholder='Vyhledat...' name='search' value={this.props.search} onChange={this.props.handleChange} />
                    <Button icon={'search'} onClick={this.props.handleSearch} />
                </Form.Group>
            </Form>
        )
    }
}

SearchBox.propTypes = {
    errText:    PropTypes.string,
    infoText:   PropTypes.string,
    isLoading:  PropTypes.bool,
};

export default SearchBox;

