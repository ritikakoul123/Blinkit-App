from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Import your Base class here (adjust import path as necessary)
from database.connection import Base  # or from your actual models module if different

# from app.models import cart, category, order_item, order, product, user
from app.models.cart import Cart
from app.models.category import Category
from app.models.order_item import OrderItem
from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.models.role import Role

target_metadata = Base.metadata

# This will allow Alembic to track schema changes
# target_metadata = Base.metadata

# The rest of your environment setup code remains unchanged
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
