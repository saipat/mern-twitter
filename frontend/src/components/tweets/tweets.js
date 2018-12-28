import React from 'react';
import { withRouter } from 'react-router-dom';
import TweetBox from './tweet_box';

class Tweet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tweets: []
        };
    }

    //This is called b4 render. Only lifecycle method called on server rendering.
    componentWillMount() {
        this.props.fetchTweets();
    }
    
    //Invoked b4 a mounted component recieve props.
    //This lets us define things we want to happen when a component receives new props.  //In this case, we're calling setState which is a built in method in the react library which updates our component's local state and forces the component to rerender with our updated info.
    componentWillReceiveProps(newState) {
        this.setState({ tweets: newState.tweets });
    }

    render() {
        if (this.state.tweets.length === 0) {
            return (
                <div>There are no Tweets</div>
            )
        } else {
            return (
                <div>
                    <h2>All Tweets</h2>
                    {this.state.tweets.map(tweet => (
                        <TweetBox key={tweet._id} text={tweet.text} />
                    ))}
                </div>
            );
        }
    }
}

export default withRouter(Tweet);