import React, { Component, Fragment } from "react";
import "./form.css";
import LoadingScreen from "../loading-screen";

class Form extends Component {
  state = {
    isLoading: false
  };
  componentDidMount() {
    this.mapInputsToState();
  }

  mapInputsToState = () => {
    const { generateFields, prePopulate } = this.props;

    generateFields.map(field => {
      console.log("field in loop", field);
      this.setState({
        [field.name]: prePopulate ? prePopulate[field.name] : null
      });
    });

    if (prePopulate) {
      this.setState(
        {
          id: prePopulate.id
        },
        () => console.log(this.state)
      );
    }
  };

  // handleChange = (e, fieldName) => {
  //     this.setState({
  //         [fieldName]: e.target.value
  //     })

  // }

  handleSave = () => {
    const { loadingText, onCancel, onSave } = this.props;
    console.log(this.state);
    const newFieldUpdate = this.state;
    for (let key in newFieldUpdate) {
      if (this.state[key] === null) {
        delete this.state[key];
      }
    }
    delete newFieldUpdate.isLoading;

    onSave(newFieldUpdate, () => {
      this.setState(
        {
          isLoading: true
        },
        () => {
          setTimeout(() => {
            this.setState(
              {
                isLoading: false
              },
              () => {
                onCancel();
              }
            );
          }, 2000);
        }
      );
    });
  };

  renderFields = () => {
    if (this.state) {
      return this.props.generateFields.map((field, i) => {
        console.log(field);
        if (field.type === "longText") {
          return (
            <div key={"field" + i} className="long-field">
              <label className="label">{field.name}</label>
              <textarea
                rows="4"
                value={this.state[field.name]}
                onChange={e => this.setState({ [field.name]: e.target.value })}
                type={field.type}
                className={`field-${field.type ? field.type : "default"}`}
                name={field.name}
              />
            </div>
          );
        }
        return (
          <div key={"field" + i} className="short-field">
            <label className="label">{field.name}</label>
            <input
              value={this.state[field.name]}
              onChange={e => this.setState({ [field.name]: e.target.value })}
              type={field.type}
              className={`field-${field.type ? field.type : "default"}`}
              name={field.name}
            />
          </div>
        );
      });
    }
  };

  renderForm = () => {
    const { renderChildren } = this.props;
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.handleSave();
        }}
        className="generated-form"
      >
        {this.renderFields()}
        {renderChildren()}
      </form>
    );
  };

  render() {
    return (
      <Fragment>
        {this.props.generateFields ? this.renderForm() : this.renderWarn()}

        {this.state.isLoading && (
          <LoadingScreen loadingText={this.state.loadingText} />
        )}
      </Fragment>
    );
  }
}

export default Form;
