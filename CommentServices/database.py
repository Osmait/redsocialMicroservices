from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


database_url = 'postgresql://osmait:admin123@postgres-user:5432/my_store'

engine = create_engine(database_url, echo=True)
Session = sessionmaker(bind=engine)

Base = declarative_base()
