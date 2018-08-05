import React, { Component } from 'react';
import Sidebar from './sidebar/Sidebar';
import Maps from './Maps';

const DEFAULT_PLACE_QUERY = 'Search for a place in the map';

// Initial Component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "login",
      loggedIn: false,
      username: sessionStorage.getItem('username'),
      user_id: sessionStorage.getItem('user_id'),
      places: [],
      userSearched: '',
      search: '',
      mapFocus: [34.0407, -118.2468],
      editPlace: DEFAULT_PLACE_QUERY,
      editPlace_id: 0,
      mapZoom: 2
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.placeSearch = this.placeSearch.bind(this);
    this.editPlace = this.editPlace.bind(this);
    this.displaySavedPlaces = this.displaySavedPlaces.bind(this);
  }

  // Query that retrieves saved places
  // This will be passed as a prop for the map to display
  displaySavedPlaces() {
    fetch('/place/' + this.state.user_id + '/' + this.state.username, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
      .then(res => res.json())
      .then(places => {this.setState({ places: places})});
  }

  componentDidMount() {
    // If logged in, render Account component
    if (sessionStorage.getItem('loggedIn')) {

      // Retrieve saved places from database
      this.displaySavedPlaces();

      this.setState({
        view: "account",
        loggedIn: true
      });
    }
    else { // Otherwise, render Login component
      this.setState({
        view: "login", // DEV: Set this to login
        loggedIn: false
      });
    }
  }

  login() {
    // Retrieve saved places from database
    this.displaySavedPlaces();

    this.setState({
      view: "account",
      loggedIn: sessionStorage.getItem('loggedIn'),
      username: sessionStorage.getItem('username'),
      user_id: sessionStorage.getItem('user_id')
    });
  }

  logout() {
    this.setState({
      view: 'login',
      loggedIn: false
    })
    sessionStorage.setItem('loggedIn', false);
    sessionStorage.setItem('username', '');
    sessionStorage.setItem('user_id', 0);
    sessionStorage.clear();
  }

  register() {
    this.setState({
      view: 'register'
    });
  }

  // Searchbar.jsx -> App.jsx
  // Place.jsx     -> App.jsx
  // App.jsx       -> Maps.jsx
  placeSearch(query) {
    if (query.length !== 0) {
      this.setState({
        search: query,
        mapFocus: [query[0].y, query[0].x],
        mapZoom: 10
      });
    }
    else {
      this.setState({search: ''});
    }
  }

  editPlace(place, place_id) {
    this.setState({
      editPlace: place.label,
      editPlace_id: place_id
    });
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <Sidebar view={this.state.view}
                   loggedIn={this.state.loggedIn}
                   username={this.state.username}
                   login={this.login} logout={this.logout}
                   register={this.register}
                   user_id={this.state.user_id}
                   placeSearch={this.placeSearch}
                   search={this.state.search}
                   editPlace={this.state.editPlace}
                   editPlace_id={this.state.editPlace_id}
                   default_place_query={DEFAULT_PLACE_QUERY}
                   displaySavedPlaces={this.displaySavedPlaces}/>
        </div>
        <Maps mapFocus={this.state.mapFocus}
              mapZoom={this.state.mapZoom}
              username={this.state.username}
              user_id={this.state.user_id}
              placeSearch={this.placeSearch}
              search={this.state.search}
              editPlace={this.editPlace}
              places={this.state.places}
              displaySavedPlaces={this.displaySavedPlaces}/>
      </div>
    );
  }
}

export default App;