import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import { appReducer, modalReducer } from './redux/reducers';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { AppWithState as App } from './App';
import mockNetworkInterface from './test/mockNetworkInterface';
import './index.css';

// let networkInterface = createNetworkInterface({
//     uri: 'http://localhost:3000/graphql'
// });
let client;
if (process.env.NODE_ENV === 'development') {
  client = new ApolloClient({
    networkInterface: mockNetworkInterface
  });
} else {
  client = new ApolloClient();
}

// Apollo has a redux store by default- we're also
// using redux, though, so integrate apollo's store into ours.
const store = createStore(
  combineReducers({
    app: appReducer,
    modal: modalReducer,
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
