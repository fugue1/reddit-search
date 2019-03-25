import React, { Component } from 'react';

import axios from 'axios';
import moment from 'moment';

import {Comment, Header, Button, Segment, List, Grid, Label, Loader, Responsive, Dimmer } from 'semantic-ui-react';

import Commint from './Commint.js';
import {ComGroup} from './ComGroup.js';

const PATH_BASE = 'https://www.reddit.com';

export class Post extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      loadcomments: false,
      sortcomments: false,
      commints: []
    };

    this.loadCom = this.loadCom.bind(this);
    this.hideCom = this.hideCom.bind(this);
    this.sortCom = this.sortCom.bind(this);

  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  sortCom(sortmethod) {
    this.setState(state => ({ sortcomments: true }));
    axios(`${PATH_BASE}${this.props.item.data.permalink}&limit=100/.json${sortmethod}`)
      .then(result => {
        if (this._isMounted) {
         this.setState(state => ({ commints: result.data, sortcomments: false}) ) } } )
        }

  hideCom() {
    this.setState(state => ({ loadcomments: false, commints: [] }) );
  }

  loadCom() {
    this.setState(state => ({commints: [], loadcomments: true}));
    axios(`${PATH_BASE}${this.props.item.data.permalink}&limit=100/.json`)
      .then(result => {
        if (this._isMounted) {
         this.setState(state => ({ commints: result.data}) ) } } )
        }



  render() {

    const { item } = this.props;
    const { loadcomments, sortcomments, commints } = this.state;

    return (

      <Segment color='blue' raised>
      <List.Item >
        <List.Content>
          <List.Header>
          <Grid centered>

          <Grid.Row>
          <Segment color='orange' fluid='true'>
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
          (sortcomments && <Segment padded><Loader content='Sorting Comments...' active inline='centered'/> </Segment>)
          ||

        (  loadcomments && commints[1] &&


          <Segment textAlign='left' compact>
          <Grid columns={2} stackable>
          <Grid.Column textAlign='center'>
          <Button onClick={() => this.hideCom()} inline='centered' compact primary>Hide Comments</Button>
          </Grid.Column>
          <Grid.Column textAlign='center'>
          <SortCom sortCom={this.sortCom} sortcomments={sortcomments} />
          </Grid.Column>
          </Grid>

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


const SortCom = ({ sortCom, sortcomments }) =>
  <Button.Group size='tiny' compact>
    <Button color='green' style={{cursor:'text'}}>
      { (sortcomments && 'Sorting...')
        || 'Sort By' }
    </Button>
    <Button onClick={() => sortCom('?sort=controversial')}> Controversial </Button>
    <Button.Or />
    <Button onClick={() => sortCom('')}> Score </Button>
    <Button.Or />
    <Button onClick={() => sortCom('?sort=new')}> New </Button>
  </Button.Group>


const valid_date = date =>
  ( (moment.unix(date).isValid() && moment.unix(date).format('MMMM Do YYYY, h:mm:ss a').toString() ) || "Bad Date")

export default Post;
