import React, {Component} from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
/*
export const DelConfirm = (bodyText ) => (
    <Modal trigger={<Button>Basic Modal</Button>} basic size='small'>
        <Header icon='archive' content='Potvrzení' />
        <Modal.Content>
            <p>
                {bodyText}
            </p>
        </Modal.Content>
        <Modal.Actions>
            <Button basic color='red' inverted>
                <Icon name='remove' /> Ano
            </Button>
            <Button color='green' inverted>
                <Icon name='checkmark' /> Ne
            </Button>
        </Modal.Actions>
    </Modal>
)*/

export class DelConfirm extends Component{

    constructor(props){
        super(props);
    };

    onClose = () => {
        this.props.onClose();
    }

    onNo = () => {
        this.props.onClose();
    }

    render() {
        if(this.props.visible){
            console.log(this.props.visible + this.props.confText);
        }
        //onClose={this.onClose}
        return(
            <Modal open={this.props.visible} basic size='small'  >
                <Header icon='archive' content='Potvrzení odstranění' />
                <Modal.Content>
                    <p>
                        {this.props.confText}
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inverted onClick={this.props.onYes}>
                        <Icon name='trash' /> Ano
                    </Button>
                    <Button color='green' inverted onClick={this.onNo}>
                        <Icon name='cancel' /> Ne
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}


