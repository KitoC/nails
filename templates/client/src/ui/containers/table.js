import { connect } from "react-redux";
import { extractKeys } from "../../utils";
import Table from "../components/table";

const mapStateToProps = (state, ownProps) => ({
  content: state[ownProps.endpoint],
  headers: extractKeys(state.models[ownProps.endpoint]),
  schema: state.models,
  omittedFields: state.omittedFields,
  ownProps: ownProps,
  state: state
});

const mapDispatchToProps = dispatch => ({
  // loadPosts: id => dispatch({type: 'READ_ALL', endpoint: '/posts'})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table);
