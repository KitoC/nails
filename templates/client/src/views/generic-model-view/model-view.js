import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Table from "../../ui/containers/table";
import Button from "../../ui/components/buttons";
import Dialog from "../../ui/components/dialog";
import Form from "../../ui/components/form";
import LoadingScreen from "../../ui/components/loading-screen";
import { extractKeys } from "../../utils";

const linkStyle = { margin: "20px 10px", color: "black" };

const ignoreColumns = { title: true };

class RenderModel extends Component {
  state = {
    endpoint: null,
    isLoading: true,
    loadingText: null
  };
  componentDidMount() {
    const { api } = this.props;
    this.setState(
      {
        endpoint: this.trimEndpoint(this.props.endpoint),
        loadingText: "Never gonna give you up..."
      },
      () => {
        api &&
          api.readAll(() => {
            setTimeout(() => {
              this.setState({
                isLoading: false
              });
            }, 2000);
          });
      }
    );
  }

  trimEndpoint(endpoint) {
    const plural = endpoint;
    const path = "/" + endpoint;
    const singular = endpoint.slice(0, -1);
    return {
      plural,
      path,
      singular
    };
  }
  render() {
    const { endpoint, isLoading } = this.state;
    const { api, models, omittedFields } = this.props;
    console.log(this.props);

    return (
      <Fragment>
        {endpoint && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Link style={linkStyle} to={endpoint.path}>
                Show All {endpoint.plural}
              </Link>
              <Dialog
                content={closeDialog => (
                  <Form
                    onSave={api.create}
                    loadingText="Never gonna let you down..."
                    generateFields={extractKeys(
                      models[endpoint.plural],
                      omittedFields
                    )}
                    onCancel={closeDialog}
                    renderChildren={() => (
                      <div className="form-button-bar">
                        <p onClick={() => closeDialog()}>Cancel</p>
                        <Button>Save</Button>
                      </div>
                    )}
                  />
                )}
                header={`New ${endpoint.singular}`}
                link={openDialog => (
                  <Button onClick={() => openDialog()}>
                    New {endpoint.singular}
                  </Button>
                )}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Table
                endpoint={endpoint.plural}
                api={api}
                omittedFields={ignoreColumns}
                setLoading={() => {
                  this.setState(
                    {
                      isLoading: true
                    },
                    () => {
                      setTimeout(() => {
                        this.setState({
                          isLoading: false
                        });
                      }, 2000);
                    }
                  );
                }}
              />
            </div>
          </div>
        )}
        {isLoading && <LoadingScreen loadingText={this.state.loadingText} />}
      </Fragment>
    );
  }
}

export default RenderModel;
