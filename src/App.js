import React, { Component } from 'react';
import './App.css';


import axios from 'axios';
import moment from 'moment';


import {Comment, Input, Dropdown, Container, Divider, Header, Button, Segment, List, Grid, Label, Loader, Responsive } from 'semantic-ui-react';

import Post from './Post.js'

const DEFAULT_QUERY = 'React';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://www.reddit.com';
const PATH_SUB = '/r/news';
const PATH_SEARCH = '/search.json';
const PARAM_SEARCH = 'q=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'limit=';



function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      sortKey: 'num_comments',
      searchTerm: DEFAULT_QUERY,
      embedded: false,
      error: null,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.sorted_By = this.sorted_By.bind(this);

  }


  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
  }

    event.preventDefault();
  }

  setSearchTopStories(result) {
    // const { hits, page } = result;
    const { children, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].children
      : [];

    const updatedHits = [
      ...oldHits,
      ...children
    ];

    this.setState({
      results: {
        ...results, [searchKey]: {children: updatedHits, page }
      },
      isLoading: false
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    axios(`${PATH_BASE}${PATH_SUB}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this.setSearchTopStories(result.data.data))
      .catch(error => this.setState({ error }));
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  unembed = (e) => this.setState(state => ({embedded: false}) );

  sorted_By = value => this.setState({sortKey: value});

  render() {
    const { searchTerm, results, searchKey, error, isLoading, sortKey } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list1 = ( results && results[searchKey] && results[searchKey].children) || [];
    const options = [{text: 'votes', value: 'score'},
                      {text: 'comments', value: 'num_comments'},
                       {text: 'date', value: 'created'}];
    const list = list1.sort((a, b) => b.data[sortKey] - a.data[sortKey]);


    return (
      <div className="page">

        <Header as='h1' textAlign='center' block>
          REDDIT SEARCH
        </Header>

        <Grid columns={2} stackable>
           <Grid.Column>

               <Input action={<Button type="submit" onClick={this.onSearchSubmit} primary>Search</Button>}
                 value={searchTerm}
                 onChange={this.onSearchChange}
                 onSubmit={this.onSearchSubmit}

                 />

           </Grid.Column>
           <Grid.Column>

               <SortButton sorted_By={this.sorted_By} />

           </Grid.Column>
        </Grid>


          <EmbedList list={list} />

      </div>
    );
  }
}

/*
<Segment.Group horizontal>
  <Segment>
  <div className="interactions">
    <Search
      value={searchTerm}
      onChange={this.onSearchChange}
      onSubmit={this.onSearchSubmit}>
      Search
    </Search>
  </div>
  </Segment>
  <Segment>


  <div className="interactions">
    <SortButton sorted_By={this.sorted_By} />
  </div>
  </Segment>
  </Segment.Group>
*/

const SortButton = ({ sorted_By }) =>

  <Button.Group size='large' >
    <Label color='green' size='big'>
      Sort By:
    </Label>
    <Button onClick={() => sorted_By('num_comments')}> Comments </Button>
    <Button.Or />
    <Button onClick={() => sorted_By('score')}> Votes </Button>
    <Button.Or />
    <Button onClick={() => sorted_By('created')}> Date </Button>
  </Button.Group>


const EmbedList = ({ list  }) =>
  <Responsive as={Segment}>
    <List divided>
      {list.map(item =>
        <Post key={item.data.id} item={item} />
      )}
      </List>
    </Responsive>


  const Loading = () =>
    <div>Loading ... </div>

  const withLoading = (Component) => ({ isLoading, ...rest}) =>
    isLoading ? <Loading /> : <Component {...rest} />

  const ButtonWithLoading = withLoading(Button);

  const Search = ({ value, onChange, onSubmit, children }) =>
        <form onSubmit={onSubmit}>
          <input type="text" value={value} onChange={onChange} />
          <Button type="submit" primary> {children} </Button>
        </form>

export default App;
