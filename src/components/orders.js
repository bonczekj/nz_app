import React, {Component} from 'react';
import ReactDOM from 'react-dom'

class Modal extends Component {
    constructor(props){
        super(props);
    };
    render() {
        return this.props.open ? (
            <div>
                <div className="modal-background" />
                <div role="dialog" className="modal-dialog">
                    <header>
                        <span>{this.props.header}</span>
                        <button
                            onClick={() => this.props.onClose()}
                            type="button"
                            aria-label="close"
                        >
                            CLOSE
                        </button>
                    </header>
                    <div className="modal-content">{this.props.children}</div>
                </div>
            </div>
        ) : null
    }
}
class Portal extends React.Component {
    constructor(props) {
        super(props)

        this.rootSelector = document.getElementById('root-modal')
        this.container = document.createElement('div')
    }

    componentDidMount() {
        this.rootSelector.appendChild(this.container)
    }

    componentWillUnmount() {
        this.rootSelector.removeChild(this.container)
    }

    render() {
        return ReactDOM.createPortal(<Modal {...this.props} />, this.container)
    }
}

class Orders extends Component {
    state = {
        showModal: false,
        showSidebar: false,
        showPortal: false
    }

    render() {
        const { showModal, showSidebar, showPortal } = this.state

        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div>
                    <button
                        className="toggle-sidebar btn"
                        onClick={() => this.setState({ showSidebar: !showSidebar })}
                    >
                        Toggle Sidebar
                    </button>
                </div>
                <div className={showSidebar ? 'sidebar hide' : 'sidebar'}>
                    <button
                        className="btn show-modal"
                        onClick={() =>
                            this.setState({
                                showModal: !showModal
                            })}
                    >
                        Show Modal
                    </button>

                    <button
                        className="btn show-portal"
                        onClick={() =>
                            this.setState({
                                showPortal: !showPortal
                            })}
                    >
                        Show Portal
                    </button>

                    <Modal
                        open={showModal}
                        header="My Modal"
                        onClose={() =>
                            this.setState({
                                showModal: false
                            })}
                    >
                        <h1>Some Content</h1>
                    </Modal>

                    <Portal
                        open={showPortal}
                        header="My Portal Modal"
                        onClose={() =>
                            this.setState({
                                showPortal: false
                            })}
                    >
                        <h1>Some Portal Content</h1>
                    </Portal>
                </div>
            </div>
        )
    }
}

export default Orders;


/*
class Orders extends Component {
    render() {
        return (
            <div class="container" >
                <p>Správa zakázek</p>
            </div>
        );
    }
}

export default Orders;
*/