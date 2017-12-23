/**
 * Network interface for mocking the GraphQL endpoint.
 * (The schema is a copy-paste from rocket; nothing programmatic is
 * keeping it up-to-date.)
 */
import { makeExecutableSchema, addMockFunctionsToSchema, MockList } from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import faker from 'faker';

const typeDefs = `

  scalar Date # imported from graphql-date, see resolvers

  type Query {
    plants: [Plant]
    boards: [Board]
    sensors: [Sensor]
    plant: Plant
    board: Board
    sensor: Sensor
    #### See what else you need.
  }

  type Plant {
    _id: ID!
    name: String!
    altName: String
    thumbnail: String
    tags: [String!]
    notes: String
    board: Board!
    sensors: [Sensor!]
  }

  # Microcontroller - Currently Arduino mega/uno/nano
  type Board {
    _id: ID!
    location: String!
    type: String
    isRemote: Boolean
    thumbnail: String
    sensors: [Sensor!]
  }

  # Analog and Digital sensors plugged into a microcontroller
  type Sensor {
    _id: ID!
    type: String!
    board: Board!
    dataPin: Int!
    powerPin: Int
    data: [SensorData!]
  }

  type SensorData {
    date: Date!
    reading: Int # 0 to 1024 as a portion of input voltage
    temperature: Float # degrees C
    humidity: Float # percent
  }

  input SensorInput {
    reading: Int
    temperature: Float
    humidity: Float
  }

  type Mutation {
    createPlant (
      name: String!
      board: ID!
      thumbnail: String
      altName: String
      tags: [String!]
      notes: String
      sensors: [ID!]
    ): Plant

    updatePlant (
      _id: ID!
      name: String
      thumbnail: String
      board: ID
      altName: String
      tags: [String!]
      notes: String
      sensors: [ID!]
    ): Plant

    deletePlant (
      _id: ID!
    ): Plant

    createBoard (
      location: String!
      type: String
      isRemote: Boolean
      thumbnail: String
      sensors: [ID!]
    ): Board

    updateBoard (
      _id: ID!
      location: String
      type: String
      isRemote: Boolean
      thumbnail: String
      sensors: [ID!]
    ): Board

    deleteBoard (
      _id: ID!
    ): Board

    createSensor (
      type: String!
      board: ID!
      dataPin: Int!
      powerPin: Int
    ): Sensor

    updateSensor (
      _id: ID!
      type: String
      board: ID
      dataPin: Int
      powerPin: Int
    ): Sensor

    deleteSensor (
      _id: ID!
    ): Sensor

    # context: boards send sensor data but aren't aware of IDs.
    # so, on the server, derive sensor from board location & sensor datapin
    createSensorData (
      location: String!
      dataPin: Int!
      data: SensorInput!
    ): Sensor

    deleteSensorData (
      _id: ID!
      # for now, we only need to wipe all data. Later, add ranges
      # from: Date
      # to: Date
    ): Sensor
  }

  # since we've added mutations, we need to tell the server which types represent
  # the root query and root mutation types
  schema {
    query: Query
    mutation: Mutation
  }
`;

// you need each plant's board to have an _id that is actually
// present in the list of boards.
// So, create a list of existing board ids for plants to have.
const boardIds = [ faker.random.uuid() ];
let firstBoardCreated = false;

// do you have this arguments order right?
// the fourth is def. context, but not sure what else
// the mocks are doin'
function boardIdResolver(root, obj, args, context) {
  // is root a plant? Then return one of the board IDs.
  // (@TODO clean this up, you should probably just recursively check context.path)
  if (context.rootValue.plants != null || context.path.prev.prev.key === 'createPlant') {
    // (it looks like plants are all called first, so they'll all just
    // have the first board. Maybe try and change that and randomize later
    // if you really, really need it for your mocks.
    // return boardIds[Math.floor(Math.random() * boardIds.length)];
    return boardIds[0];
  }
  // Otherwise, is this the first board? Give it that initial mock ID so that
  // all the plants actually point to a real board.
  if (!firstBoardCreated && context.rootValue.boards != null) {
    firstBoardCreated = true;
    return boardIds[0];
  }
  // Otherwise, create a new unique ID and add it to the list of board IDs.
  // (This might be redundant depending on the order in which our resolvers get
  // called)
  // boardIds.push(faker.random.uuid());
  // return boardIds[boardIds.length - 1];
  return faker.random.uuid();
}

const mocks = {
  Query: () => ({
    // arbitrarily get 5-12 plants/boards/sensors
    plants: () => new MockList([5, 12]),
    boards: () => new MockList([5, 12]),
    sensors: () => new MockList([5, 12])
  }),
  Plant: () => ({
    _id: () => faker.random.uuid(),
    name: () => faker.lorem.words(),
    altName: () => faker.lorem.words(),
    thumbnail: () => faker.image.nature(),
    // create 0 to 3 tags containing 3 to 8 characters
    // i am sorry
    tags: () => new MockList([0, 3], () => faker.random.uuid().slice(0, 3 + Math.floor(Math.random() * 5.5))),
    notes: () => faker.lorem.paragraph(),
    sensors: () => new MockList([0, 5])
  }),
  Board: () => ({
    _id: boardIdResolver,
    location: () => faker.lorem.word(),
    type: () => faker.random.word(),
    isRemote: () => faker.random.boolean(),
    thumbnail: () => faker.image.technics(),
    sensors: () => new MockList([2, 8])
  }),
  Sensor: () => ({
    _id: () => faker.random.uuid(),
    type: () => faker.random.word()
  }),
  Mutation: () => ({
    createPlant: (root, obj) => {
      // reminder: obj is the object submitted.
      // if this is supposed to be an updated, existing object, send it right back.
      if (obj._id) {
        return obj;
      }
      // if it's a new object, create a new _id and return the object
      obj._id = faker.random.uuid();
      return obj;
    },
    updatePlant: (root, obj) => obj,
    deletePlant: (root, obj) => obj,
    createBoard: (root, obj) => {
      if (obj._id) {
        return obj;
      }
      obj._id = faker.random.uuid();
      return obj;
    },
    updateBoard: (root, obj) => obj,
    deleteBoard: (root, obj) => obj,
  })
  // you query createPlant, and the response isn't using your vanilla query resolvers,
  // it's just doing wtf
};

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema, mocks });
const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

export default mockNetworkInterface;
