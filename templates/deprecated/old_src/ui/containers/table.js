import {connect} from 'react-redux'
import { schemas, extractKeys } from "../../config/_client-config";
import Table from "../components/table";



const mapStateToProps = (state, ownProps) => ({
    content: state[ownProps.endpoint],
    headers: extractKeys(schemas[ownProps.endpoint], {created: true, updated: true}),
    ownProps: ownProps
  })
  
  const mapDispatchToProps = dispatch => ({
    // loadPosts: id => dispatch({type: 'READ_ALL', endpoint: '/posts'})
  })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Table)

