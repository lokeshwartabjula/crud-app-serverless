import json
import boto3
import logging
from custom_encoder import CustomEncoder

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb_table_name = 'employee-data'
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(dynamodb_table_name)

get_method = 'GET'
post_method = 'POST'
patch_method = 'PATCH'
delete_method = 'DELETE'

health_path = '/health'
add_employee_path = '/addEmployee'
delete_employee_path = '/deleteEmployee'
edit_employee_path = '/editEmployee'
get_employee_path = '/getEmployees'

def lambda_handler(event, context):
    logger.info(event)

    if 'httpMethod' not in event or 'path' not in event:
        return buildResponse(400, 'Bad Request: httpMethod or path not provided')

    http_method = event['httpMethod']
    path = event['path']

    if http_method == get_method and path == health_path:
        response = buildResponse(200)
    elif http_method == get_method and path == get_employee_path:
        response = get_employees()
    elif http_method == post_method and path == add_employee_path:
        response = save_employee(json.loads(event.get('body', '{}')))
    elif http_method == patch_method and path == edit_employee_path:
        response = edit_employee(event, context)
    elif http_method == delete_method and path == delete_employee_path:
        response = delete_employee(event, context)
    else:
        response = buildResponse(404, 'Not Found')

    return response

def get_employees():
    try:
        response = table.scan()
        body = {
            'employeeList': response['Items']
        }
        return buildResponse(200, body)
    except Exception as e:
        logger.exception(f'An error occurred in fetching the employees: {str(e)}')
        return buildResponse(500, 'Internal Server Error')

def save_employee(request_body):
    try:
        table.put_item(Item=request_body)
        return buildResponse(200, {'message': 'Employee saved successfully'})
    except Exception as e:
        logger.exception(f'An error occurred in save employee method: {str(e)}')
        return buildResponse(500, 'Internal Server Error')

def buildResponse(status_code, body=None):
    response = {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
    if body is not None:
        response['body'] = json.dumps(body, cls=CustomEncoder)
    return response

def edit_employee(event, context):
    try:
        # Parse the request body
        request_body = json.loads(event['body'])
        id = request_body['id']
        # Update the employee data using ExpressionAttributeNames for reserved keyword
        response = table.update_item(
            Key={'id': id},
            UpdateExpression='SET firstName = :val1, lastName = :val2, email = :val3, salary = :val4, #dt = :val5',
            ExpressionAttributeValues={
                ':val1': request_body['firstName'],
                ':val2': request_body['lastName'],
                ':val3': request_body['email'],
                ':val4': request_body['salary'],
                ':val5': request_body['date']
            },
            ExpressionAttributeNames={
                '#dt': 'date'  # Placeholder for the reserved keyword 'date'
            },
            ReturnValues='ALL_NEW'
        )
        # Return the updated item
        return {
            'statusCode': 200,
            'body': json.dumps(response['Attributes'], cls=CustomEncoder)
        }
    except Exception as e:
        logger.error('Error updating employee: ' + str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def delete_employee(event, context):
    try:
        # Parse the id parameter
        id = event['queryStringParameters']['id']
        # Delete the employee
        print(id)
        table.delete_item(
            Key={'id': int(id)}
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Employee deleted successfully'})
        }
    except Exception as e:
        logger.error('Error deleting employee: ' + str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
