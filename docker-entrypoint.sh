#!/bin/bash

export TERM=xterm

if [ ! -d 'logs' ]; then
    mkdir -p logs
    mkdir -p logs/nginx
    mkdir -p logs/app
fi
if [ ! -d '/usr/share/nltk_data/' ]; then
    (echo "import nltk" ; echo "nltk.download('punkt')") | python3
    (echo "import nltk" ; echo "nltk.download('wordnet')") | python3
#    (echo "import nltk" ; echo "nltk.download('averaged_perceptron_tagger')") | python3
#    (echo "import nltk" ; echo "nltk.download('universal_tagset')") | python3
    mv nltk_data/ /usr/share/nltk_data/
fi
flask db upgrade
cd backend
cd  $HOME
if [ "$ENVIRONMENT" = "DEV" ] ; then
    cp $HOME/docker/nginx-dev.conf /etc/nginx/nginx.conf
    screen -dmS BACKEND bash -c 'flask run'
else
    #cd backend
    cp $HOME/docker/nginx-uwsgi.conf /etc/nginx/nginx.conf
    #screen -dmS BACKEND bash -c 'uwsgi uwsgi.ini'
    screen -dmS BACKEND bash -c 'flask run'
fi
cd
cd frontend
if [ "$ENVIRONMENT" = "DEV" ] ; then
    npm install
    screen -dmS FRONTEND bash -c 'npm run start'
else
    screen -dmS FRONTEND bash -c 'serve -s build -l 3000'
fi

cd $HOME

#cd lstm
#screen -dmS LSTM bash -c 'python3 main.py'

cd $HOME
nginx
tail -f logs/nginx/access.log -f logs/nginx/error.log
tail -f /dev/null
