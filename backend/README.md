# iConsorts


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
