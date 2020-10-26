from app import db

from sqlalchemy import VARCHAR, CHAR, Column,\
    DateTime, Float, ForeignKey, String, Text, text
from sqlalchemy.dialects.postgresql import BIGINT, INTEGER
from sqlalchemy.orm import relationship
import uuid


class IntentPattern(db.Model):

    __tablename__ = 'intent_patterns'

    id = Column(BIGINT, primary_key=True, unique=True)
    uuid = Column(VARCHAR(255), nullable=False, unique=True)
    intent_uuid = Column(ForeignKey('intents.uuid'), nullable=False, index=True)
    text = Column(Text, nullable=False)

    def __init__(self, intent_uuid=None, text=""):
        self.uuid = uuid.uuid4().hex
        self.intent_uuid = intent_uuid
        self.text = text

    def format(self):
        return {
          'id': self.id,
          'uuid': self.uuid,
          'text': self.text
        }

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data={}):
        for field, value in data.items():
            setattr(self, field, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
