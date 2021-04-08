import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '../../firebase'
import { createMuiTheme, Dialog, Box, Divider, Button, CircularProgress } from '@material-ui/core'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
    container: {
      height: 310,
      width: 500,
      padding: 20,
    },
    collapsedContainer: {
      height: 470,
      width: 700,
      padding: 20,
    },
    selectCountry: {
      width: '100%',
      transition: 'width .35s ease-in-out'
    },
    selectAirport: {
      width: 240,
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }
  

const initialState = {
    enabled: true,
    loading: false,
    success: false,
    date: new Date(),
    open: false,
}

class VoteFlight extends Component {
    state = initialState
    render() {
        const { flightId } = this.props
        const { loading, success, open } = this.state

        const handleClickOpen = () => {
            this.setState({open: true})
          };
        
          const handleClose = () => {
            this.setState({open: false})
          };


        return(
            <>
            <Button
                variant={success ? "outlined" : "contained"}
                color={success ? "secondary" : "primary"}
                disabled={loading}
                onClick={() => this.setState({ open: true })}
                
              >
                Delete
              </Button>
              <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete?"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this flight?
                        
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={() => this.postDelete(flightId)} color="primary" autoFocus>
                        Yes
                    </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
        
    }
    
    async postDelete(flightId) {
        if(!this.state.success) {
            if (flightId) {
                console.log(flightId)
                this.setState({ loading: true })
                await this.props.firebase.deletePost(flightId)
                await this.props.firebase.removePost(this.props.userId, flightId)
                await this.props.firebase.removeVotes(this.props.userId, flightId)

                this.setState({ loading: false, success: true, open: false })
              }
        }
    }
}



const mapStateToProps = (state) => ({
    userId: state.auth.user.uid
})

export default connect(
    mapStateToProps
)(withFirebase(VoteFlight))
