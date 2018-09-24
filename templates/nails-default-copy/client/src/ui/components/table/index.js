import React from "react";
import { api } from '../../../store'
import Button from '../buttons'
import Dialog from '../dialog'
import Form from '../form'
import { schemas, extractKeys } from "../../../config/_client-config";
import './table.css'


const Table = ({ headers, content, width, endpoint }) => {
 
  return (
    <table className="default-table" style={{width: width ? width : '80%'}}>
      <thead>
        <tr>{headers && headers.map(header => {
          return <th>{header.name}</th>
        })}
        
        <th colSpan="1">Crud operations</th>
        </tr>
        
      </thead>
      <tbody>
        {content &&
          content.map(row => {
            
            return (
              <tr key={row._id}>

                {headers.map(header => {
                  return row[header.name] ? <td>{row[header.name]}</td> : <td>--</td> 
                })}

                <td style={{display: 'flex'}}>
          
                <Button onClick={() => console.log('TODO: show')}>show</Button>
                <Dialog
                  content={(closeDialog) => ( 
                    <Form
                      onSave={(updatedObj) => api[endpoint].update({...updatedObj, _id: row._id}, closeDialog)}
                      prePopulate={row}
                      formFields={extractKeys(schemas[endpoint], {created: true, updated: true, _id: true, postId: true})} />
                  )} 
                  header={`Editing data entry -- ${row._id}`}
                  link={(openDialog) => (
                    <Button onClick={() => openDialog()}>edit</Button>
                  )} 
                />
                 <Button onClick={() => api[endpoint].destroy(row._id)}>delete</Button>
                </td>
                
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default Table;
