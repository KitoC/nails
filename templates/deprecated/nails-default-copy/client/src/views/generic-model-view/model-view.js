import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Table from "../../ui/containers/table";
import {api} from '../../store'
import Button from '../../ui/components/buttons'
import Dialog from '../../ui/components/dialog'
import Form from '../../ui/components/form'
import { schemas, extractKeys } from "../../config/_client-config";


const linkStyle = { margin: "20px 10px", color: "black" };

const ignoreColumns =  {created: true, updated: true, _id: true, postId: true}

class RenderPosts extends Component {
    state = {
      endpoint: null
    }
    componentDidMount() {
      this.setState({
        endpoint: this.trimEndpoint(this.props.endpoint)
      }, () => {
        api[this.state.endpoint.plural].readAll()
        console.log(extractKeys(schemas[this.state.endpoint.plural]))
      })
    }

  

    trimEndpoint (endpoint) {
     
      const plural = endpoint
      const path = '/' + endpoint
      const singular = endpoint.slice(0, -1)
      return {
        plural,
        path,
        singular
      }
    }
    render() {
      const {endpoint} = this.state

        return (
         
          <Fragment>
            {endpoint && 
              
                   <div>
                  <div style={{display:  'flex', alignItems: 'center',  justifyContent: 'center'}}>
                   <Link style={linkStyle} to={endpoint.path}>
                      Show All {endpoint.plural}
                    </Link>
                    <Dialog
                      content={(closeDialog) => ( 
                        <Form 
                          onSave={(newObj) => api[endpoint.plural].create(newObj, closeDialog)}
                          generateFields={extractKeys(schemas[endpoint.plural], ignoreColumns)}
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
                      link={(openDialog) => (
                        <Button onClick={() => openDialog()}>New {endpoint.singular}</Button>
                      )} 
                    />
                    
                  </div>
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                 <Table endpoint={endpoint.plural}  />
                 </div>


                 </div>
              
            }
          </Fragment>    
          );
    }
  
};

export default RenderPosts;