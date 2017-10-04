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
    _id: () => faker.random.uuid(),
    location: () => faker.lorem.word(),
    type: () => faker.random.word(),
    isRemote: () => faker.random.boolean(),
    thumbnail: () => faker.image.technics(),
    sensors: () => new MockList([2, 8])
  }),
  Sensor: () => ({
    _id: () => faker.random.uuid(),
    type: () => faker.random.word()
  })
};

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema, mocks });
const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

export default mockNetworkInterface;
