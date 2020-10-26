from app import db
from sqlalchemy import VARCHAR, CHAR, Column, DateTime,\
    Float, ForeignKey, String, Text, text, Boolean
from sqlalchemy.dialects.postgresql import BIGINT, INTEGER
from sqlalchemy.orm import relationship
import uuid


class User(db.Model):

    __tablename__ = 'users'

    id = Column(BIGINT, primary_key=True, unique=True)
    uuid = Column(VARCHAR(255), nullable=False, unique=True)
    sub = Column(VARCHAR(255), nullable=False, unique=True)

    def __init__(self, sub=""):
        self.uuid = uuid.uuid4().hex
        self.sub = sub if sub else self.uuid

    def format(self, deep=False):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'sub': self.sub
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data={}):
        for field, value in data.items():
            setattr(self, field, value)
        db.session.commit()

    def delete(self):
        for model in self.modules:
            model.delete()
        db.session.delete(self)
        db.session.commit()
