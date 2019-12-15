import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { getUserId} from '../../helpers/authHelper'

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

  const authHeader = event.headers['Authorization']
  const userId = getUserId(authHeader)

  const item = await docClient.query({
    TableName: todoTable,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues:{
        ':todoId': todoId
    }
}).promise()
if(item.Count == 0){
    throw new Error('TODO not exists');
}

if(item.Items[0].userId !== userId){
    throw new Error('TODO does not belong to authorized user')
}

  const param = {
      TableName: todoTable,
      Key:{
          "todoId":todoId
      }
  }

   await docClient.delete(param).promise()
  return {
      statusCode:204,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body: null
  }
  
}
