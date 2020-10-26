# Consorts

## CMS and API for Building Natural Language Classifiers

###
Natural Language Classifiers apply deep learning to predict predefined classifications for text and return the best matching classifications.

The goal of this project is to easily build and deploy classification models and be a tool for NLP research.


## Development Setup
```

cp .env.example .env   
  
docker-compose up -d --build  
  
docker exec -it capstone_app_1 bash

cd backend

python3 migrate.py db upgrade

```

##### Then browse to http://localhost/


## API Tech Stack

- [Flask](http://flask.pocoo.org/) A Python lightweight WSGI web application framework.

- [SQLAlchemy](https://www.sqlalchemy.org/) A Python SQL toolkit and Object Relational Mapper. 

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) A Flask extension for handling Cross Origin Resource Sharing (CORS), making cross-origin AJAX possible.

- [Tensorflow](https://www.tensorflow.org/) An end-to-end open source machine learning platform. 


## API Testing

```

docker exec -it capstone_app_1 bash

cd backend

python3 test.py

```

## API Documentation

### GET '/api/agents'

#### Retrieve agents
- Request Arguments: None
- Returns: An array of objects 
```
{
  "results": [
    {
      "id": 1, 
      "is_locked": true, 
      "is_main": null, 
      "modules": [
        {
          "id": 1, 
          "is_locked": true, 
          "name": "base", 
          "uuid": "ec9fdf03ea18afe386c71150e532bb4d"
        },
        ...
      ], 
      "name": "main"
    },
    ...
  ], 
  "total_results": 5
}


```

### GET '/api/modules'

#### Retrieve modules
- Request Arguments: None
- Returns: An array of objects 
```
{
  "results": [
    {
      "id": 25, 
      "is_locked": false, 
      "name": "faq", 
      "uuid": "c71150e532bb4dec9fdf03ea18afe386"
    },
    ...
  ], 
  "success": true, 
  "total_results": 4
}


```

### DELETE /api/agents/<int:agent_id>

#### Delete agent

- Request Arguments: Agent Id
- Returns: An object with key success: true.

Example Response

```
{
    "success":true
}
```

### DELETE /api/agents/<int:agent_id>/modules/<int:module_id>

#### Delete agent module using a agent ID and module ID

- Request Arguments: Agent Id
- Returns: An object with key success: true.

Example Response

```
{
    "success":true
}
```

### DELETE /api/modules/<int:module_id>

#### Delete module

- Request Arguments: Module Id
- Returns: An object with key success: true.

#### Example Response

```
{
    "success":true
}
```

### DELETE /api/intents/<int:intent_id>

#### Delete intent

- Request Arguments: Intent Id
- Returns: An object with key success: true.

Example Response

```
{
    "success":true
}
```

### DELETE /api/intent/patterns/<int:intent_pattern_id>

#### Delete intent pattern

- Request Arguments: IntentPattern Id
- Returns: An object with key success: true.

Example Response

```
{
    "success":true
}
```

### DELETE /api/intent/responses/<int:intent_response_id>

#### Delete intent response

- Request Arguments: IntentResponse Id
- Returns: An object with key success: true.

##### Example Response

```
{
    "success":true
}
```

### POST /api/agents

#### Create agent

- Request Body: name.
- Returns: An object with keys success and agent.

##### Example Request Payload

```
{
    "data":
        { 
        "name": "Agent Name"
        }
}
```

##### Example Response

```
{
  "result": {
    "id": 42, 
    "is_locked": false, 
    "is_main": false, 
    "modules": [], 
    "name": "foo"
  }, 
  "success": true
}
```

### POST /api/modules

#### Create module

- Request Body: name, intents.
- Returns: An object with keys success and agent.

##### Example Request Payload

```
{
    "data":{ 
        "code": {
            "name": "base",
            "intents": [
                {
                    "name": "greeting",
                    "patterns": [
                        {
                            "text": "Hi"
                        },
                        {
                            "text": "Hello"
                        },
                        ...
                    ],
                    "responses": [
                        {
                            "text": "Hello, what can I help with?"
                        },
                        ...
                    ]
                },
                ...
            }
    }
}
```
##### Example Response

```
{
  "result": {
    "id": 42, 
    "is_locked": false, 
    "is_main": false, 
    "modules": [], 
    "name": "foo"
  }, 
  "success": true
}
```

### POST /agents/<int:agent_id>/modules

#### Create a module inclusion on an agent using a agent ID

- Request Body: module_id.
- Returns: An object with keys success and agent.

##### Example Request Payload

```
{data: {agent_id: 7, module_id: 1}}
```

##### Example Response

```
{
  "result": {
    "description": null, 
    "id": 7, 
    "is_locked": false, 
    "is_main": false, 
    "modules": [
      {
        "id": 1, 
        "is_locked": true, 
        "name": "base", 
        "uuid": "ec9fdf03ea18afe386c71150e532bb4d"
      }
    ], 
    "name": "fd"
  }, 
  "success": true
}
```

### POST /chat/<str:agent_name>

#### Chat with an agent using a agent name

- Request Body: message.
- Returns: An object with response, confidence and classification name.

##### Example Request Payload

```
{message: "hello"}
```

##### Example Response

```
{
  "result": {
    "description": null, 
    "id": 7, 
    "is_locked": false, 
    "is_main": false, 
    "modules": [
      {
        "id": 1, 
        "is_locked": true, 
        "name": "base", 
        "uuid": "ec9fdf03ea18afe386c71150e532bb4d"
      }
    ], 
    "name": "fd"
  }, 
  "success": true
}

```

### PATCH /agents/<int:agent_id>/unlock

#### Unlock agent using a agent name

- Request Body: empty
- Returns: An object with keys success and agent.

##### Example Response

```
{
  "result": {
    "description": null, 
    "id": 7, 
    "is_locked": false, 
    "is_main": false, 
    "modules": [
      {
        "id": 1, 
        "is_locked": true, 
        "name": "base", 
        "uuid": "ec9fdf03ea18afe386c71150e532bb4d"
      }
    ], 
    "name": "foo"
  }, 
  "success": true
}

```

### PATCH /agents/<int:agent_id>/lock

#### Lock agent using a agent name

- Request Body: empty
- Returns: An object with keys success and agent.

##### Example Response

```
{
  "result": {
    "description": null, 
    "id": 7, 
    "is_locked": true, 
    "is_main": false, 
    "modules": [
      {
        "id": 1, 
        "is_locked": true, 
        "name": "base", 
        "uuid": "ec9fdf03ea18afe386c71150e532bb4d"
      }
    ], 
    "name": "foo"
  }, 
  "success": true
}

```

### PATCH /agents/<int:agent_id>

#### PATCH agent using a agent ID

- Request Body: name
- Returns: An object with keys success and agent.

##### Example Request Payload

```
{data: {name: "foo"}}
```

##### Example Response

```
{
  "result": {
    "description": null, 
    "id": 7, 
    "is_locked": true, 
    "is_main": false, 
    "modules": [
      {
        "id": 1, 
        "is_locked": true, 
        "name": "base", 
        "uuid": "ec9fdf03ea18afe386c71150e532bb4d"
      }
    ], 
    "name": "foo"
  }, 
  "success": true
}

```


### PATCH /modules/<int:module_id>

#### PATCH module using a module ID

- Request Body: name, intents
- Returns: An object with keys success and module.

##### Example Request Payload

```
{
    "data":{ 
        "code": {
            "name": "base",
            "intents": [
                {
                    "name": "greeting",
                    "patterns": [
                        {
                            "text": "Hi"
                        },
                        {
                            "text": "Hello"
                        },
                        ...
                    ],
                    "responses": [
                        {
                            "text": "Hello, what can I help with?"
                        },
                        ...
                    ]
                },
                ...
            }
    }
}
```

##### Example Response

```
{
  "result": {
    "id": 25, 
    "intents": [
      {
        "id": 184, 
        "name": "greeting", 
        "patterns": [
          {
            "id": 826, 
            "text": "Hi"
          }, 
          {
            "id": 827, 
            "text": "Hello"
          }, 
          {
            "id": 828, 
            "text": "You there"
          }, 
          {
            "id": 829, 
            "text": "Is anyone there"
          }, 
          {
            "id": 830, 
            "text": "Hello"
          }, 
          {
            "id": 831, 
            "text": "Hey"
          }, 
          {
            "id": 832, 
            "text": "Moo"
          }, 
          {
            "id": 833, 
            "text": "Hola"
          }
        ], 
        "responses": [
          {
            "id": 320, 
            "text": "Hello, what can I help with?"
          }, 
          {
            "id": 321, 
            "text": "Hi there, how can I help?"
          }
        ]
      },
      ...
      {
        "id": 196, 
        "name": "love", 
        "patterns": [
          {
            "id": 873, 
            "text": "what is love"
          }
        ], 
        "responses": [
          {
            "id": 351, 
            "text": "baby don`t hurt me "
          }, 
          {
            "id": 352, 
            "text": "There are a lot of chemicals racing around your brain and body when you're in love. ... Dopamine is thought to be the \"pleasure chemical,\" producing a feeling of bliss. Norepinephrine is similar to adrenaline and produces the racing heart and excitement."
          }
        ]
      }
    ], 
    "is_locked": false, 
    "name": "faqs", 
    "uuid": "c71150e532bb4dec9fdf03ea18afe386"
  }, 
  "success": true
}


```


### POST /modules/<int:module_id>/fit

#### Train and build module tensorflow model

- Request Body: empty
- Returns: An object with key success.

##### Example Response

```
{
  "success": true
}
```

