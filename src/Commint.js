
import React, {Component} from 'react';

import ReactHtmlParser from 'html-react-parser';

import {Comment, Dropdown, Container, Divider, Header, Button, Segment, List, Grid, Label, Loader } from 'semantic-ui-react';

import axios from 'axios';
import moment from 'moment';

import { Com_Group } from './Post.js';

import { ComGroup } from './ComGroup.js';

const PATH_BASE = 'https://www.reddit.com';



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

/*
<div>

{ ( ( item.data.count || moreDone ) &&
    <MoreRep item={item} more={more} moreRep={this.moreRep} moreReplies={moreReplies} link={link} moreDone={moreDone} />
     )
||    <GenCom item={item} dispRep={this.dispRep} hideRep={this.hideRep} link={link} showReplies={showReplies} anyReplies={anyReplies} />

}
  </div>

*/


const GenCom = ({ item, moreReplies, moreRep, dispRep, hideRep, link, showReplies, anyReplies }) =>
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
        </Comment.Action> )
        ||
         ( anyReplies &&
           <Comment.Action onClick={() => dispRep()} style={{cursor:'pointer'}}>
           {`${item.data.replies.data.children.length} Replies`}
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


const MultCom = ({ item, moreReplies, moreRep, dispRep, hideRep, moreDone, more, showReplies, anyReplies, link }) =>
  <div>
  { ( item && ( ( moreDone &&
      more.map(extra =>
        ( (extra && <Commint key={extra.data.id} item={extra} link={link} />) || null) ))
  ||
   (showReplies && <With_Rep item={item} link={link} hideRep={this.hideRep} /> )
    ||
    ( anyReplies && <SumReplies item={item} dispRep={this.dispRep} />)
    ||
      ( item.data.count && <More_Rep item={item} moreReplies={moreReplies} moreRep={this.moreRep} />)
      ||
      <NoReplies item={item} /> ) ) || null}
    </div>


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



  const MoreRep = ({ item, moreRep, moreReplies, moreDone, more, link }) =>
    <div>
    {
      ( moreDone && more &&
        <Com_Group comms={more} link={link} />
           )
    ||
      <Segment>
        <Comment>
          <Comment.Content>

            <Comment.Action>
              { (moreReplies && <Button>Loading More Replies...</Button>)
                || <Button onClick={() => moreRep()}>Load {item.data.count} more replies</Button>
              }
            </Comment.Action>

          </Comment.Content>
        </Comment>
      </Segment>
    }
    </div>


  const More_Rep = ({ item, moreRep, moreReplies }) =>
    <Segment>
      <Comment>
      <Comment.Content>

      <Comment.Action>
      { (moreReplies && <Button>Loading More Replies...</Button>)
        || <Button onClick={() => moreRep()}>Load {item.data.count} more replies</Button>
      }
      </Comment.Action>

      </Comment.Content>
      </Comment>
    </Segment>

const With_Rep = ({ item, link, hideRep }) =>

    <Comment>
      <Comment.Content>
        <Comment.Author as='a'>{item.data.author}</Comment.Author>
        <Comment.Metadata>
         <div> {valid_date(item.data.created)} </div>
         <Point_Label score={item.data.score} />
          </Comment.Metadata>
        <Comment.Text><ToHtml str={item.data.body_html} /> </Comment.Text>

          <Comment.Action> <Button onClick={() => hideRep()} compact>
            Hide Replies
          </Button></Comment.Action>

        </Comment.Content>
        <Com_Group comms={item.data.replies.data.children} link={link} />
        </Comment>


const SumReplies = ({ item, dispRep }) =>
  <Comment>
    <Comment.Content>
      <Comment.Author as='a'>{item.data.author}</Comment.Author>
      <Comment.Metadata>
       <div> {valid_date(item.data.created)} </div>
       <Point_Label score={item.data.score} />
        </Comment.Metadata>
        <Comment.Text><ToHtml str={item.data.body_html} /> </Comment.Text>

    <Comment.Action onClick={() => dispRep()} style={{cursor:'pointer'}} compact>
    {`${item.data.replies.data.children.length} Replies`}
    </Comment.Action>

      </Comment.Content>
      </Comment>


const NoReplies = ({ item }) =>
  <Comment key={item.data.name}>
    <Comment.Content>
      <Comment.Author as='a'>{item.data.author}</Comment.Author>
      <Comment.Metadata>
       <div> {valid_date(item.data.created)} </div>
       <Point_Label score={item.data.score} />
      </Comment.Metadata>
      <Comment.Text><ToHtml str={item.data.body_html} /> </Comment.Text>
    </Comment.Content>
    </Comment>

export default Commint;
