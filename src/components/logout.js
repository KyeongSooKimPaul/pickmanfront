import React, { Component ,Fragment} from 'react'


export class Logout extends Component {

    constructor(props) {
        super(props)
        this.state = {
            _id : 1,
            userInfo : [],
        }

    }

 

    componentWillMount() {
        window.localStorage.clear()
        window.location = "/"
    }


    render() {
    
        return (
<div>
    \
</div>
        )
    }
}

export default Logout
