import React, {Component, Fragment} from 'react'
import './form.css'
import Button from '../buttons'

class Form extends Component{
    
    componentDidMount() {
        this.mapInputsToState()
    }

    mapInputsToState = () => {
        const {generateFields, prePopulate} = this.props

        generateFields.map(field => {
            this.setState({
                [field.name]: prePopulate ? prePopulate[field.name] : null
            }, () => console.log(this.state))
        })
    }

    handleChange = (e, fieldName) => {
        this.setState({
            [fieldName]: e.target.value
        }, () => console.log(this.state))

    }

    renderFields = () => {
        if (this.state) {
            return this.props.generateFields.map(field => {
                if (field.type === 'longText') {
                    return (
                        <div className="long-field">
                            <label className="label">{field.name}</label>
                            <textarea rows="4" value={this.state[field.name]} onChange={(e) => this.handleChange(e, field.name)} type={field.type} className={`field-${field.type ? field.type : 'default'}`} name={field.name}></textarea>
                        </div>
                    ) 
                }
                return (
                    <div className="short-field">
                        <label className="label">{field.name}</label>
                        <input value={this.state[field.name]}  onChange={(e) => this.handleChange(e, field.name)} type={field.type} className={`field-${field.type ? field.type : 'default'}`} name={field.name}></input>
                    </div>
                ) 
                
            })
        }
    }

    renderForm = () => {
        const {renderChildren, onSave, onCancel} = this.props
        return (
            <form 
                onSubmit={(e) => {
                    e.preventDefault()
                    onSave(this.state, onCancel)
                }} 
                className="generated-form">

                {this.renderFields()}
                {renderChildren()}
              
            </form>
        )
    }

  

    render () {
        return (
            <Fragment>
              {
                  this.props.generateFields ? this.renderForm() : this.renderWarn()
              }
            </Fragment>
        )
    }
}

export default Form
