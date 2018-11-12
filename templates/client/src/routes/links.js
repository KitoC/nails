import React, {Fragment} from "react";
import {connect} from 'react-redux'
import { Link, withRouter } from "react-router-dom";

const linkStyle = { margin: "5px", color: "white" };


const mapStateToProps = (state, ownProps) => ({
    endpoints: state.endpoints
})
  
const mapDispatchToProps = dispatch => ({
// loadPosts: id => dispatch({type: 'READ_ALL', endpoint: '/posts'})
})




const RenderLinks = ({endpoints}) => {
    return (
        <Fragment>
            <Link to='/' style={linkStyle} >Home</Link>
            { 
                endpoints.map(endpoint => (
                    <Link key={'link' + endpoint} style={linkStyle} to={`/${endpoint}`}>
                        {endpoint}
                    </Link>

                ))
            }
        </Fragment>
    )
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderLinks))