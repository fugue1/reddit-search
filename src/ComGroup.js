import React, { Component } from 'react';

import axios from 'axios';
import moment from 'moment';

import {Comment, Dropdown, Container, Divider, Header, Button, Segment, List, Grid, Label, Loader } from 'semantic-ui-react';

import Commint from './Commint.js';

const PATH_BASE = 'https://www.reddit.com';

function addExtra(arr, lids, num) {

  if (arr.length == 20) {

    arr.push({ data:
      {count: num - 20, children: lids }});
    };

  return arr;

}

export class ComGroup extends Component {

  constructor(props){
    super(props);

    this.state = {
      dcomms : this.props.comms.slice(),
      moreReplies: false,

    }

    this.moreRep = this.moreRep.bind(this);
    this.addMore = this.addMore.bind(this);
    this.get_Ids = this.get_Ids.bind(this);

  }


  get_Ids(item, link) {

    const num_ids = item.data.count;

    const taken = Math.min(20, num_ids);

    const ids = item.data.children;

    const rids = ids.slice(0, taken);

    const lids = ids.slice(taken);

    axios.all(rids.map(rid => axios(`${PATH_BASE}${link}${rid}.json`)))
        .then(results => this.addMore(addExtra(results.map(result => result.data[1].data.children[0]), lids, num_ids)));

    }


    addMore(moreids) {

      console.log(moreids);

      this.setState(state => {

          const { dcomms } = state;
          const update = [ ...dcomms.slice(0,-1), ...moreids ];


         return { dcomms: update, moreReplies: false };
    }, () => console.log(this.state.dcomms));
  }


    moreRep(item) {

      this.setState(state => ({ moreReplies: true }) );

      this.get_Ids(item, this.props.link);

    }

    render() {

      const { comms, link } = this.props;
      const { dcomms, moreReplies } = this.state;


      return (

        <Comment.Group threaded>
          {dcomms && dcomms.map(item =>
            item && item.data &&
            (
            (item.data.count && <MoreRep key={item.data.id} item={item} moreRep={this.moreRep} moreReplies={moreReplies} link={link} />)
            ||
              <Commint key={item.data.name} item={item} link={link} />
            )
          )}

        </Comment.Group>

      );
    }

  }



const MoreRep = ({ item, moreRep, moreReplies, link }) =>

    <Segment>
      <Comment>
        <Comment.Content>

          <Comment.Action>
            { (moreReplies && <Button>Loading More Replies...</Button>)
              || <Button onClick={() => moreRep(item)}>Load {item.data.count} more replies</Button>
            }
          </Comment.Action>

        </Comment.Content>
      </Comment>
    </Segment>


    /*
      componentDidMount() {
        this.setState(state => ({ dcomms: this.props.comms}), () => console.log(this.state.dcomms));
      }
  */
