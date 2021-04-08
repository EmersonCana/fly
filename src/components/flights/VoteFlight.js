import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '../../firebase'
import { createMuiTheme, Dialog, Box, Divider, Button, CircularProgress } from '@material-ui/core'

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
}



class VoteFlight extends Component {
    state = initialState
    render() {
        const { flightId } = this.props
        const { loading, success } = this.state


        return(
            <>
            <Button
                variant={success ? "outlined" : "contained"}
                color={success ? "secondary" : "primary"}
                disabled={loading}
                onClick={() => this.postVote(flightId)}
              >
                {success ? 'VOTED' : 'VOTE'}
                {loading && <CircularProgress size={24} style={styles.buttonProgress} />}
              </Button>
            </>
        )
        
    }
    
    async postVote(flightId) {
        if(!this.state.success) {
            if (flightId) {
                this.setState({ loading: true })
                const votesRef = this.props.firebase.votes()
                const voteRef = await votesRef.doc()
                
                const flightRef = await this.props.firebase.flight(flightId)
                const userRef = await this.props.firebase.user(this.props.userId)


                await voteRef.set({
                  flight: flightRef,
                  voter: userRef
                })
                await this.props.firebase.voteFlight(this.props.userId, voteRef)
                await this.props.firebase.incrementVote(flightId)
        
                this.setState({ loading: false, success: true })
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
