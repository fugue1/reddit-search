import React, { Component } from 'react';

import axios from 'axios';
import moment from 'moment';

import {Comment, Dropdown, Container, Divider, Header, Button, Segment, List, Grid, Label, Loader } from 'semantic-ui-react';

import Commint from './Commint.js';
import {ComGroup} from './ComGroup.js';

const PATH_BASE = 'https://www.reddit.com';

export class Post extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      loadcomments: false,
      commints: []
    };

    this.loadCom = this.loadCom.bind(this);
    this.hideCom = this.hideCom.bind(this);

  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadCom() {
    this.setState(state => ({commints: [], loadcomments: true}));
    axios(`${PATH_BASE}${this.props.item.data.permalink}&limit=100/.json`)
      .then(result => {
        if (this._isMounted) {
         this.setState(state => ({ commints: result.data}) ) } } )
        }

  hideCom() {
    this.setState(state => ({ loadcomments: false, commints: [] }) );
  }

  render() {

    const { item } = this.props;
    const { loadcomments, commints } = this.state;

    return (

      <Segment key={item.data.id} color='blue' raised>
      <List.Item >
        <List.Content>
          <List.Header>
          <Grid centered>

          <Grid.Row>
          <Segment fluid='true' size='large'>
            <h2><a href={PATH_BASE + item.data.permalink}>{item.data.title}</a></h2>

            <Label>Author<Label.Detail> {item.data.author}</Label.Detail> </Label>
            <Label>Subreddit<Label.Detail>{item.data.subreddit}</Label.Detail></Label>
            <Label>Score<Label.Detail>{item.data.score}</Label.Detail></Label>
            <Label>Comments<Label.Detail>{item.data.num_comments}</Label.Detail></Label>
            <Label>Date Submitted<Label.Detail>{valid_date(item.data.created)}</Label.Detail></Label>
          </Segment>

          </Grid.Row>
          <Grid.Row>
        {
        (  loadcomments && commints[1] &&

          <Segment textAlign='left'>
          <Button onClick={() => this.hideCom()} compact primary>Hide Comments</Button>
          <ComGroup comms={commints[1].data.children} link={item.data.permalink} />
          </Segment> )

          ||  (loadcomments && <Button compact>Loading Comments</Button>)

              || <Button onClick={() => this.loadCom()} primary compact>Embed Comments</Button>
        }
          </Grid.Row>
          </Grid>
          </List.Header>
        </List.Content>
        </List.Item>
    </Segment>
    );
  }
}

const valid_date = date =>
  ( (moment.unix(date).isValid() && moment.unix(date).format('MMMM Do YYYY, h:mm:ss a').toString() ) || "Bad Date")

export const Com_Group = ({ comms, link }) =>
  <Comment.Group threaded>
    {comms.map(item =>
        <Commint key={item.data.name} item={item} link={link} />
    )}
  </Comment.Group>


export default Post;
