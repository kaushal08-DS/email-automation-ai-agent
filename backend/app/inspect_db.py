from sqlalchemy import inspect
from app.db import engine

print("\nDATABASE URL:")
print(engine.url.render_as_string(hide_password=True))

print("\nDATABASE TABLES:")

inspector = inspect(engine)

tables = inspector.get_table_names()

if not tables:
    print("NO TABLES FOUND")
else:
    for table in tables:
        print(f"\n--- {table} ---")

        columns = inspector.get_columns(table)

        for column in columns:
            print(
                f"  {column['name']} "
                f"({column['type']}) "
                f"nullable={column['nullable']}"
            )