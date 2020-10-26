"""Init Tables

Revision ID: ad4feb378d0a
Revises: 
Create Date: 2020-09-19 17:45:25.621969

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ad4feb378d0a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('agents',
    sa.Column('id', sa.BIGINT(), nullable=False),
    sa.Column('type', sa.INTEGER(), nullable=False),
    sa.Column('uuid', sa.VARCHAR(length=255), nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_template', sa.Boolean(), nullable=True),
    sa.Column('is_locked', sa.Boolean(), nullable=True),
    sa.Column('is_main', sa.Boolean(), nullable=True),
    sa.Column('is_building', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id'),
    sa.UniqueConstraint('name'),
    sa.UniqueConstraint('uuid')
    )
    op.create_table('modules',
    sa.Column('id', sa.BIGINT(), nullable=False),
    sa.Column('agent_uuid', sa.VARCHAR(length=255), nullable=True),
    sa.Column('name', sa.VARCHAR(length=255), nullable=True),
    sa.Column('uuid', sa.VARCHAR(length=255), nullable=False),
    sa.Column('is_noise', sa.Boolean(), nullable=True),
    sa.Column('is_building', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['agent_uuid'], ['agents.uuid'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id'),
    sa.UniqueConstraint('uuid')
    )
    op.create_index(op.f('ix_modules_agent_uuid'), 'modules', ['agent_uuid'], unique=False)
    op.create_table('intents',
    sa.Column('id', sa.BIGINT(), nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), nullable=False),
    sa.Column('uuid', sa.VARCHAR(length=255), nullable=False),
    sa.Column('module_uuid', sa.VARCHAR(length=255), nullable=True),
    sa.ForeignKeyConstraint(['module_uuid'], ['modules.uuid'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id'),
    sa.UniqueConstraint('uuid')
    )
    op.create_index(op.f('ix_intents_module_uuid'), 'intents', ['module_uuid'], unique=False)
    op.create_table('intent_patterns',
    sa.Column('id', sa.BIGINT(), nullable=False),
    sa.Column('uuid', sa.VARCHAR(length=255), nullable=False),
    sa.Column('intent_uuid', sa.VARCHAR(length=255), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['intent_uuid'], ['intents.uuid'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id'),
    sa.UniqueConstraint('uuid')
    )
    op.create_index(op.f('ix_intent_patterns_intent_uuid'), 'intent_patterns', ['intent_uuid'], unique=False)
    op.create_table('intent_responses',
    sa.Column('id', sa.BIGINT(), nullable=False),
    sa.Column('uuid', sa.VARCHAR(length=255), nullable=False),
    sa.Column('intent_uuid', sa.VARCHAR(length=255), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['intent_uuid'], ['intents.uuid'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id'),
    sa.UniqueConstraint('uuid')
    )
    op.create_index(op.f('ix_intent_responses_intent_uuid'), 'intent_responses', ['intent_uuid'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_intent_responses_intent_uuid'), table_name='intent_responses')
    op.drop_table('intent_responses')
    op.drop_index(op.f('ix_intent_patterns_intent_uuid'), table_name='intent_patterns')
    op.drop_table('intent_patterns')
    op.drop_index(op.f('ix_intents_module_uuid'), table_name='intents')
    op.drop_table('intents')
    op.drop_index(op.f('ix_modules_agent_uuid'), table_name='modules')
    op.drop_table('modules')
    op.drop_table('agents')
    # ### end Alembic commands ###