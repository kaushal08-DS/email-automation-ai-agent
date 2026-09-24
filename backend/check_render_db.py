import getpass
import psycopg2

DATABASE_URL = getpass.getpass(
    "Paste your Render External Database URL: "
)

try:
    conn = psycopg2.connect(
        DATABASE_URL,
        sslmode="require",
    )

    cur = conn.cursor()

    cur.execute("""
        SELECT
            current_database(),
            current_user,
            current_schema();
    """)

    print("\nDATABASE CONNECTION:")
    print(cur.fetchone())

    cur.execute("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)

    print("\nTABLES:")

    tables = cur.fetchall()

    if not tables:
        print("No public tables found.")
    else:
        for row in tables:
            print(row)

    cur.close()
    conn.close()

    print("\nDatabase connection successful.")

except Exception as e:
    print("\nDATABASE CONNECTION FAILED:")
    print(e)