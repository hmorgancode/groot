import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import { modalReducer, addPlantModalReducer } from './redux/reducers';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import App from './App';
import './index.css';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3000/graphql'
  })
});

// Apollo has a redux store by default- we're also
// using redux, though, so integrate apollo's store into ours.
const store = createStore(
  combineReducers({
    modal: modalReducer,
    addPlantModal: addPlantModalReducer,
    apollo: client.reducer()
  }),
  {}, // initial state (empty because instead, we define in reducers)
  compose(
    applyMiddleware(client.middleware()),
    (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
);

// Note: ApolloProvider replaces react-redux's Provider
ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('i-am-root')
);
