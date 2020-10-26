from app import db
from sqlalchemy import VARCHAR, CHAR, Column, DateTime,\
    Float, ForeignKey, String, Text, text, Boolean
from sqlalchemy.dialects.postgresql import BIGINT, INTEGER
from sqlalchemy.orm import relationship
import uuid

AGENT_TYPES = {
    1: ["Natural Language Classifier", "Natural Language Classifiers"],
    2: ["Chat Bot", "Chat Bots"]
}

class Agent(db.Model):

    __tablename__ = 'agents'

    id = Column(BIGINT, primary_key=True, unique=True)
    type = Column(INTEGER, nullable=False)
    uuid = Column(VARCHAR(255), nullable=False, unique=True)
    name = Column(VARCHAR(255), unique=True)
    description = Column(Text)
    is_template = Column(Boolean, unique=False, default=False)
    is_locked = Column(Boolean, unique=False, default=False)
    is_main = Column(Boolean, unique=False, default=False)
    is_building = Column(Boolean, unique=False, default=False)

    modules = relationship('Module', backref=db.backref('agent'), order_by="Module.id")

    def __init__(self, type="", name="", description="", is_locked=False, is_main=False, is_template=False):
        self.type = type
        self.name = name
        self.description = description
        self.is_template = is_template
        self.is_locked = is_locked
        self.is_main = is_main
        self.uuid = uuid.uuid4().hex

    def format(self, deep=False):
        return {
            'id': self.id,
            'type': self.type,
            'uuid': self.uuid,
            'name': self.name,
            'description': self.description,
            'is_template': self.is_template,
            'is_locked': self.is_locked,
            'is_main': self.is_main,
            'is_building': self.is_building,
            'modules': [model.format(deep=deep) for model in self.modules]
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
