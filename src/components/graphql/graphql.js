import { gql, useMutation } from "@apollo/client";
import { GraphQLEnumType } from "graphql";

export const SIGNUP = gql`
  mutation(
    $password: String!
    $email: String!
    $roll: String!
    $active: String!
    $backdata: String!
    $businessname: String!
  ) {
    createUser(
      email: $email
      password: $password
      roll: $roll
      active: $active
      backdata: $backdata
      businessname: $businessname
    ) {
      email
    }
  }
`;

export const SIGNIN = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      id
      roll
      email
      active
      backdata
    }
  }
`;

export const FILTERED_BANKDATA = gql`
  mutation($userid: String!, $seller: String!, $wholesaler: String!) {
    filteredBank(userid: $userid, seller: $seller, wholesaler: $wholesaler) {
      id
      bankcode
      seller
      wholesaler
      bankaccount
      bankowner
      wholesaler
      seller
    }
  }
`;

export const DELETE_BANKDATA = gql`
  mutation($userId: String!) {
    deleteBackdata(userId: $userId) {
      id
    }
  }
`;

export const VIEW_USER = gql`
  query {
    users {
      businessname
      email
      roll
      active
      createdAt
      id
    }
  }
`;

export const CHANGE_USER_ACTIVE = gql`
  mutation($id: ID!, $active: String!) {
    updateuserbyActive(id: $id, active: $active) {
      email
    }
  }
`;


export const CHANGE_USER_BACKDATA = gql`
  mutation($id: ID!, $backdata: String!) {
    updateuserbyBackdata(id: $id, backdata: $backdata) {
      id
    }
  }
`;





export const VIEW_PAGINATION = gql`
  mutation($roll: String!, $offset: Int!, $limit: Int!) {
    usersbyRollPagination(roll: $roll, offset: $offset, limit: $limit) {
      date
      name
      address
      phone
      code
      color
      size
      price
      amount
      id
      total
      email
      url
    }
  }
`;

export const VIEW_ORDER = gql`
  mutation($userId: ID!, $offset: Int!, $limit: Int!) {
    usersbyId(userId: $userId, offset: $offset, limit: $limit) {
      date
      name
      address
      phone
      code
      color
      size
      price
      amount
      id
      total
      url
    }
  }
`;

export const VIEW_ORDER_BYROLL = gql`
  query($roll: String!) {
    usersbyRoll(roll: $roll) {
      rawexcels {
        date
        name
        address
        phone
        code
        color
        size
        price
        amount
        id
        total
        email
      }
    }
  }
`;

export const CREATE_BANKDATA = gql`
  mutation(
    $userId: String!
    $seller: String!
    $wholesaler: String!
    $bankcode: String!
    $bankaccount: String!
    $bankowner: String!
  ) {
    createBankdata(
      userId: $userId
      seller: $seller
      wholesaler: $wholesaler
      bankcode: $bankcode
      bankaccount: $bankaccount
      bankowner: $bankowner
    ) {
      id
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation(
    $userId: ID!
    $date: String!
    $name: String!
    $address: String!
    $phone: String!
    $code: String!
    $color: String!
    $size: String!
    $price: String!
    $amount: String!
    $total: String!
    $roll: String!
    $email: String!
    $url: String!
  ) {
    createRawexcel(
      userId: $userId
      date: $date
      name: $name
      address: $address
      phone: $phone
      code: $code
      color: $color
      size: $size
      price: $price
      amount: $amount
      total: $total
      roll: $roll
      email: $email
      url: $url
    ) {
      id
    }
  }
`;
