import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { getUserId} from '../../helpers/authHelper'

const docClient = new DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
const userIdIndex = process.env.USER_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    const result = await docClient.query({
        TableName: todoTable,
        IndexName:userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues:{
            ':userId':userId
        }
    }).promise()
  

    return {
      statusCode: 200,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({
        items: result.Items
      })
    }

}




/**
 * Get value of the limit parameter if any.
 * @param {Object} event HTTP event passed to a Lambda function
 * @returns {number} parsed "limit" parameter
 */
function parseLimitParameter(event) {
    const limitStr = getQueryParameter(event, 'limit')
    if (!limitStr) {
      return undefined
    }
  
    const limit = parseInt(limitStr, 10)
    if (limit <= 0) {
      throw new Error('Limit should be positive')
    }
  
    return limit
  }


  /**
 * Get a query parameter or return "undefined"
 *
 * @param {Object} event HTTP event passed to a Lambda function
 * @param {string} name a name of a query parameter to return
 *
 * @returns {string} a value of a query parameter value or "undefined" if a parameter is not defined
 */
function getQueryParameter(event, name) {
    const queryParams = event.queryStringParameters
    if (!queryParams) {
      return undefined
    }
  
    return queryParams[name]
  }


  /**
 * Get value of the limit parameter.
 *
 * @param {Object} event HTTP event passed to a Lambda function
 *
 * @returns {Object} parsed "nextKey" parameter
 */
function parseNextKeyParameter(event) {
    const nextKeyStr = getQueryParameter(event, 'nextKey')
    console.log(nextKeyStr)
    if (!nextKeyStr) {
      return undefined
    }
  
    
    return {todoId:nextKeyStr+""}
  }


  /**
 * Encode last evaluated key using
 *
 * @param {Object} lastEvaluatedKey a JS object that represents last evaluated key
 *
 * @return {string} URI encoded last evaluated key
 */
function encodeNextKey(lastEvaluatedKey) {
    if (!lastEvaluatedKey) {
      return null
    }
  
    return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
  }