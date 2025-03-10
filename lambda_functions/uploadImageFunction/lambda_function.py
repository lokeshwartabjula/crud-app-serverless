import json
import base64
import boto3
from datetime import datetime
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    
    print(event)
    get_file_content = event["content"]
    username = event["username"]
    key = event['filename']

    decode_content = base64.b64decode(get_file_content)
    
    bucket_secret_name = "b00936909-image-bucket"  # Updated bucket secret name
    region_name = "us-east-1"
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    get_bucket_name_response = None  # Initialize with a default value
    
    try:
        get_bucket_name_response = client.get_secret_value(
            SecretId=bucket_secret_name
        )
    except ClientError as e:
        print(e)
    
    # Check if get_bucket_name_response is not None before using it
    if get_bucket_name_response and 'SecretString' in get_bucket_name_response:
        bucket_name_response = json.loads(get_bucket_name_response['SecretString'])
        bucket_name = bucket_name_response.get('b00936909-image-bucket', None)  # Change the bucket name here
        
        if bucket_name is not None:
            print(bucket_name)
            
            s3_upload = s3.put_object(Bucket=bucket_name, Key=key, Body=decode_content)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                    'Access-Control-Max-Age': '3600',
                },
                'body': json.dumps('File stored in S3.')
            }
    
    # Handle the case when an exception occurred or the bucket name is not available
    print("Error retrieving secret value or bucket name.")
    return {
        'statusCode': 500,
        'body': json.dumps('Error retrieving secret value or bucket name.')
    }
