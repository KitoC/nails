import React, { Fragment } from "react";
import Button from "../buttons";
import Dialog from "../dialog";
import Form from "../form";
import { extractKeys } from "../../../utils";
import "./table.css";

const Table = props => {
  const {
    headers,
    content,
    width,
    endpoint,
    setLoading,
    schema,
    api,
    omittedFields
  } = props;

  console.log(content);

  return (
    <Fragment>
      <table className="default-table" style={{ width: width ? width : "80%" }}>
        <thead>
          <tr>
            {headers &&
              headers.map((header, i) => {
                return <th key={"headers" + i}>{header.name}</th>;
              })}

            <th colSpan="1">Crud operations</th>
          </tr>
        </thead>
        <tbody>
          {content &&
            content.map(row => {
              return (
                <tr key={row._id}>
                  {headers.map((header, i) => {
                    return row[header.name] ? (
                      <td key={"column" + i}>{row[header.name]}</td>
                    ) : (
                      <td key={"column" + i}>--</td>
                    );
                  })}

                  <td style={{ display: "flex" }}>
                    <Button onClick={() => console.log("TODO: show")}>
                      show
                    </Button>
                    <Dialog
                      content={closeDialog => (
                        <Form
                          onSave={api.update}
                          loadingText="Never gonna run around and desert you..."
                          generateFields={extractKeys(
                            schema[endpoint],
                            omittedFields
                          )}
                          onCancel={closeDialog}
                          prePopulate={row}
                          renderChildren={() => (
                            <div className="form-button-bar">
                              <p onClick={() => closeDialog()}>Cancel</p>
                              <Button>Save</Button>
                            </div>
                          )}
                        />
                      )}
                      header={`Edit ${endpoint}`}
                      link={openDialog => (
                        <Button onClick={() => openDialog()}>
                          edit {endpoint}
                        </Button>
                      )}
                    />
                    <Button onClick={() => api.destroy(row.id, setLoading)}>
                      delete
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Fragment>
  );
};

export default Table;
