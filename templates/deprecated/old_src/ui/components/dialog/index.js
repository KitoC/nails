import React, {Component, Fragment} from 'react'
import './dialog.css'

class Dialog extends Component{
    state = {
        open: false
    }

    openDialog = () => {
        this.setState({
            open: true
        })
    }

    closeDialog = () => {
        this.setState({
            open: false
        })
    }

    render () {
        const {
            link,
            header,
            content
        } = this.props

        return (
            <Fragment>
                {this.state.open &&
                <Fragment>

                    <div className='dialog-backdrop'>
                        <div onClick={() => this.closeDialog()} className='clickable-backdrop'>
                        </div>

                        <div className="dialog-container">
                            <div className="dialog-header">
                                <div className="header-text">
                                    {header && header}
                                </div>
                                <div onClick={() => this.closeDialog()}  className="dialog-close">&#x2715;</div>
                            </div>
                            <div className="dialog-content">
                                {content && content(this.closeDialog)}
                            </div>
                        </div>
                    </div>
                </Fragment>
                }
                {link &&  link(this.openDialog)}
            </Fragment>
        )
    }
}

export default Dialog
