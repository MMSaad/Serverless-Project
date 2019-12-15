import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
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
