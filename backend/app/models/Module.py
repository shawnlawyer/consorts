from app import db
from sqlalchemy import VARCHAR, CHAR, Column, Boolean, \
    DateTime, Float, ForeignKey, String, Text, text
from sqlalchemy.dialects.postgresql import BIGINT, INTEGER
from sqlalchemy.orm import relationship
import uuid


class Module(db.Model):

    __tablename__ = 'modules'

    id = db.Column(BIGINT, primary_key=True, unique=True)
    agent_uuid = Column(ForeignKey('agents.uuid'), index=True, nullable=True)
    name = db.Column(VARCHAR(255))
    uuid = Column(VARCHAR(255), nullable=False, unique=True)
    is_noise = Column(Boolean, unique=False, default=False)
    is_building = Column(Boolean, unique=False, default=False)

    intents = relationship('Intent', backref=db.backref('module'), order_by="Intent.id")

    def __init__(self, agent_uuid=None, name=""):
        self.agent_uuid = agent_uuid
        self.uuid = uuid.uuid4().hex
        self.name = name if name else self.uuid

    def format(self, deep=True):

        if deep:
            return {
                'id': self.id,
                'uuid': self.uuid,
                'agent_uuid': self.agent.uuid if self.agent else None,
                'type': self.agent.type if self.agent else None,
                'name': self.name,
                'is_noise': self.is_noise,
                'is_locked': self.is_locked(),
                'is_building': self.is_building,
                'intents': [model.format() for model in self.intents]
            }
        else:
            return {
                'id': self.id,
                'uuid': self.uuid,
                'agent_uuid': self.agent.uuid if self.agent else None,
                'type': self.agent.type if self.agent else None,
                'name': self.name,
                'is_noise': self.is_noise,
                'is_building': self.is_building,
                'is_locked': self.is_locked(),
            }

    def is_locked(self):

        if self.agent and self.agent.is_locked:
            return True

        return False

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data={}):
        for field, value in data.items():
            setattr(self, field, value)
        db.session.commit()

    def delete(self):
        for model in self.intents:
            model.delete()
        db.session.delete(self)
        db.session.commit()
