import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  if(!todoId){
    return {
        statusCode: 400,
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
        body:JSON.stringify({
          error: 'invalid parameters'
        })
      }
  }

  const param = {
      TableName: todoTable,
      Key:{
          "todoId":todoId
      }
  }

  const result = await docClient.delete(param).promise()
  return {
      statusCode:204,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body: null
  }
  
}
