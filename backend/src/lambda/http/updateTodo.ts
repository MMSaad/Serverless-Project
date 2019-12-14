import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await docClient.update({
    TableName: todoTable,
    Key:{
        'todoId':todoId
    },
    UpdateExpression: 'set #namefield = :n, dueDate = :d, done = :done',
    ExpressionAttributeValues: {
        ':n' : updatedTodo.name,
        ':d' : updatedTodo.dueDate,
        ':done' : updatedTodo.done
    },
    ExpressionAttributeNames:{
        "#namefield": "name"
      }
  }).promise()
  return {
    statusCode:204,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body: null
}
}
