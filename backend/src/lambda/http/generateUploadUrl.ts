import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: process.env.region,
    params: {Bucket: process.env.IMAGES_BUCKET}
  });
  const signedUrlExpireSeconds = 60 * 5

    const url = s3.getSignedUrl('putObject', {
      Bucket: process.env.IMAGES_BUCKET,
      Key: `${todoId}.png`,
      Expires: signedUrlExpireSeconds
    });
  

    return {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
            uploadUrl: url
        })
    }
}
