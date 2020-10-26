from app import db
from sqlalchemy import VARCHAR, CHAR, Column, \
    DateTime, Float, ForeignKey, String, Text, text
from sqlalchemy.dialects.postgresql import BIGINT, INTEGER
from sqlalchemy.orm import relationship
import uuid


class Intent(db.Model):

    __tablename__ = 'intents'

    id = Column(BIGINT, primary_key=True, unique=True)
    name = Column(VARCHAR(255), nullable=False)
    uuid = Column(VARCHAR(255), nullable=False, unique=True)
    module_uuid = Column(ForeignKey('modules.uuid'), index=True)

    patterns = relationship('IntentPattern', backref=db.backref('intent'), order_by="IntentPattern.id")
    responses = relationship('IntentResponse', backref=db.backref('intent'), order_by="IntentResponse.id")

    def __init__(self, name="", module_uuid=None):
        self.module_uuid = module_uuid
        self.uuid = uuid.uuid4().hex
        self.name = name if name else self.uuid

    def format(self):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'module_uuid': self.module_uuid,
            'name': self.name,
            'patterns': [model.format() for model in self.patterns],
            'responses': [model.format() for model in self.responses]
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data={}):
        for field, value in data.items():
            setattr(self, field, value)
        db.session.commit()

    def delete(self):
        for model in self.patterns:
            model.delete()
        for model in self.responses:
            model.delete()
        db.session.delete(self)
        db.session.commit()
