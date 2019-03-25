
import React, {Component} from 'react';

import ReactHtmlParser from 'html-react-parser';

import {Comment, Button, Segment, Label } from 'semantic-ui-react';

import axios from 'axios';
import moment from 'moment';

import { ComGroup } from './ComGroup.js';

const PATH_BASE = 'https://www.reddit.com';

const HIDE = '   Hide Comments';



export class Commint extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      showReplies: false,
      anyReplies: false,
    };

    this.dispRep = this.dispRep.bind(this);
    this.hideRep = this.hideRep.bind(this);

  }

  componentDidMount() {
    this._isMounted = true;
    this.setState(state => ({anyReplies: ((this.props.item.data.replies && this.props.item.data.replies.data) ?
                true: false ) }) );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  dispRep() {
    this.setState(state => ({showReplies: true}));
  }

  hideRep() {
    this.setState(state => ({showReplies: false}));
  }

  render() {
    const { showReplies, anyReplies } = this.state;
    const { item, link } = this.props;

    return (
  <GenCom item={item} dispRep={this.dispRep} hideRep={this.hideRep} link={link} showReplies={showReplies} anyReplies={anyReplies} />
    );
  }
}


const GenCom = ({ item, dispRep, hideRep, link, showReplies, anyReplies }) =>
  <Comment>
    <Comment.Content>
      <Comment.Author as='a'>{item.data.author}</Comment.Author>
      <Comment.Metadata>
       <div> {valid_date(item.data.created)} </div>
       <Point_Label score={item.data.score} />
        </Comment.Metadata>
      <Comment.Text><ToHtml str={item.data.body_html} /> </Comment.Text>

        {
          ( showReplies &&
        <Comment.Action onClick={() => hideRep()} style={{cursor:'pointer'}}>
          Hide Replies
        </Comment.Action>
                          )
        ||
         ( anyReplies &&
           <Comment.Action onClick={() => dispRep()} style={{cursor:'pointer'}}>
            <ReplyCase item={item} />
           </Comment.Action>)
           ||
            null
          }

      </Comment.Content>
      {
        ( showReplies &&
      <ComGroup comms={item.data.replies.data.children} link={link} />)
      || null
              }
  </Comment>


const HideReplies = () => {
  const spc = '     '
  return `${spc} Hide Replies`
}

const ReplyCase = ({ item }) => {
  const num = item.data.replies.data.children.length;
  if (num == 1) {
    return `${num} Reply`
  } else {
    return `${num} Replies`
  }
}

const ToHtml = ({str}) =>
 <div>{ReactHtmlParser(ReactHtmlParser(str))}</div>

const valid_date = date =>
  ( (moment.unix(date).isValid() && moment.unix(date).format('MMMM Do YYYY, h:mm:ss a').toString() ) || "Bad Date")

const Point_Label = ({ score }) =>
  <div>
    {((score >= 0) && <Label color='green' circular>{score}</Label>)
      ||
        <Label color='red' circular>{score}</Label>
    }
  </div>


export default Commint;
