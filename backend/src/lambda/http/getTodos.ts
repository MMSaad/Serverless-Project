import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'


const docClient = new DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //TODO: Handle logged user and filter based on him
  let nextKey // Next key to continue scan operation if necessary
  let limit // Maximum number of elements to return

  
  try {
    // Parse query parameters
    nextKey = parseNextKeyParameter(event)
    limit = parseLimitParameter(event) || 20
    console.log(nextKey,limit)
  } catch (e) {
    console.log('Failed to parse query parameters: ', e.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Invalid parameters'
      })
    }
  }

  const scanParams = {
    TableName: todoTable,
    Limit: limit,
    ExclusiveStartKey: nextKey
  }

  const result = await docClient.scan(scanParams).promise()

  if(!result.$response){
    return {
      statusCode: 500,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body:JSON.stringify({
        error: 'an error occured'
      })
    }
  }
  

    return {
      statusCode: 200,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({
        items: result.Items,
        lastKey: result.LastEvaluatedKey
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