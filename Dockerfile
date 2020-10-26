FROM fedora:28
WORKDIR /var/www/html
EXPOSE 80

ARG tensorflow_installed=1

RUN dnf -y update && dnf clean all

RUN dnf install -y sudo && \
    adduser user && \
    echo "user ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/user && \
    chmod 0440 /etc/sudoers.d/user

RUN dnf install -y \
    gcc \
    python3-devel \
    nginx \
    screen \
    unzip \
    wget \
    nodejs \
    && dnf clean all \
    && npm update -g \
    && npm install -g n \
    && npm install -g serve \
    && npm cache clean -f \
    && n stable \
    && pip3 install --upgrade setuptools \
    && pip3 install --upgrade pip

#RUN chown user /var/www/html/

#USER user

COPY . /var/www/html

RUN sudo pip install -r backend/requirements.txt

ENTRYPOINT ["./docker-entrypoint.sh"]

